import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { DocumentRequestRecord } from "@/server/types";

export const otpConverter = {
  toFirestore(docReq: DocumentRequestRecord) {
    return docReq;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): DocumentRequestRecord {
    return snapshot.data() as DocumentRequestRecord;
  },
};
