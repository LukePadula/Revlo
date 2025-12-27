"use server";

import { headers, cookies } from "next/headers";

export async function signIn(email: string, password: string) {
  try {
    const headerList = await headers();
    const cookieStore = await cookies();

    // Get the base URL for the API route
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = headerList.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;
    const origin = headerList.get("origin") || baseUrl;

    // Use better-auth's API route which handles session creation and cookie setting automatically
    // This is the proper way - the API route uses the adapter correctly
    const response = await fetch(`${baseUrl}/api/auth/sign-in/email`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: origin,
        referer: baseUrl,
        cookie: headerList.get("cookie") || "",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // Read the response body
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.message ||
          responseData.error?.message ||
          "Invalid email or password"
      );
    }

    // The API route sets cookies via Set-Cookie headers
    // Extract and set them in the server action response
    const setCookieHeaders = response.headers.getSetCookie();
    console.log("Set-Cookie headers from API:", setCookieHeaders);

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Parse and set each cookie
      for (const cookieHeader of setCookieHeaders) {
        const [cookiePart] = cookieHeader.split(";");
        const [name, value] = cookiePart.split("=");
        if (name && value) {
          // Extract cookie options from the header
          const options: any = {
            httpOnly: cookieHeader.includes("HttpOnly"),
            secure: cookieHeader.includes("Secure"),
            sameSite: cookieHeader.includes("SameSite=None")
              ? "none"
              : cookieHeader.includes("SameSite=Strict")
              ? "strict"
              : "lax",
            path: "/",
          };

          // Extract maxAge if present
          const maxAgeMatch = cookieHeader.match(/Max-Age=(\d+)/);
          if (maxAgeMatch) {
            options.maxAge = parseInt(maxAgeMatch[1]);
          }

          // For localhost, ensure secure is false
          if (host.includes("localhost") || host.includes("127.0.0.1")) {
            options.secure = false;
          }

          // The value from Set-Cookie header is already URL-encoded in the header string
          // But when we split by "=", we get the raw value which may need decoding
          // Next.js cookies() API will handle encoding automatically, so we should decode first
          let cookieValue = value.trim();

          // Try to decode the value (it might be double-encoded)
          try {
            cookieValue = decodeURIComponent(cookieValue);
          } catch (e) {
            // If decoding fails, use as-is
            console.warn("Could not decode cookie value, using as-is");
          }

          cookieStore.set(name.trim(), cookieValue, options);
          console.log(
            `✅ Cookie set: ${name.trim()} = ${cookieValue.substring(0, 30)}...`
          );
          console.log(`   Cookie options:`, {
            httpOnly: options.httpOnly,
            secure: options.secure,
            sameSite: options.sameSite,
            path: options.path,
          });
        }
      }
      console.log("✅ Session cookies set from API route");
    }

    if (!responseData.user) {
      throw new Error("Invalid email or password");
    }

    console.log("✅ Sign-in successful:", {
      userId: responseData.user.id,
      email: responseData.user.email,
    });
    console.log("📋 Set-Cookie headers count:", setCookieHeaders?.length || 0);

    // The API route should create the session, but let's verify it exists
    // If not, we'll need to create it manually
    try {
      console.log("🔍 Starting session verification/creation...");
      const { adminDB } = await import("@/app/lib/firebase/admin");
      const admin = await import("firebase-admin");

      // Extract the session token from the Set-Cookie headers
      let sessionToken: string | null = null;
      console.log("Checking Set-Cookie headers for session token...");
      console.log(
        "Number of Set-Cookie headers:",
        setCookieHeaders?.length || 0
      );

      if (setCookieHeaders && setCookieHeaders.length > 0) {
        for (const cookieHeader of setCookieHeaders) {
          console.log(
            "Checking cookie header:",
            cookieHeader.substring(0, 100) + "..."
          );
          if (
            cookieHeader.includes("better-auth.session_token") ||
            cookieHeader.includes("session_token")
          ) {
            const [cookiePart] = cookieHeader.split(";");
            const [name, value] = cookiePart.split("=");
            console.log("Found session cookie:", {
              name,
              value: value?.substring(0, 30) + "...",
            });
            if (
              name &&
              (name.includes("session_token") ||
                name.includes("better-auth.session_token"))
            ) {
              sessionToken = decodeURIComponent(value.trim());
              console.log(
                "Extracted session token:",
                sessionToken.substring(0, 50) + "..."
              );
              break;
            }
          }
        }
      } else {
        console.warn("⚠️ No Set-Cookie headers found");
      }

      if (sessionToken) {
        console.log("✅ Session token found, checking Firestore...");
        console.log(
          "Token (first 50 chars):",
          sessionToken.substring(0, 50) + "..."
        );

        // Better-auth firestore adapter uses the FIRST PART (before dot) as document ID
        const sessionId = sessionToken.includes(".")
          ? sessionToken.split(".")[0]
          : sessionToken;

        console.log("Using session ID (first part):", sessionId);

        // Check if session exists using the first part as document ID
        const sessionDoc = await adminDB
          .collection("sessions")
          .doc(sessionId)
          .get();

        let sessionExists = sessionDoc.exists;
        let actualSessionId = sessionId;

        console.log("Session exists?", sessionExists);

        if (!sessionExists) {
          console.warn(
            "⚠️ Session not found in Firestore after API call, creating manually..."
          );
          console.log("Full token:", sessionToken);
          console.log("Token has dot:", sessionToken.includes("."));

          // Create the session manually
          const now = new Date();
          const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

          // Use the first part of the token as document ID (before the dot)
          const sessionId = sessionToken.includes(".")
            ? sessionToken.split(".")[0]
            : sessionToken;

          console.log("Creating session with ID:", sessionId);
          console.log("User ID:", responseData.user.id);

          const sessionData = {
            id: sessionId,
            userId: responseData.user.id,
            token: sessionToken,
            expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
            ipAddress:
              headerList.get("x-forwarded-for") ||
              headerList.get("x-real-ip") ||
              null,
            userAgent: headerList.get("user-agent") || null,
            createdAt: admin.firestore.Timestamp.fromDate(now),
            updatedAt: admin.firestore.Timestamp.fromDate(now),
          };

          console.log("Session data to save:", {
            id: sessionData.id,
            userId: sessionData.userId,
            token: sessionData.token.substring(0, 50) + "...",
            expiresAt: sessionData.expiresAt.toDate().toISOString(),
          });

          await adminDB.collection("sessions").doc(sessionId).set(sessionData);

          console.log(
            "✅ Session created manually in Firestore with ID:",
            sessionId
          );
        } else {
          console.log(
            "✅ Session already exists in Firestore with ID:",
            actualSessionId
          );
        }
      } else {
        console.warn("⚠️ No session token found in Set-Cookie headers");
      }
    } catch (sessionError) {
      console.error("Error checking/creating session:", sessionError);
      console.error("Error stack:", (sessionError as Error).stack);
      // Continue anyway - the cookie is set
    }

    return { success: true, user: responseData.user };
  } catch (error: any) {
    console.error("Sign in error:", {
      message: error?.message,
      error: error?.error,
    });

    // Extract error message
    let errorMessage = "Invalid email or password";
    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    throw new Error(errorMessage);
  }
}
