import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { adminDB } from "@/app/lib/firebase/admin";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const invitationId = params.id;

    if (!invitationId) {
      return NextResponse.json(
        { error: "Invitation ID is required" },
        { status: 400 }
      );
    }

    const headerList = await headers();

    // Get current session
    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to accept an invitation" },
        { status: 401 }
      );
    }

    // Get invitation from Firestore
    const invitationDoc = await adminDB
      .collection("invitations")
      .doc(invitationId)
      .get();

    if (!invitationDoc.exists) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    const invitation = invitationDoc.data();

    // Check if invitation is expired
    if (invitation?.expiresAt) {
      const expiresAt = invitation.expiresAt.toDate
        ? invitation.expiresAt.toDate()
        : new Date(invitation.expiresAt);
      
      if (expiresAt < new Date()) {
        return NextResponse.json(
          { error: "expired" },
          { status: 400 }
        );
      }
    }

    // Check if invitation is already accepted
    if (invitation?.status === "accepted") {
      return NextResponse.json(
        { error: "This invitation has already been accepted" },
        { status: 400 }
      );
    }

    // Check if email matches
    if (invitation?.email !== session.user.email) {
      return NextResponse.json(
        { error: "This invitation was sent to a different email address" },
        { status: 403 }
      );
    }

    // Get organization
    const orgDoc = await adminDB
      .collection("organization")
      .doc(invitation.organizationId)
      .get();

    if (!orgDoc.exists) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const organization = orgDoc.data();

    // Check if user is already a member
    const existingMember = await adminDB
      .collection("member")
      .where("organizationId", "==", invitation.organizationId)
      .where("userId", "==", session.user.id)
      .limit(1)
      .get();

    if (!existingMember.empty) {
      // User is already a member, mark invitation as accepted
      await adminDB
        .collection("invitations")
        .doc(invitationId)
        .update({
          status: "accepted",
          acceptedAt: new Date(),
        });

      return NextResponse.json({
        success: true,
        organizationName: organization?.name,
        message: "You are already a member of this organization",
      });
    }

    // Add user to organization using better-auth API
    try {
      const addMemberResponse = await auth.api.addMember({
        body: {
          organizationId: invitation.organizationId,
          userId: session.user.id,
          role: invitation.role || "member",
        } as any,
        headers: headerList,
      });

      if (addMemberResponse?.member) {
        // Mark invitation as accepted
        await adminDB
          .collection("invitations")
          .doc(invitationId)
          .update({
            status: "accepted",
            acceptedAt: new Date(),
          });

        return NextResponse.json({
          success: true,
          organizationName: organization?.name,
          message: "Successfully joined organization",
        });
      }
    } catch (apiError: any) {
      console.warn("Better-auth API failed, trying direct Firestore:", apiError.message);
    }

    // Fallback: Add directly to Firestore
    await adminDB.collection("member").add({
      organizationId: invitation.organizationId,
      userId: session.user.id,
      role: invitation.role || "member",
      createdAt: new Date(),
    });

    // Mark invitation as accepted
    await adminDB
      .collection("invitations")
      .doc(invitationId)
      .update({
        status: "accepted",
        acceptedAt: new Date(),
      });

    return NextResponse.json({
      success: true,
      organizationName: organization?.name,
      message: "Successfully joined organization",
    });
  } catch (error: any) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

