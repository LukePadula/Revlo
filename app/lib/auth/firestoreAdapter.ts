import { adminDB } from "@/app/lib/firebase/admin";
import * as admin from "firebase-admin";

// Custom Firestore adapter for better-auth
export function firestoreAdapter() {
  try {
    console.log("🔧 Firestore adapter initialized");

    const adapter = {
      async getSession(sessionId: string) {
        try {
          const doc = await adminDB.collection("sessions").doc(sessionId).get();
          if (!doc.exists) return null;
          const data = doc.data();
          if (!data) return null;
          return {
            id: doc.id,
            userId: data.userId || "",
            expiresAt: data.expiresAt?.toDate() || new Date(),
            token: data.token || "",
            ipAddress: data.ipAddress || null,
            userAgent: data.userAgent || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("Error in getSession:", error);
          return null;
        }
      },

      async createSession(session: any) {
        try {
          const sessionId =
            session.id || adminDB.collection("sessions").doc().id;
          const docRef = adminDB.collection("sessions").doc(sessionId);
          const expiresAt = session.expiresAt
            ? session.expiresAt instanceof Date
              ? session.expiresAt
              : new Date(session.expiresAt)
            : new Date();

          await docRef.set({
            userId: session.userId || "",
            expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
            token: session.token || "",
            ipAddress: session.ipAddress || null,
            userAgent: session.userAgent || null,
            createdAt: admin.firestore.Timestamp.fromDate(new Date()),
            updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
          });
          return { ...session, id: sessionId };
        } catch (error) {
          console.error("Error in createSession:", error);
          throw error;
        }
      },

      async updateSession(sessionId: string, data: any) {
        try {
          const docRef = adminDB.collection("sessions").doc(sessionId);
          const updateData: any = { ...data };
          if (data.expiresAt) {
            updateData.expiresAt = admin.firestore.Timestamp.fromDate(
              data.expiresAt instanceof Date
                ? data.expiresAt
                : new Date(data.expiresAt)
            );
          }
          updateData.updatedAt = admin.firestore.Timestamp.fromDate(new Date());
          await docRef.update(updateData);
          const updated = await docRef.get();
          if (!updated.exists) return null;
          const updatedData = updated.data();
          if (!updatedData) return null;
          return {
            id: updated.id,
            userId: updatedData.userId || "",
            expiresAt: updatedData.expiresAt?.toDate() || new Date(),
            token: updatedData.token || "",
            ipAddress: updatedData.ipAddress || null,
            userAgent: updatedData.userAgent || null,
            createdAt: updatedData.createdAt?.toDate() || new Date(),
            updatedAt: updatedData.updatedAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("Error in updateSession:", error);
          throw error;
        }
      },

      async deleteSession(sessionId: string) {
        try {
          await adminDB.collection("sessions").doc(sessionId).delete();
        } catch (error) {
          console.error("Error in deleteSession:", error);
          throw error;
        }
      },

      async getUser(userId: string) {
        try {
          if (!userId) return null;
          const doc = await adminDB.collection("users").doc(userId).get();
          if (!doc.exists) return null;
          const data = doc.data();
          if (!data) return null;
          return {
            id: doc.id,
            email: data.email || "",
            emailVerified: data.emailVerified || false,
            name: data.name || null,
            image: data.image || null,
            password: data.password || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("Error in getUser:", error);
          return null;
        }
      },

      async getUserByEmail(email: string) {
        try {
          console.log("🔍 getUserByEmail called with email:", email);
          if (!email) return null;

          const snapshot = await adminDB
            .collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();

          console.log("🔍 getUserByEmail query result:", {
            empty: snapshot.empty,
            count: snapshot.docs.length,
          });

          if (snapshot.empty) {
            console.log("🔍 No user found with email:", email);
            return null;
          }

          const doc = snapshot.docs[0];
          const data = doc.data();
          if (!data) return null;

          console.log("🔍 User found:", doc.id);
          return {
            id: doc.id,
            email: data.email || "",
            emailVerified: data.emailVerified || false,
            name: data.name || null,
            image: data.image || null,
            password: data.password || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("Error in getUserByEmail:", error);
          return null;
        }
      },

      async createUser(user: any) {
        try {
          console.log("🔥 createUser adapter method called");
          console.log("User data received:", {
            email: user?.email,
            hasId: !!user?.id,
            hasPassword: !!user?.password,
            hasName: !!user?.name,
            fullUser: user,
          });

          if (!user || !user.email) {
            throw new Error("User email is required");
          }

          // Generate a new document ID if not provided
          const docRef = user.id
            ? adminDB.collection("users").doc(user.id)
            : adminDB.collection("users").doc();
          const userId = docRef.id;
          const now = admin.firestore.Timestamp.fromDate(new Date());

          const userData: any = {
            email: user.email,
            emailVerified: user.emailVerified || false,
            name: user.name || null,
            image: user.image || null,
            createdAt: now,
            updatedAt: now,
          };

          // Only include password if provided (better-auth handles hashing)
          if (user.password) {
            userData.password = user.password;
          }

          console.log("🔥 Writing to Firestore collection 'users':", {
            documentId: userId,
            email: userData.email,
          });

          await docRef.set(userData);

          console.log(
            "✅ User document created successfully in Firestore:",
            userId
          );

          // Verify it was created
          const verifyDoc = await docRef.get();
          console.log("✅ Verification - document exists:", verifyDoc.exists);

          return {
            id: userId,
            email: user.email,
            emailVerified: user.emailVerified || false,
            name: user.name || null,
            image: user.image || null,
            password: user.password || null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        } catch (error: any) {
          console.error("❌ Error in createUser:", error);
          console.error("Error stack:", error?.stack);
          console.error("User data:", {
            email: user?.email,
            hasPassword: !!user?.password,
          });
          // Re-throw with more context
          throw new Error(`Failed to create user: ${error.message || error}`);
        }
      },

      async updateUser(userId: string, data: any) {
        try {
          if (!userId) throw new Error("User ID is required");
          const docRef = adminDB.collection("users").doc(userId);
          const updateData: any = { ...data };
          // Handle date fields
          if (data.createdAt) {
            updateData.createdAt = admin.firestore.Timestamp.fromDate(
              data.createdAt instanceof Date
                ? data.createdAt
                : new Date(data.createdAt)
            );
          }
          updateData.updatedAt = admin.firestore.Timestamp.fromDate(new Date());
          await docRef.update(updateData);
          const updated = await docRef.get();
          if (!updated.exists) return null;
          const updatedData = updated.data();
          if (!updatedData) return null;
          return {
            id: updated.id,
            email: updatedData.email || "",
            emailVerified: updatedData.emailVerified || false,
            name: updatedData.name || null,
            image: updatedData.image || null,
            password: updatedData.password || null,
            createdAt: updatedData.createdAt?.toDate() || new Date(),
            updatedAt: updatedData.updatedAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("Error in updateUser:", error);
          throw error;
        }
      },

      async deleteUser(userId: string) {
        try {
          await adminDB.collection("users").doc(userId).delete();
        } catch (error) {
          console.error("Error in deleteUser:", error);
          throw error;
        }
      },

      async getAccount(accountId: string) {
        try {
          if (!accountId) return null;
          const doc = await adminDB.collection("accounts").doc(accountId).get();
          if (!doc.exists) return null;
          const data = doc.data();
          if (!data) return null;
          return {
            id: doc.id,
            userId: data.userId || "",
            accountId: data.accountId || "",
            providerId: data.providerId || "",
            accessToken: data.accessToken || null,
            refreshToken: data.refreshToken || null,
            expiresAt: data.expiresAt?.toDate() || null,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("Error in getAccount:", error);
          return null;
        }
      },

      async createAccount(account: any) {
        try {
          if (!account) {
            throw new Error("Account data is required");
          }
          const docRef = adminDB.collection("accounts").doc();
          const now = admin.firestore.Timestamp.fromDate(new Date());
          await docRef.set({
            userId: account.userId || "",
            accountId: account.accountId || "",
            providerId: account.providerId || "",
            accessToken: account.accessToken || null,
            refreshToken: account.refreshToken || null,
            expiresAt: account.expiresAt
              ? admin.firestore.Timestamp.fromDate(
                  account.expiresAt instanceof Date
                    ? account.expiresAt
                    : new Date(account.expiresAt)
                )
              : null,
            createdAt: now,
            updatedAt: now,
          });
          return { ...account, id: docRef.id };
        } catch (error) {
          console.error("Error in createAccount:", error);
          throw error;
        }
      },

      async updateAccount(accountId: string, data: any) {
        try {
          if (!accountId) throw new Error("Account ID is required");
          const docRef = adminDB.collection("accounts").doc(accountId);
          const updateData: any = { ...data };
          if (data.expiresAt) {
            updateData.expiresAt = admin.firestore.Timestamp.fromDate(
              data.expiresAt instanceof Date
                ? data.expiresAt
                : new Date(data.expiresAt)
            );
          }
          updateData.updatedAt = admin.firestore.Timestamp.fromDate(new Date());
          await docRef.update(updateData);
          const updated = await docRef.get();
          if (!updated.exists) return null;
          const updatedData = updated.data();
          if (!updatedData) return null;
          return {
            id: updated.id,
            userId: updatedData.userId || "",
            accountId: updatedData.accountId || "",
            providerId: updatedData.providerId || "",
            accessToken: updatedData.accessToken || null,
            refreshToken: updatedData.refreshToken || null,
            expiresAt: updatedData.expiresAt?.toDate() || null,
            createdAt: updatedData.createdAt?.toDate() || new Date(),
            updatedAt: updatedData.updatedAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("Error in updateAccount:", error);
          throw error;
        }
      },

      async deleteAccount(accountId: string) {
        try {
          await adminDB.collection("accounts").doc(accountId).delete();
        } catch (error) {
          console.error("Error in deleteAccount:", error);
          throw error;
        }
      },

      async getVerificationToken(token: string) {
        try {
          if (!token) return null;
          const snapshot = await adminDB
            .collection("verificationTokens")
            .where("token", "==", token)
            .limit(1)
            .get();
          if (snapshot.empty) return null;
          const doc = snapshot.docs[0];
          const data = doc.data();
          if (!data) return null;
          return {
            id: doc.id,
            identifier: data.identifier || "",
            token: data.token || "",
            expiresAt: data.expiresAt?.toDate() || new Date(),
          };
        } catch (error) {
          console.error("Error in getVerificationToken:", error);
          return null;
        }
      },

      async createVerificationToken(token: any) {
        try {
          if (!token || !token.token) {
            throw new Error("Token data is required");
          }
          const docRef = adminDB.collection("verificationTokens").doc();
          const expiresAt = token.expiresAt
            ? token.expiresAt instanceof Date
              ? token.expiresAt
              : new Date(token.expiresAt)
            : new Date();
          await docRef.set({
            identifier: token.identifier || "",
            token: token.token,
            expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
          });
          return { ...token, id: docRef.id };
        } catch (error) {
          console.error("Error in createVerificationToken:", error);
          throw error;
        }
      },

      async deleteVerificationToken(token: string) {
        try {
          if (!token) return;
          const snapshot = await adminDB
            .collection("verificationTokens")
            .where("token", "==", token)
            .get();
          if (snapshot.empty) return;
          const batch = adminDB.batch();
          snapshot.docs.forEach((doc) => batch.delete(doc.ref));
          await batch.commit();
        } catch (error) {
          console.error("Error in deleteVerificationToken:", error);
          throw error;
        }
      },
    };

    // Log all method names to verify structure
    console.log("🔧 Adapter methods:", Object.keys(adapter));

    return adapter;
  } catch (error) {
    console.error("❌ Error creating Firestore adapter:", error);
    throw error;
  }
}
