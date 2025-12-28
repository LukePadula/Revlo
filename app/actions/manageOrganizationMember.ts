"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function removeMember(organizationId: string, memberId: string) {
  try {
    const headerList = await headers();

    const response = await auth.api.removeMember({
      body: {
        organizationId,
        userId: memberId,
      },
      headers: headerList,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error removing member:", error);
    throw new Error(error.message || "Failed to remove member");
  }
}

export async function updateMemberRole(
  organizationId: string,
  memberId: string,
  role: "owner" | "admin" | "member"
) {
  try {
    const headerList = await headers();

    const response = await auth.api.updateMember({
      body: {
        organizationId,
        userId: memberId,
        role,
      },
      headers: headerList,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating member role:", error);
    throw new Error(error.message || "Failed to update member role");
  }
}

export async function updateOrganization(
  organizationId: string,
  name: string,
  slug?: string
) {
  try {
    const headerList = await headers();

    const response = await auth.api.updateOrganization({
      body: {
        organizationId,
        name,
        slug,
      },
      headers: headerList,
    });

    return { success: true, organization: response.organization };
  } catch (error: any) {
    console.error("Error updating organization:", error);
    throw new Error(error.message || "Failed to update organization");
  }
}

