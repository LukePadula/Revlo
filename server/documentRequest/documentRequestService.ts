import crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";

export async function generateOtp(id: string) {
  const repo = new DocumentRequestRepository();
  const existingOtps = await repo.getDocumentRequest(id);
}
