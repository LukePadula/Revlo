"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { adminDB } from "@/app/lib/firebase/admin";
import { sendOrganizationInviteEmail } from "@/server/email/send";

export async function inviteUser(
  email: string,
  role: "admin" | "member" = "member"
) {
  try {
    const headerList = await headers();

    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session) {
      throw new Error("Not authenticated");
    }

    const orgsResponse = await auth.api.listOrganizations({
      headers: headerList,
    });

    const organizations = Array.isArray(orgsResponse)
      ? orgsResponse
      : (orgsResponse as any)?.organizations || [];

    if (organizations.length === 0) {
      throw new Error("No organization found");
    }

    const organization = organizations[0];

    const membersResponse = await auth.api.listMembers({
      body: {
        organizationId: organization.id,
      },
      headers: headerList,
    });

    const currentUserMember = membersResponse?.members?.find(
      (m: any) => (m.userId || m.user?.id) === session.user.id
    );

    if (
      !currentUserMember ||
      (currentUserMember.role !== "owner" && currentUserMember.role !== "admin")
    ) {
      throw new Error("Only owners and admins can invite users");
    }

    // Check if user already exists
    const existingUser = await adminDB
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      // User exists, add them to organization
      const userId = existingUser.docs[0].id;

      // Check if they're already a member (using "member" collection)
      const existingMember = await adminDB
        .collection("member")
        .where("organizationId", "==", organization.id)
        .where("userId", "==", userId)
        .limit(1)
        .get();

      if (!existingMember.empty) {
        throw new Error("User is already a member of this organization");
      }

      // Add them as a member using better-auth API
      try {
        const addMemberResponse = await auth.api.addMember({
          body: {
            organizationId: organization.id,
            userId: userId,
            role: role,
          },
          headers: headerList,
        });

        if (addMemberResponse?.member) {
          return { success: true, message: "User added to organization" };
        }
      } catch (apiError: any) {
        // If API fails, try direct Firestore
        console.warn(
          "Better-auth API failed, trying direct Firestore:",
          apiError.message
        );
      }

      await adminDB.collection("member").add({
        organizationId: organization.id,
        userId: userId,
        role: role,
        createdAt: new Date(),
      });

      try {
        const userData = existingUser.docs[0].data();
        await sendOrganizationInviteEmail({
          recipientEmail: email,
          recipientName: userData.name || undefined,
          organizationName: organization.name,
          inviterName: session.user.name || session.user.email,
          invitationUrl: `${protocol}://${host}/portal/dashboard`,
          role: role,
        });
      } catch (emailError: any) {
        console.warn("Failed to send notification email:", emailError);
        // Don't fail the invitation if email fails
      }

      return { success: true, message: "User added to organization" };
    } else {
      const invitationId = `inv_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const host = headerList.get("host") || "localhost:3000";
      const invitationUrl = `${protocol}://${host}/invite/${invitationId}`;

      await adminDB
        .collection("invitations")
        .doc(invitationId)
        .set({
          organizationId: organization.id,
          email: email,
          role: role,
          invitedBy: session.user.id,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          status: "pending",
          invitationUrl: invitationUrl,
        });

      // Send invitation email
      try {
        await sendOrganizationInviteEmail({
          recipientEmail: email,
          organizationName: organization.name,
          inviterName: session.user.name || session.user.email,
          invitationUrl: invitationUrl,
          role: role,
        });
      } catch (emailError: any) {
        console.error("Failed to send invitation email:", emailError);
        // Still return success but log the error
        // The invitation is created, they can use the link manually if needed
      }

      return {
        success: true,
        message: "Invitation sent",
        invitationUrl,
      };
    }
  } catch (error: any) {
    console.error("Error inviting user:", error);
    throw new Error(error.message || "Failed to invite user");
  }
}
