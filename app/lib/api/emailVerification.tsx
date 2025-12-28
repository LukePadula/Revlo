import { generateOtp } from "@/app/actions/generateOtp";
import { verifyOtp as verifyOtpAction } from "@/app/actions/verifyOtp";

export async function sendEmailVerification(id: string) {
  const result = await generateOtp(id);

  if (!result.success) {
    throw new Error(result.error || "Failed to send verification code");
  }

  return result;
}

export async function verifyOtp(id: string, otpCode: string) {
  const result = await verifyOtpAction(id, otpCode);

  if (!result.success) {
    const error: any = new Error(result.error || "Failed to verify OTP code");
    error.status = result.status || 401;
    throw error;
  }

  return result;
}
