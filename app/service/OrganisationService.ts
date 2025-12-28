import { adminDB } from "@/app/lib/firebase/admin";

/**
 * STEP 1: Create just the ID so Better-Auth is happy.
 */
export async function createOrganisationShell(name: string) {
  const orgRef = await adminDB.collection("organization").add({
    name: name.trim(),
    createdAt: new Date(),
    status: "pending", // Optional: mark as pending until user is created
  });
  return orgRef.id;
}

/**
 * STEP 2: Link the user and add the slug/member record.
 */
export async function finalizeOrganisation(
  orgId: string,
  organisationName: string,
  userId: string
) {
  const baseSlug = organisationName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const uniqueSlug = `${baseSlug}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;

  // Update the existing document we created in the shell
  await adminDB
    .collection("organization")
    .doc(orgId)
    .update({
      slug: uniqueSlug,
      status: "active",
      metadata: { ownerId: userId },
    });

  // Create the Member Record (The Many-to-Many link)
  await adminDB.collection("member").add({
    organizationId: orgId,
    userId: userId,
    role: "owner",
    createdAt: new Date(),
  });

  return { id: orgId, slug: uniqueSlug };
}
