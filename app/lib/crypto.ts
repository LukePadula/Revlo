import crypto from "crypto";
import { KeyManagementServiceClient } from "@google-cloud/kms";

/**
 * FIXED FOR VERCEL:
 * We no longer use fs.readFileSync or path.resolve on a JSON file.
 * We use the Environment Variable you already set up.
 */
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

let kms: KeyManagementServiceClient;

if (!serviceAccountKey) {
  // If the env var is missing, we initialize without config and hope
  // Google Application Default Credentials (ADC) are present.
  console.warn(
    "FIREBASE_SERVICE_ACCOUNT_KEY missing, using default credentials."
  );
  kms = new KeyManagementServiceClient();
} else {
  try {
    const credentials = JSON.parse(serviceAccountKey);
    kms = new KeyManagementServiceClient({
      credentials,
      projectId: credentials.project_id,
    });
  } catch (error) {
    console.error("Failed to parse KMS credentials:", error);
    kms = new KeyManagementServiceClient();
  }
}

const KMS_KEY_NAME = process.env.KMS_KEY_NAME;

if (!KMS_KEY_NAME) {
  throw new Error("KMS_KEY_NAME environment variable is required");
}

/**
 * Encrypts a buffer using Envelope Encryption:
 * 1. Generates a local AES-256 key.
 * 2. Encrypts data with the local key.
 * 3. Encrypts the local key with Google KMS.
 */
export async function encryptBuffer(buffer: Buffer) {
  const dataKey = crypto.randomBytes(32); // AES-256
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", dataKey, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Encrypt the local Data Key using Google KMS
  const [kmsResp] = await kms.encrypt({
    name: KMS_KEY_NAME!,
    plaintext: dataKey,
  });

  // Security: Clear the sensitive local key from memory
  dataKey.fill(0);

  return {
    encrypted,
    encryptedDataKey: kmsResp.ciphertext as Buffer,
    iv,
    authTag,
    kmsKeyVersion: kmsResp.name!,
  };
}

/**
 * Decrypts a buffer using the KMS-encrypted data key.
 */
export async function decryptBuffer(params: {
  encrypted: Buffer;
  encryptedDataKey: Uint8Array; // KMS returns Uint8Array/Buffer
  iv: Buffer;
  authTag: Buffer;
  kmsKeyVersion: string;
}) {
  // Decrypt the Data Key back to plaintext using Google KMS
  const [kmsResp] = await kms.decrypt({
    name: params.kmsKeyVersion,
    ciphertext: params.encryptedDataKey,
  });

  if (!kmsResp.plaintext) {
    throw new Error("KMS decryption failed: no plaintext returned");
  }

  const dataKey = Buffer.from(kmsResp.plaintext as Uint8Array);

  const decipher = crypto.createDecipheriv("aes-256-gcm", dataKey, params.iv);
  decipher.setAuthTag(params.authTag);

  const decrypted = Buffer.concat([
    decipher.update(params.encrypted),
    decipher.final(),
  ]);

  // Security: Clear the sensitive local key from memory
  dataKey.fill(0);

  return decrypted;
}
