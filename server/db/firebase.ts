import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import path from "path";

// Load service account key
const serviceAccount = require(path.resolve("./firebaseServiceKey.json"));

const STORAGE_BUCKET = "revlo-82d11.appspot.com";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: STORAGE_BUCKET,
  });
}

export const db = getFirestore();
export const bucket = getStorage().bucket(STORAGE_BUCKET);
