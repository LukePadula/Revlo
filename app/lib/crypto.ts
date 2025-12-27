import crypto from "crypto";
import { KeyManagementServiceClient } from "@google-cloud/kms";
import * as fs from "fs";
import * as path from "path";

// Use the same service account credentials as Firebase Admin
const SERVICE_ACCOUNT_KEY_PATH = path.resolve("./revlo.json");

let kms: KeyManagementServiceClient;

// Initialize KMS client with service account credentials
try {
  const serviceAccountJson = JSON.parse(
    fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, "utf8")
  );

  kms = new KeyManagementServiceClient({
    keyFilename: SERVICE_ACCOUNT_KEY_PATH,
    projectId: serviceAccountJson.project_id,
  });
} catch (error) {
  // Fallback: try to use default credentials (for production environments like GCP)
  console.warn(
    "Could not load service account file, attempting to use default credentials:",
    error instanceof Error ? error.message : String(error)
  );
  kms = new KeyManagementServiceClient();
}

const KMS_KEY_NAME = process.env.KMS_KEY_NAME;

if (!KMS_KEY_NAME) {
  throw new Error("KMS_KEY_NAME environment variable is required");
}

export async function encryptBuffer(buffer: Buffer) {
  const dataKey = crypto.randomBytes(32); // AES-256
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", dataKey, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const [kmsResp] = await kms.encrypt({
    name: KMS_KEY_NAME,
    plaintext: dataKey,
  });

  dataKey.fill(0);

  return {
    encrypted,
    encryptedDataKey: kmsResp.ciphertext,
    iv,
    authTag,
    kmsKeyVersion: kmsResp.name!,
  };
}

export async function decryptBuffer(params: {
  encrypted: Buffer;
  encryptedDataKey: Buffer;
  iv: Buffer;
  authTag: Buffer;
  kmsKeyVersion: string;
}) {
  const [kmsResp] = await kms.decrypt({
    name: params.kmsKeyVersion,
    ciphertext: params.encryptedDataKey,
  });

  if (!kmsResp.plaintext) {
    throw new Error("KMS decryption failed: no plaintext returned");
  }

  const dataKey = Buffer.isBuffer(kmsResp.plaintext)
    ? kmsResp.plaintext
    : Buffer.from(kmsResp.plaintext);

  const decipher = crypto.createDecipheriv("aes-256-gcm", dataKey, params.iv);
  decipher.setAuthTag(params.authTag);

  const decrypted = Buffer.concat([
    decipher.update(params.encrypted),
    decipher.final(),
  ]);

  dataKey.fill(0);

  return decrypted;
}
