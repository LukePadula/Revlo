"use server";

import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { adminDB } from "@/app/lib/firebase/admin";
import Stripe from "stripe";
import { log } from "console";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function createCheckoutSession(
  priceId: string,
  quantity: number = 1
) {
  try {
    const headerList = await headers();

    // Get the current session
    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session) {
      throw new Error("You must be logged in to complete payment");
    }

    // Validate quantity
    if (!quantity || quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    console.log(session, "SESSION USE");

    // Get the base URL
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = headerList.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    // Try to get existing customer ID from our database
    let customerId: string | undefined;
    try {
      const userDoc = await adminDB
        .collection("user")
        .doc(session.user.id)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        customerId = userData?.stripeCustomerId;
      }
    } catch (error) {
      console.warn("Error fetching customer ID from database:", error);
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId || undefined, // Stripe will create a customer if not provided
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: quantity, // Use the provided quantity (number of licenses)
        },
      ],
      subscription_data: {
        trial_period_days: 30,
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
        metadata: {
          userId: session.user.id,
          licenseCount: quantity.toString(),
        },
      },
      success_url:
        quantity > 1
          ? `${baseUrl}/portal/invite?licenses=${quantity}&session_id={CHECKOUT_SESSION_ID}`
          : `${baseUrl}/portal/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/register?canceled=true`,
      metadata: {
        userId: session.user.id,
        licenseCount: quantity.toString(),
      },
      payment_method_collection: "always",
    });

    return { url: checkoutSession.url, sessionId: checkoutSession.id };
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    throw new Error(error.message || "Failed to create checkout session");
  }
}
