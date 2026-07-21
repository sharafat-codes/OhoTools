import "server-only";

import { stripe, planFromPriceId } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

/**
 * Reconcile a customer's subscription state from Stripe (the source of truth)
 * into our DB. Used by both the webhook and the post-checkout return, so the app
 * stays correct even if a webhook is missed.
 */
export async function syncStripeForCustomer(customerId: string) {
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId },
  });
  if (!user) return;

  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });

  // The one subscription that currently grants (or recently granted) access.
  const sub =
    subs.data.find((s) =>
      ["active", "trialing", "past_due"].includes(s.status),
    ) ?? null;

  if (!sub) {
    // No live subscription — drop to Free.
    await prisma.subscription.deleteMany({ where: { userId: user.id } });
    if (user.plan !== "FREE") {
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: "FREE" },
      });
    }
    return;
  }

  const item = sub.items.data[0];
  const priceId = item?.price.id ?? "";
  const tier = planFromPriceId(priceId);

  // `current_period_end` moved to the subscription item in recent API versions.
  const periodEndUnix =
    (item as { current_period_end?: number } | undefined)?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end;
  const currentPeriodEnd = periodEndUnix
    ? new Date(periodEndUnix * 1000)
    : new Date();

  const grantsAccess = sub.status === "active" || sub.status === "trialing";

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      status: sub.status,
      plan: tier,
      currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      status: sub.status,
      plan: tier,
      currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { plan: grantsAccess ? tier : "FREE" },
  });
}
