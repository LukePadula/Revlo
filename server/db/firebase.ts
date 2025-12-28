import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

/**
 * FIXED FOR VERCEL:
 * Reusing the same environment variable we set up for the other components.
 */
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const STORAGE_BUCKET = "revlo-82d11.appspot.com";

if (!admin.apps.length) {
  if (!serviceAccountKey) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is missing from environment variables."
    );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: STORAGE_BUCKET,
    });

    console.log("✅ Firebase Admin (Secondary) Initialized.");
  } catch (error) {
    console.error("❌ Firebase Admin Initialization Error:", error);
  }
}

export const db = getFirestore();
export const bucket = getStorage().bucket(STORAGE_BUCKET);
