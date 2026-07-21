import "server-only";

import Stripe from "stripe";
import type { PlanTier } from "@prisma/client";

// A non-empty placeholder keeps construction (and `next build`) working before
// keys are set; real API calls fail gracefully behind `isStripeConfigured`.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  { typescript: true },
);

export const isStripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS: Record<"PRO" | "BUSINESS", string | undefined> = {
  PRO: process.env.STRIPE_PRICE_PRO,
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS,
};

export function priceIdForPlan(plan: "PRO" | "BUSINESS"): string | undefined {
  return PRICE_IDS[plan];
}

/** Map a Stripe price back to a plan tier (source of truth for the webhook). */
export function planFromPriceId(priceId: string | null | undefined): PlanTier {
  if (priceId && priceId === PRICE_IDS.BUSINESS) return "BUSINESS";
  if (priceId && priceId === PRICE_IDS.PRO) return "PRO";
  return "FREE";
}
