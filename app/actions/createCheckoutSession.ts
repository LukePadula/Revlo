"use server";

import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function createCheckoutSession(
  priceId: string,
  quantity: number = 1,
  customerId: string | undefined
) {
  try {
    const headerList = await headers();

    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session) {
      throw new Error("You must be logged in to complete payment");
    }

    if (!quantity || quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = headerList.get("host") || "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId || undefined,
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: quantity,
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
          orgId: session.user.organisationId,
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
    throw new Error(error.message || "Failed to create checkout session");
  }
}
