"use server";

import { adminDB } from "../lib/firebase/admin";
import { DocumentRequest } from "@/types";
import { Timestamp } from "firebase-admin/firestore";

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

  if (serialized.requestDetails?.createdAt) {
    serialized.requestDetails.createdAt = serializeTimestamp(
      serialized.requestDetails.createdAt
    );
  }

  return serialized as DocumentRequest;
}

export async function getRequests(userId: string): Promise<DocumentRequest[]> {
  try {
    const snapshot = await adminDB
      .collection("requests")
      .where("requestDetails.createdBy", "==", userId)
      .get();

    console.log("Snapshot", snapshot);
    if (snapshot.docs.length === 0) {
      return [];
    }

    const requests: DocumentRequest[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const record = {
        ...data,
        id: doc.id,
      };

      return serializeRequestRecord(record);
    });

    return requests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw new Error("Failed to fetch requests");
  }
}
