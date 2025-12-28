import type { NextRequest } from "next/server";
import { verifyOtp } from "@/server/db/otp/otpService";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const params = await context.params;
  const id = params.id;
  const { otpCode } = await request.json();

  await verifyOtp(id, otpCode);

  return Response.json({ success: true });
}
