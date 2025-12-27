"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function signUp(
  name: string,
  email: string,
  password: string,
  organizationName: string
) {
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const headerList = await headers();

    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: headerList,
    });

    if (!response) {
      throw new Error("No response from authentication server");
    }

    if (!response.user) {
      throw new Error("Failed to create account - user not created");
    }

    return { success: true, user: response.user };
  } catch (error: any) {
    console.error("Sign up error details:", {
      message: error?.message,
      error: error?.error,
      stack: error?.stack,
      name: error?.name,
    });

    // Extract error message from better-auth error
    let errorMessage = "Failed to create account";
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.error) {
      errorMessage = String(error.error);
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    throw new Error(errorMessage);
  }
}
