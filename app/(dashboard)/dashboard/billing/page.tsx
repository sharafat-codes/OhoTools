import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { syncStripeForCustomer } from "@/lib/stripe-sync";
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

  // Reconcile straight from Stripe on return from checkout, so the plan is
  // correct even if the webhook was missed (common in local dev).
  if (checkout === "success" && dbUser?.stripeCustomerId) {
    await syncStripeForCustomer(dbUser.stripeCustomerId);
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
      />
    </div>
  );
}
