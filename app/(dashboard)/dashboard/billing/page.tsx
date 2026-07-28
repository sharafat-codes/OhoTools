import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { syncStripeForCustomer } from "@/lib/stripe-sync";
import { isPaddleConfigured } from "@/lib/paddle";
import { syncPaddleForUser } from "@/lib/paddle-sync";
import { isLemonConfigured } from "@/lib/lemonsqueezy";
import { syncLemonForUser } from "@/lib/lemon-sync";
import { BillingView } from "@/modules/billing/components/billing-view";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const user = await requireUser();
  const { checkout } = await searchParams;

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { subscription: true },
  });

  // Reconcile straight from the payment provider on return from checkout, so
  // the plan is correct even if the webhook was slow or missed. Stripe keys off
  // the stored customer id; Paddle looks the customer up by email.
  if (checkout === "success") {
    // Reconcile from whichever provider(s) are configured. Each is upgrade-only
    // (sets PRO if an active subscription is found), so running them is safe.
    if (dbUser?.stripeCustomerId) await syncStripeForCustomer(dbUser.stripeCustomerId);
    if (isLemonConfigured) await syncLemonForUser({ userId: user.id, email: user.email });
    if (isPaddleConfigured) await syncPaddleForUser({ userId: user.id, email: user.email });
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscription: true },
    });
  }

  const sub = dbUser?.subscription;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Billing & plans
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your subscription and unlock more of OhoTool.
        </p>
      </div>

      <BillingView
        currentPlan={dbUser?.plan ?? "FREE"}
        subscription={
          sub
            ? {
                status: sub.status,
                plan: sub.plan,
                currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
                cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
              }
            : null
        }
        checkoutStatus={checkout ?? null}
        provider={isLemonConfigured ? "lemonsqueezy" : isPaddleConfigured ? "paddle" : "stripe"}
        userId={user.id}
        email={user.email}
      />
    </div>
  );
}
