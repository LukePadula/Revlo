"use server";

import { generateOtp as generateOtpService } from "@/server/db/otp/otpService";

export async function generateOtp(requestId: string) {
  try {
    if (!requestId) {
      return {
        success: false,
        error: "Request ID is required",
      };
    }

    await generateOtpService(requestId);

    return {
      success: true,
      requestId,
    };
  } catch (error: any) {
    console.error("Error generating OTP:", error);
    return {
      success: false,
      error: error.message || "Failed to generate OTP",
    };
  }
}

