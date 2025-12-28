"use server";

import { auth } from "@/app/lib/auth";
import { adminDB } from "@/app/lib/firebase/admin";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function cancelSubscription(subscriptionId: string) {
  try {
    const headerList = await headers();

    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session) {
      throw new Error("Not authenticated");
    }

    // Get user's Stripe customer ID from database
    let stripeCustomerId: string | null = null;
    try {
      const userDoc = await adminDB.collection("user").doc(session.user.id).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        stripeCustomerId = userData?.stripeCustomerId || null;
      }
    } catch (dbError: any) {
      console.warn("Error fetching customer ID from database:", dbError.message);
    }

    // Retrieve the subscription to verify it belongs to the user
    const subscription = (await stripe.subscriptions.retrieve(
      subscriptionId
    )) as any;

    // Verify the subscription belongs to the user
    if (stripeCustomerId && subscription.customer !== stripeCustomerId) {
      throw new Error("Subscription does not belong to this user");
    }

    // Cancel the subscription at period end (soft cancel)
    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    return {
      success: true,
      message: "Subscription will be canceled at the end of the billing period",
      subscription: canceledSubscription,
    };
  } catch (error: any) {
    console.error("Error canceling subscription:", error);
    throw new Error(error.message || "Failed to cancel subscription");
  }
}

