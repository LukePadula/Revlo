"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";

export async function signOut() {
  try {
    const cookieStore = await cookies();
    const headerList = await headers();
    
    // Get the session token before deleting cookies
    const cookieHeader = headerList.get("cookie") || "";
    let sessionToken: string | null = null;
    
    const sessionTokenMatch = cookieHeader.match(
      /(?:^|;\s*)better-auth\.session_token=([^;]+)/i
    );
    if (sessionTokenMatch) {
      sessionToken = decodeURIComponent(sessionTokenMatch[1]);
    }
    
    // Delete the session from Firestore if we have the token
    if (sessionToken) {
      try {
        const { adminDB } = await import("@/app/lib/firebase/admin");
        // Use the first part of the token as document ID (what the adapter uses)
        const sessionId = sessionToken.includes(".") 
          ? sessionToken.split(".")[0] 
          : sessionToken;
        
        await adminDB.collection("sessions").doc(sessionId).delete();
      } catch (error) {
        // Log but don't fail if session deletion fails
        console.error("Error deleting session from Firestore:", error);
      }
    }
    
    // Delete the session cookies
    cookieStore.delete("better-auth.session_token");
    cookieStore.delete("session_token");
  } catch (error) {
    console.error("Error signing out:", error);
  } finally {
    // Always redirect to login
    redirect("/login");
  }
}

