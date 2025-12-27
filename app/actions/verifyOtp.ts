"use server";

import { verifyOtp as verifyOtpService } from "@/server/db/otp/otpService";

export async function verifyOtp(requestId: string, otpCode: string) {
  try {
    if (!requestId || !otpCode) {
      return {
        success: false,
        error: "Request ID and OTP code are required",
      };
    }

    await verifyOtpService(requestId, otpCode);

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);

    const errorMessage = error.message || "Failed to verify OTP";
    const status = error.status || 401;

    return {
      success: false,
      error: errorMessage,
      status,
    };
  }
}
