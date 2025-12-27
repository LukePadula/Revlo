import crypto from "crypto";
import { OtpRepository } from "../repositories/OtpRepository";
import { OtpRecord } from "../../types";
import { sendOtpEmail } from "../../email/send";
import { Timestamp } from "firebase-admin/firestore";
import { adminDB } from "@/app/lib/firebase/admin";
import { DocumentRequest } from "@/types";

export async function generateOtp(id: string) {
  if (!id) {
    throw new Error("Request ID is required");
  }

  const repo = new OtpRepository();

  const existingOtps = await repo.getOtps(id);

  if (existingOtps.length) {
    existingOtps.forEach((o) => {
      o.status = "Inactive";
      repo.saveOtp(o);
    });
  }

  const otpCode = crypto.randomInt(100000, 999999).toString();
  const hashedOtpCode = crypto
    .createHash("sha256")
    .update(otpCode)
    .digest("hex");

  const optRec: OtpRecord = {
    documentRequestId: id,
    hashedOtp: hashedOtpCode,
    status: "Active",
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000)),
    createdAt: Timestamp.fromDate(new Date()),
    attempts: 0,
  };

  await repo.saveOtp(optRec);

  try {
    const docRef = adminDB.collection("requests").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new Error("Document request not found");
    }

    const requestData = docSnap.data() as DocumentRequest;
    const requestDetails = requestData.requestDetails;

    let recipientEmail: string | undefined;
    let recipientName: string | undefined;

    if (requestDetails.recipients && requestDetails.recipients.length > 0) {
      recipientEmail = requestDetails.recipients[0].email;
      recipientName = requestDetails.recipients[0].name;
    } else if (requestDetails.email) {
      recipientEmail = requestDetails.email;
      recipientName = requestDetails.recipientName || "Recipient";
    }

    if (!recipientEmail) {
      throw new Error("Recipient email not found in request");
    }

    await sendOtpEmail(otpCode, recipientEmail, recipientName || "Recipient");
  } catch (error) {
    console.error("Error fetching request or sending OTP email:", error);
    throw error;
  }
}

export async function verifyOtp(requestId: string, otpCode: string) {
  if (!requestId || !otpCode) {
    const error: any = new Error("Request ID and OTP code are required");
    error.status = 400;
    throw error;
  }

  const repo = new OtpRepository();
  const existingOtps = await repo.getOtps(requestId);

  if (!existingOtps.length) {
    const error: any = new Error("No active OTP found for this request");
    error.status = 404;
    throw error;
  }

  const activeOtp = existingOtps[0];

  const expiresAt = activeOtp.expiresAt.toDate();
  if (expiresAt < new Date()) {
    activeOtp.status = "Inactive";
    await repo.saveOtp(activeOtp);

    const error: any = new Error(
      "OTP code has expired. Please request a new code."
    );
    error.status = 401;
    throw error;
  }

  if (activeOtp.attempts >= 5) {
    activeOtp.status = "Inactive";
    await repo.saveOtp(activeOtp);

    const error: any = new Error(
      "Too many failed attempts. Please request a new code."
    );
    error.status = 401;
    throw error;
  }

  const hashedOtpCode = crypto
    .createHash("sha256")
    .update(otpCode)
    .digest("hex");

  if (hashedOtpCode !== activeOtp.hashedOtp) {
    activeOtp.attempts += 1;
    await repo.saveOtp(activeOtp);

    const error: any = new Error(
      activeOtp.attempts >= 5
        ? "Too many failed attempts. Please request a new code."
        : "Invalid OTP code. Please try again."
    );
    error.status = 401;
    throw error;
  }

  activeOtp.status = "Inactive";
  await repo.saveOtp(activeOtp);
}
