"use server";

import createUser from "@/app/lib/createUser";
import {
  createOrganisationShell,
  finalizeOrganisation,
} from "@/app/service/OrganisationService";

export async function createOrganization({
  name,
  email,
  password,
  organizationName,
}: {
  name: string;
  email: string;
  password: string;
  organizationName: string;
}) {
  try {
    if (!organizationName || !organizationName.trim()) {
      throw new Error("Organisation name is required");
    }

    // 1. Create a "Shell" to get an ID for Better-Auth
    const orgId = await createOrganisationShell(organizationName);

    // 2. Create the User (linked to that orgId)
    const userResult = await createUser(name, email, password, orgId);

    // 3. Finalize the Org (add the slug and create the Member record)
    const finalOrg = await finalizeOrganisation(
      orgId,
      organizationName,
      userResult.user.id
    );

    return {
      success: true,
      organisation: finalOrg,
    };
  } catch (error: any) {
    console.error("Signup Error:", error.message);
    // Return the error as data instead of crashing the server
    return {
      success: false,
      error: error.message.includes("already exists")
        ? "Email already in use"
        : "Failed to create account",
    };
  }
}
