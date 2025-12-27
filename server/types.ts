// server/db/types.ts
import { Timestamp } from "firebase-admin/firestore";

export interface DocumentRequestRecord {
  id: string;
  title: string;
  email: string;
  createdAt: Date;
  createdBy: string;
}

export interface OtpRecord {
  documentRequestId: string;
  hashedOtp: string;
  status: "Active" | "Inactive";
  attempts: number;
  expiresAt: Timestamp;
  createdAt: Timestamp;
}

export interface DbClient {
  saveOtp(otp: OtpRecord): Promise<void>;
  deleteOtpForDocument(documentId: string): Promise<void>;
}
