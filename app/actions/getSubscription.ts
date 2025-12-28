"use server";

import { auth } from "@/app/lib/auth";
import { adminDB } from "@/app/lib/firebase/admin";
import { headers } from "next/headers";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export async function getSubscription(checkoutSessionId?: string) {
  try {
    const headerList = await headers();

    const session = await auth.api.getSession({
      headers: headerList,
    });

    if (!session) {
      throw new Error("Not authenticated");
    }

    // If checkout session ID is provided, get subscription from that first
    if (checkoutSessionId) {
      try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(
          checkoutSessionId
        );

        if (checkoutSession.subscription) {
          const subscriptionId =
            typeof checkoutSession.subscription === "string"
              ? checkoutSession.subscription
              : checkoutSession.subscription.id;

          const subscription = (await stripe.subscriptions.retrieve(
            subscriptionId
          )) as any;

          const priceId = subscription.items.data[0]?.price.id;
          const quantity = subscription.items.data[0]?.quantity || 1;

          let price = null;
          if (priceId) {
            price = await stripe.prices.retrieve(priceId);
          }

          return {
            id: subscription.id,
            status: subscription.status,
            currentPeriodStart: new Date(
              subscription.current_period_start * 1000
            ),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            trialEnd: subscription.trial_end
              ? new Date(subscription.trial_end * 1000)
              : null,
            quantity,
            price: price
              ? {
                  amount: price.unit_amount ? price.unit_amount / 100 : 0,
                  currency: price.currency,
                  interval: price.recurring?.interval || "month",
                }
              : null,
          };
        }
      } catch (checkoutError: any) {
        console.warn(
          "Error retrieving subscription from checkout session:",
          checkoutError.message
        );
        // Continue to try other methods
      }
    }

    // Get user's Stripe customer ID from our database
    let stripeCustomerId: string | null = null;

    try {
      const userDoc = await adminDB
        .collection("user")
        .doc(session.user.id)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        stripeCustomerId = userData?.stripeCustomerId || null;
      }
    } catch (dbError: any) {
      console.warn(
        "Error fetching customer ID from database:",
        dbError.message
      );
    }

    // If no customer ID in database, try to find it by email from Stripe
    if (!stripeCustomerId) {
      try {
        const customers = await stripe.customers.list({
          email: session.user.email,
          limit: 1,
        });

        if (customers.data.length > 0) {
          stripeCustomerId = customers.data[0].id;
          // Store it in our database for future use
          try {
            await adminDB
              .collection("user")
              .doc(session.user.id)
              .set({ stripeCustomerId }, { merge: true });
          } catch (saveError) {
            console.warn("Error saving customer ID to database:", saveError);
          }
        }
      } catch (customerError: any) {
        console.warn("Error finding customer by email:", customerError.message);
      }
    }

    if (!stripeCustomerId) {
      return null;
    }

    // Get all subscriptions for the customer (including trialing, active, past_due, etc.)
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "all", // Get all statuses
      limit: 10, // Get more subscriptions to find the active one
    });

    // Find the most recent active/trialing subscription
    const activeSubscription =
      subscriptions.data.find(
        (sub) => sub.status === "active" || sub.status === "trialing"
      ) ||
      subscriptions.data.find(
        (sub) => sub.status === "past_due" || sub.status === "unpaid"
      ) ||
      subscriptions.data[0]; // Fallback to most recent

    if (!activeSubscription) {
      return null;
    }

    // Get subscription details
    const sub = activeSubscription as any;
    const priceId = sub.items.data[0]?.price.id;
    const quantity = sub.items.data[0]?.quantity || 1;

    // Get price details
    let price = null;
    if (priceId) {
      price = await stripe.prices.retrieve(priceId);
    }

    return {
      id: sub.id,
      status: sub.status,
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end,
      trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
      quantity,
      price: price
        ? {
            amount: price.unit_amount ? price.unit_amount / 100 : 0,
            currency: price.currency,
            interval: price.recurring?.interval || "month",
          }
        : null,
    };
  } catch (error: any) {
    console.error("Error fetching subscription:", error);
    throw new Error(error.message || "Failed to fetch subscription");
  }
}
