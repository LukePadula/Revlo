import * as admin from "firebase-admin";
import "server-only";

/**
 * FIXED FOR VERCEL:
 * Use the environment variable instead of a local .json file.
 */
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
const BUCKET_NAME = "revlo-3bfd5.firebasestorage.app";

if (!admin.apps.length) {
  try {
    if (!serviceAccountKey) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is missing."
      );
    }

    const serviceAccountJson = JSON.parse(serviceAccountKey);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
      databaseURL: `https://${serviceAccountJson.project_id}.firebaseio.com`,
      storageBucket: BUCKET_NAME,
    });

    console.log("✅ Admin SDK Initialized via Env Var.");

    // Configure Firestore settings
    const firestore = admin.firestore();
    try {
      firestore.settings({
        ignoreUndefinedProperties: true,
      });
      console.log("✅ Firestore settings: ignoreUndefinedProperties = true");
    } catch (settingsError: any) {
      // settings() can only be called once; this catch prevents crashes on hot-reloads
      console.warn("⚠️ Firestore settings already configured.");
    }
  } catch (e) {
    console.error("❌ Admin SDK Init Failed:", e);
    // In production, you might want to handle this gracefully or let the build fail
  }
}

// Get the base instances
const baseFirestore = admin.firestore();
const baseStorage = admin.storage();

// --- HELPER: Recursive Undefined Filter ---
function removeUndefinedValues(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(removeUndefinedValues);
  if (typeof obj === "object" && obj.constructor === Object) {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = removeUndefinedValues(value);
      }
    }
    return cleaned;
  }
  return obj;
}

// --- PROXY WRAPPER ---
// This ensures that even if ignoreUndefinedProperties fails,
// our code manually strips them before sending to Firebase.
const firestoreWrapper = new Proxy(baseFirestore, {
  get(target, prop) {
    const value = (target as any)[prop];

    if (prop === "collection" && typeof value === "function") {
      return (collectionPath: string) => {
        const collection = value.call(target, collectionPath);
        return new Proxy(collection, {
          get(collectionTarget, collectionProp) {
            const collectionValue = (collectionTarget as any)[collectionProp];

            if (
              collectionProp === "doc" &&
              typeof collectionValue === "function"
            ) {
              return (documentPath?: string) => {
                const docRef = documentPath
                  ? collectionValue.call(collectionTarget, documentPath)
                  : collectionValue.call(collectionTarget);

                return new Proxy(docRef, {
                  get(docTarget, docProp) {
                    const docValue = (docTarget as any)[docProp];
                    if (docProp === "set" && typeof docValue === "function") {
                      return (data: any, options?: any) =>
                        docValue.call(
                          docTarget,
                          removeUndefinedValues(data),
                          options
                        );
                    }
                    if (
                      docProp === "update" &&
                      typeof docValue === "function"
                    ) {
                      return (data: any) =>
                        docValue.call(docTarget, removeUndefinedValues(data));
                    }
                    return docValue;
                  },
                });
              };
            }
            if (
              collectionProp === "add" &&
              typeof collectionValue === "function"
            ) {
              return (data: any) =>
                collectionValue.call(
                  collectionTarget,
                  removeUndefinedValues(data)
                );
            }
            return collectionValue;
          },
        });
      };
    }
    return value;
  },
}) as admin.firestore.Firestore;

// Exporting wrapped and standard instances
export const adminDB = firestoreWrapper;
export const adminStorage = baseStorage;
export const adminBucket = baseStorage.bucket();

// Development-only bucket verification
if (process.env.NODE_ENV !== "production") {
  adminBucket
    .exists()
    .then(([exists]) => {
      if (!exists)
        console.error(`❌ Storage bucket "${BUCKET_NAME}" not found.`);
      else console.log(`✓ Storage bucket "${BUCKET_NAME}" verified.`);
    })
    .catch((err) => console.error("Bucket verification error:", err));
}
