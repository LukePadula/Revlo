import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDB } from "@/app/lib/firebase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(event, "EVENT");

  // Handle ONLY the completion of a checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // We only care about subscription-based checkouts
    if (session.mode === "subscription") {
      await handleNewSubscription(session);
    }
  }

  return NextResponse.json({ received: true });
}

async function handleNewSubscription(session: Stripe.Checkout.Session) {
  const subscriptionId = session.subscription as string;
  const userId = session.metadata?.userId; // Passed during session creation
  const customerId = session.customer as string;

  // Retrieve minimal extra info if needed
  const subscription = (await stripe.subscriptions.retrieve(
    subscriptionId
  )) as any;

  const subscriptionData = {
    subscriptionId,
    userId,
    customerId,
    customerEmail: session.customer_details?.email,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    createdAt: new Date(),
  };

  await adminDB
    .collection("subscriptions")
    .doc(subscriptionId)
    .set(subscriptionData, { merge: true });

  if (userId && customerId) {
    try {
      await adminDB
        .collection("user")
        .doc(userId)
        .set({ stripeCustomerId: customerId }, { merge: true });
      console.log(`✅ Stored Stripe customer ID for user: ${userId}`);
    } catch (error) {
      console.error(`Error storing customer ID for user ${userId}:`, error);
    }
  }

  const purchaseData = {
    userId,
    customerId,
    subscriptionId,
    checkoutSessionId: session.id,
    amount: subscription.items.data[0].price.unit_amount
      ? subscription.items.data[0].price.unit_amount / 100
      : 0,
    currency: subscription.items.data[0].price.currency || "usd",
    quantity: subscription.items.data[0].quantity || 1,
    status: subscription.status,
    createdAt: new Date(),
  };

  await adminDB
    .collection("purchases")
    .doc(session.id)
    .set(purchaseData, { merge: true });

  console.log(`✅ Subscription started for User: ${userId}`);
}
