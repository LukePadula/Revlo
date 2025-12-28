"use server";

import { auth } from "@/app/lib/auth";
import { adminDB } from "@/app/lib/firebase/admin";
import { log } from "console";
import { headers } from "next/headers";
import { FieldPath } from "firebase-admin/firestore";

export async function getOrganization() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log(session, "SESSION USER");
  if (!session?.user) return null;

  const orgId = session.session.activeOrganizationId;
  if (!orgId) return null;

  try {
    const orgDoc = await adminDB.collection("organization").doc(orgId).get();
    if (!orgDoc.exists) return null;

    const orgData = orgDoc.data() || {};
    const userIds: string[] = [];

    const memberData: { [key: string]: any } = {};

    const membersSnap = await adminDB
      .collection("member")
      .where("organizationId", "==", orgId)
      .get();

    membersSnap.docs.forEach((doc) => {
      const data = doc.data();
      userIds.push(data.userId);
      memberData[data.userId] = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      };
    });

    console.log(memberData, "MEMBER DATA 1");
    console.log(userIds, "USER IDS");

    const usersSnap = await adminDB
      .collection("users")
      .where(FieldPath.documentId(), "in", userIds)
      .get();

    console.log(
      usersSnap.docs.map((doc) => doc.data()),
      "USERS SNAP"
    );

    usersSnap.docs.forEach((doc) => {
      const userData = doc.data();
      const userId = doc.id;

      memberData[userId] = {
        ...memberData[userId],
        user: {
          ...userData,
          createdAt: userData.createdAt?.toDate?.()?.toISOString() || null,
          updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || null,
        },
      };
    });

    console.log(memberData, "MEMBER DATA");

    return {
      organization: {
        id: orgDoc.id,
        ...orgData,
        createdAt: orgData.createdAt?.toDate?.()?.toISOString() || null,
      },
      members: Object.values(memberData),
    };
  } catch (error) {
    console.error("DB Query Error:", error);
    return null;
  }
}
