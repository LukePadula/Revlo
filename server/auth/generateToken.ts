import jwt from "jsonwebtoken";
import crypto from "crypto";

const secret = process.env.JWT_SECRET!;

export function generateTokens(documentRequestId: string) {
  const jti = crypto.randomUUID();

  const accessToken = jwt.sign(
    {
      sub: documentRequestId,
      role: "guest",
      type: "access",
    },
    secret,
    { expiresIn: "20m" }
  );

  const refreshToken = jwt.sign(
    {
      sub: documentRequestId,
      role: "guest",
      type: "refresh",
      jti,
    },
    secret,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken, jti };
}
