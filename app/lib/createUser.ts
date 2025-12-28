"use server";

import { auth } from "@/app/lib/auth";

export default async function createUser(
  name: string,
  email: string,
  password: string,
  orgId: string
) {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        organizationId: orgId,
      },
    });

    if (!response || !response.user) {
      throw new Error("User creation failed");
    }

    return { user: response.user };
  } catch (error: any) {
    console.error("Signup Library Error:", error);
    throw new Error(error.message || "Failed to create account");
  }
}
