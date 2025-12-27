import * as admin from "firebase-admin";
import "server-only";
import * as fs from "fs";
import * as path from "path";

const SERVICE_ACCOUNT_KEY_PATH = path.resolve("./revlo.json");

const BUCKET_NAME = "revlo-3bfd5.firebasestorage.app";

if (!admin.apps.length) {
  try {
    const serviceAccountJson = JSON.parse(
      fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountJson),
      databaseURL: `https://${serviceAccountJson.project_id}.firebaseio.com`,
      storageBucket: BUCKET_NAME,
    });

    console.log("✅ Admin SDK Initialized.");
    console.log("Project ID:", serviceAccountJson.project_id);
    console.log("Storage Bucket:", BUCKET_NAME);

    // Set Firestore settings IMMEDIATELY after app initialization
    // This must happen before any other code accesses Firestore
    const firestore = admin.firestore();
    try {
      firestore.settings({
        ignoreUndefinedProperties: true,
      });
      console.log(
        "✅ Firestore settings configured: ignoreUndefinedProperties = true"
      );
    } catch (settingsError: any) {
      console.error(
        "❌ Failed to set Firestore settings:",
        settingsError.message
      );
      // Continue anyway - this shouldn't happen
    }
  } catch (e) {
    throw new Error(
      `Admin SDK Init Failed: ${
        e instanceof Error ? e.message : "Unknown Error"
      }`
    );
  }
}

// Get the base Firestore instance
const baseFirestore = admin.firestore();

// Helper function to remove undefined values from objects
function removeUndefinedValues(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedValues);
  }

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

// Create a wrapper around Firestore that filters undefined values
// This ensures the adapter can save documents without undefined values
// We need to preserve all Firestore methods while wrapping document operations
const firestoreWrapper = new Proxy(baseFirestore, {
  get(target, prop) {
    const value = (target as any)[prop];

    // If it's the collection method, wrap it to filter undefined values
    if (prop === "collection" && typeof value === "function") {
      return (collectionPath: string) => {
        const collection = value.call(target, collectionPath);

        // Wrap the collection methods to filter undefined values
        return new Proxy(collection, {
          get(collectionTarget, collectionProp) {
            const collectionValue = (collectionTarget as any)[collectionProp];

            // Wrap doc() method
            if (
              collectionProp === "doc" &&
              typeof collectionValue === "function"
            ) {
              return (documentPath?: string) => {
                const docRef = documentPath
                  ? collectionValue.call(collectionTarget, documentPath)
                  : collectionValue.call(collectionTarget);

                // Create a proxy for the document reference to intercept set/update
                return new Proxy(docRef, {
                  get(docTarget, docProp) {
                    const docValue = (docTarget as any)[docProp];

                    // Override set() to filter undefined values
                    if (docProp === "set" && typeof docValue === "function") {
                      return (data: any, options?: any) => {
                        const cleanedData = removeUndefinedValues(data);
                        return docValue.call(docTarget, cleanedData, options);
                      };
                    }

                    // Override update() to filter undefined values
                    if (
                      docProp === "update" &&
                      typeof docValue === "function"
                    ) {
                      return function (
                        dataOrField: any,
                        value?: any,
                        ...moreFieldsAndValues: any[]
                      ) {
                        if (
                          typeof dataOrField === "object" &&
                          dataOrField !== null
                        ) {
                          const cleanedData =
                            removeUndefinedValues(dataOrField);
                          return docValue.call(docTarget, cleanedData);
                        } else {
                          // Field-value pairs - filter out undefined values
                          const args: any[] = [];
                          if (dataOrField !== undefined) {
                            args.push(dataOrField);
                            if (value !== undefined) {
                              args.push(value);
                            }
                          }
                          args.push(
                            ...moreFieldsAndValues.filter(
                              (v) => v !== undefined
                            )
                          );
                          if (args.length === 0) {
                            throw new Error(
                              "At least one field must be provided to update()"
                            );
                          }
                          return docValue.call(
                            docTarget,
                            ...(args as [any, ...any[]])
                          );
                        }
                      };
                    }

                    // Return other properties/methods as-is
                    return docValue;
                  },
                });
              };
            }

            // Wrap add() method
            if (
              collectionProp === "add" &&
              typeof collectionValue === "function"
            ) {
              return (data: any) => {
                const cleanedData = removeUndefinedValues(data);
                return collectionValue.call(collectionTarget, cleanedData);
              };
            }

            // Return other properties/methods as-is
            return collectionValue;
          },
        });
      };
    }

    // Wrap runTransaction to filter undefined values in transaction callbacks
    if (prop === "runTransaction" && typeof value === "function") {
      return (updateFunction: any) => {
        const wrappedUpdateFunction = (transaction: any) => {
          // Wrap the transaction's set/update methods
          const wrappedTransaction = new Proxy(transaction, {
            get(transTarget, transProp) {
              const transValue = (transTarget as any)[transProp];

              // Wrap transaction.set()
              if (transProp === "set" && typeof transValue === "function") {
                return (docRef: any, data: any, options?: any) => {
                  const cleanedData = removeUndefinedValues(data);
                  return transValue.call(
                    transTarget,
                    docRef,
                    cleanedData,
                    options
                  );
                };
              }

              // Wrap transaction.update()
              if (transProp === "update" && typeof transValue === "function") {
                return (
                  docRef: any,
                  dataOrField: any,
                  value?: any,
                  ...more: any[]
                ) => {
                  if (typeof dataOrField === "object" && dataOrField !== null) {
                    const cleanedData = removeUndefinedValues(dataOrField);
                    return transValue.call(transTarget, docRef, cleanedData);
                  } else {
                    const args = [docRef, dataOrField, value, ...more].filter(
                      (v, i) => i === 0 || v !== undefined
                    );
                    return transValue.call(transTarget, ...args);
                  }
                };
              }

              return transValue;
            },
          });
          return updateFunction(wrappedTransaction);
        };
        return value.call(target, wrappedUpdateFunction);
      };
    }

    // Return all other properties/methods as-is (including batch, etc.)
    return value;
  },
}) as admin.firestore.Firestore;

// Try to set settings on the base instance (may fail if already initialized)
try {
  baseFirestore.settings({
    ignoreUndefinedProperties: true,
  });
  console.log(
    "✅ Firestore settings configured: ignoreUndefinedProperties = true"
  );
} catch (error: any) {
  console.warn(
    "⚠️ Could not set Firestore settings (may already be initialized)"
  );
  console.log("✅ Using Firestore wrapper to filter undefined values instead");
}

export const adminDB = firestoreWrapper;

export const adminStorage = admin.storage();
export const adminBucket = adminStorage.bucket(); // uses default bucket from initializeApp

// Verify bucket exists (async check) - only in development
if (process.env.NODE_ENV !== "production") {
  (async () => {
    try {
      const [exists] = await adminBucket.exists();
      if (!exists) {
        console.error(
          `❌ ERROR: Storage bucket "${BUCKET_NAME}" does not exist! ` +
            `Please create it in Firebase Console: ` +
            `https://console.firebase.google.com/project/${
              BUCKET_NAME.split(".")[0]
            }/storage`
        );
      } else {
        console.log(`✓ Storage bucket "${BUCKET_NAME}" verified`);
      }
    } catch (error) {
      console.error("Error checking bucket existence:", error);
    }
  })();
}
