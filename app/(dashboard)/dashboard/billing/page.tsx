import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { syncStripeForCustomer } from "@/lib/stripe-sync";
import { isPaddleConfigured } from "@/lib/paddle";
import { syncPaddleForUser } from "@/lib/paddle-sync";
import { isSafepayConfigured, safepayIsSandbox } from "@/lib/safepay";
import { getProPrice, getRequestCountry } from "@/lib/region";
import { PLAN_BY_ID } from "@/lib/plans";
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
    if (isPaddleConfigured) await syncPaddleForUser({ userId: user.id, email: user.email });
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscription: true },
    });
  }

  const sub = dbUser?.subscription;
  const proPrice = await getProPrice(PLAN_BY_ID.PRO.price);

  // Provider routing. Paddle (Merchant of Record) is the default for everyone.
  // Pakistani visitors get Safepay (local PKR) ONLY once Safepay is live in
  // production — while it's in sandbox/pending approval, they use Paddle too.
  // Safepay is the last-resort fallback if Paddle isn't configured yet.
  // Re-enable PK→Safepay later with just SAFEPAY_ENVIRONMENT=production.
  const country = await getRequestCountry();
  const safepayLive = isSafepayConfigured() && !safepayIsSandbox();
  const provider: "safepay" | "paddle" | "stripe" =
    country === "PK" && safepayLive
      ? "safepay"
      : isPaddleConfigured
        ? "paddle"
        : isSafepayConfigured()
          ? "safepay"
          : "stripe";

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
        provider={provider}
        proPrice={proPrice}
        userId={user.id}
        email={user.email}
      />
    </div>
  );
}
