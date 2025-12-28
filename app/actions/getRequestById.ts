// app/actions/getRequest.ts
"use server";

import { log } from "node:console";
import { adminDB } from "../lib/firebase/admin";
import { DocumentRequest } from "@/types";
import { Timestamp } from "firebase-admin/firestore";

// Helper function to serialize Firestore Timestamps to ISO strings
function serializeTimestamp(timestamp: any): string | null {
  if (!timestamp) return null;

  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }

  // Handle Firestore Timestamp format from client SDK
  if (timestamp._seconds) {
    const timestampInMs =
      timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000;
    return new Date(timestampInMs).toISOString();
  }

  // If it's already a Date or ISO string, convert to ISO string
  if (timestamp instanceof Date) {
    return timestamp.toISOString();
  }

  if (typeof timestamp === "string") {
    return timestamp;
  }

  return null;
}

// Helper function to serialize the entire request record
function serializeRequestRecord(record: any): DocumentRequest {
  if (!record) return record;

  const serialized = JSON.parse(JSON.stringify(record));

  // Serialize audit timestamps
  if (serialized.audit) {
    if (serialized.audit.created) {
      serialized.audit.created = serializeTimestamp(serialized.audit.created);
    }
    if (serialized.audit.viewed) {
      serialized.audit.viewed = serializeTimestamp(serialized.audit.viewed);
    }
    if (serialized.audit.submitted) {
      serialized.audit.submitted = serializeTimestamp(
        serialized.audit.submitted
      );
    }
  }

  // Serialize requestDetails createdAt if it exists
  if (serialized.requestDetails?.createdAt) {
    serialized.requestDetails.createdAt = serializeTimestamp(
      serialized.requestDetails.createdAt
    );
  }

  return serialized as DocumentRequest;
}

export async function getRequestById(
  requestId: string
): Promise<DocumentRequest | null> {
  try {
    console.log(requestId, "ID!");
    const docRef = adminDB.collection("requests").doc(requestId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(`Request with ID ${requestId} not found.`);
      return null;
    }

    const data = docSnap.data();
    const record = {
      ...data,
      id: docSnap.id,
    };

    // Serialize Timestamps before returning
    return serializeRequestRecord(record);
  } catch (error) {
    console.error("Error fetching request:", error);
    return null;
  }
}
