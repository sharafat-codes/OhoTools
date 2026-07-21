"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import {
  stripe,
  isStripeConfigured,
  priceIdForPlan,
} from "@/lib/stripe";

const APP_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

type ActionResult = { url: string } | { error: string };

/** Ensure the user has a Stripe customer, creating one on first use. */
async function ensureCustomerId(userId: string, email: string, name: string) {
  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  if (dbUser?.stripeCustomerId) return dbUser.stripeCustomerId;

  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { userId },
  });
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });
  return customer.id;
}

export async function createCheckoutSession(
  plan: "PRO" | "BUSINESS",
): Promise<ActionResult> {
  const user = await requireUser();
  if (!isStripeConfigured) return { error: "Billing isn't configured yet." };

  const priceId = priceIdForPlan(plan);
  if (!priceId) return { error: "That plan isn't available yet." };

  try {
    const customerId = await ensureCustomerId(user.id, user.email, user.name);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${APP_URL}/dashboard/billing?checkout=success`,
      cancel_url: `${APP_URL}/dashboard/billing?checkout=cancelled`,
      subscription_data: { metadata: { userId: user.id } },
    });
    if (!session.url) return { error: "Could not start checkout." };
    return { url: session.url };
  } catch {
    return { error: "Something went wrong starting checkout." };
  }
}

export async function createPortalSession(): Promise<ActionResult> {
  const user = await requireUser();
  if (!isStripeConfigured) return { error: "Billing isn't configured yet." };

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser?.stripeCustomerId) {
    return { error: "No billing account found yet." };
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${APP_URL}/dashboard/billing`,
    });
    return { url: session.url };
  } catch {
    return { error: "Could not open the billing portal." };
  }
}
