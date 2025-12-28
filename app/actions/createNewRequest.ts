"use server";

import { RequestDetails, DocumentCategoryMap } from "@/types";
import { adminDB } from "../lib/firebase/admin";
import { DocumentRequest } from "@/types";
import * as admin from "firebase-admin";
import { sendRequestLinkEmail } from "@/server/email/send";
import { headers } from "next/headers";
import { auth } from "../lib/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export async function createNewRequest(
  requestDetails: RequestDetails,
  categories: DocumentCategoryMap
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const orgId = session.session.activeOrganizationId;
  if (!orgId) {
    throw new Error("No organization found");
  }

  const newRequest: DocumentRequest = {
    id: null,
    organizationId: orgId,
    createdBy: session.user.id,
    requestDetails: requestDetails,
    requestedCategories: categories,
    dataPolicy: { encrypt: true, autoDeletePeriod: "30", auditTrail: true },
    audit: {
      created: admin.firestore.FieldValue.serverTimestamp(),
      viewed: null,
      submitted: null,
    },
  };

  const docRef = await adminDB.collection("requests").add({
    ...newRequest,
  });

  const requestId = docRef.id;
  const requestLink = `${BASE_URL}/request?id=${requestId}`;
  const recipients = requestDetails.recipients || [];

  const emailRecipients =
    recipients.length > 0
      ? recipients
      : requestDetails.email && requestDetails.recipientName
      ? [{ name: requestDetails.recipientName, email: requestDetails.email }]
      : [];

  const emailPromises = emailRecipients.map((recipient) =>
    sendRequestLinkEmail({
      recipientName: recipient.name,
      recipientEmail: recipient.email,
      requestTitle: requestDetails.title,
      requestLink: requestLink,
      purpose: requestDetails.purpose,
      expires: requestDetails.expires,
    }).catch((error) => {
      console.error(`Failed to send email to ${recipient.email}:`, error);
      return { success: false, email: recipient.email, error: String(error) };
    })
  );

  const emailResults = await Promise.allSettled(emailPromises);

  const successfulEmails = emailResults.filter(
    (result) => result.status === "fulfilled" && result.value?.success
  ).length;

  return {
    requestId: requestId,
    requestLink: requestLink,
    emailsSent: successfulEmails,
    totalRecipients: emailRecipients.length,
    emailResults: emailResults.map((result, index) => ({
      recipient: emailRecipients[index].email,
      success: result.status === "fulfilled" && result.value?.success,
      error: result.status === "rejected" ? String(result.reason) : undefined,
    })),
  };
}
