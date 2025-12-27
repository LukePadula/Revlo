"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function createOrganization(organizationName: string) {
  try {
    if (!organizationName || !organizationName.trim()) {
      throw new Error("Organization name is required");
    }

    const headerList = await headers();

    // Create organization with the user as owner
    const orgResponse = await auth.api.createOrganization({
      body: {
        name: organizationName.trim(),
        slug: organizationName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      },
      headers: headerList,
    });

    if (!orgResponse?.organization) {
      console.error("Failed to create organization:", orgResponse);
      throw new Error("Failed to create organization");
    }

    console.log("✅ Organization created:", orgResponse.organization.id);

    return {
      success: true,
      organization: orgResponse.organization,
    };
  } catch (error: any) {
    console.error("Create organization error:", error);

    let errorMessage = "Failed to create organization";
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    }

    throw new Error(errorMessage);
  }
}

