"use server";

import { auth } from "@/app/lib/auth";
import { log } from "console";
import { headers } from "next/headers";

export async function getOrganization() {
  try {
    const headerList = await headers();

    const session = await auth.api.getSession({
      headers: headerList,
    });

    console.log(session, "SESSIon");

    if (!session) {
      throw new Error("Not authenticated");
    }

    const orgsResponse = await auth.api.listOrganizations({
      headers: headerList,
    });

    console.log(orgsResponse, "ORGS RESPONSE");

    const organizations = Array.isArray(orgsResponse)
      ? orgsResponse
      : (orgsResponse as any)?.organizations || [];

    if (organizations.length === 0) {
      return null;
    }

    const organization = organizations[0];

    const membersResponse = await auth.api.listMembers({
      body: {
        organizationId: organization.id,
      } as any,
      headers: headerList,
    });

    return {
      organization,
      members: membersResponse?.members || [],
    };
  } catch (error: any) {
    console.error("Error fetching organization:", error);
    throw new Error(error.message || "Failed to fetch organization");
  }
}
