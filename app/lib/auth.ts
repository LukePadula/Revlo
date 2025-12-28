import { betterAuth } from "better-auth";
import { firestoreAdapter } from "@yultyyev/better-auth-firestore";
import { adminDB } from "./firebase/admin";
import { organization, twoFactor } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

// Initialize Stripe client
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

export const auth = betterAuth({
  database: firestoreAdapter({
    firestore: adminDB,
    namingStrategy: "default",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization(),
    twoFactor(),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
      createCustomerOnSignUp: true,
    }),
  ],
});
