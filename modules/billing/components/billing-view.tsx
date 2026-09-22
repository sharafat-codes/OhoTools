"use client";

import * as React from "react";
import { format } from "date-fns";
import { CheckIcon, LoaderCircleIcon, ZapIcon } from "lucide-react";
import { toast } from "sonner";

import {
  createCheckoutSession,
  createPortalSession,
} from "@/modules/billing/actions";
import { createPaddlePortalSession } from "@/modules/billing/paddle-actions";
import { createLemonCheckout, createLemonPortalSession } from "@/modules/billing/lemon-actions";
import { PLANS, PLAN_BY_ID, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { PaddleUpgradeButton } from "@/components/paddle-upgrade-button";
import { PASS_DAYS, isPaddlePassOffered } from "@/lib/pro-pass";
import { SafepayButton } from "@/components/safepay-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SubscriptionInfo = {
  status: string;
  plan: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
} | null;

/** Mirrors lib/region.ProPrice — duplicated here to avoid importing server-only. */
type ProPrice = {
  isPk: boolean;
  currency: "USD" | "PKR";
  display: string;
  period: string;
};

export function BillingView({
  currentPlan,
  subscription,
  checkoutStatus,
  provider = "stripe",
  proPrice,
  userId,
  email,
  defaultAnnual = false,
}: {
  currentPlan: string;
  subscription: SubscriptionInfo;
  checkoutStatus: string | null;
  provider?: "stripe" | "paddle" | "lemonsqueezy" | "safepay";
  proPrice?: ProPrice;
  userId: string;
  email?: string;
  defaultAnnual?: boolean;
}) {
  const [isPending, startTransition] = React.useTransition();
  const [action, setAction] = React.useState<string | null>(null);
  const [annual, setAnnual] = React.useState(defaultAnnual);

  React.useEffect(() => {
    if (checkoutStatus === "success") {
      toast.success("You're subscribed! Your plan will update momentarily.");
    } else if (checkoutStatus === "cancelled") {
      toast.info("Checkout cancelled — no charge was made.");
    }
  }, [checkoutStatus]);

  function upgrade(plan: PlanId) {
    if (plan === "FREE") return;
    const billingPlan = plan === "PRO" && annual ? "PRO_ANNUAL" : plan;
    setAction(plan);
    startTransition(async () => {
      const res = await createCheckoutSession(billingPlan as "PRO" | "PRO_ANNUAL" | "BUSINESS");
      if ("error" in res) {
        toast.error(res.error);
        setAction(null);
        return;
      }
      window.location.href = res.url;
    });
  }

  function manage() {
    setAction("manage");
    startTransition(async () => {
      const res = await createPortalSession();
      if ("error" in res) {
        toast.error(res.error);
        setAction(null);
        return;
      }
      window.location.href = res.url;
    });
  }

  function managePaddle() {
    setAction("manage");
    startTransition(async () => {
      const res = await createPaddlePortalSession();
      if ("error" in res) {
        toast.error(res.error);
        setAction(null);
        return;
      }
      window.location.href = res.url;
    });
  }

  function upgradeLemon(plan: PlanId) {
    if (plan === "FREE") return;
    setAction(plan);
    startTransition(async () => {
      const res = await createLemonCheckout(plan);
      if ("error" in res) {
        toast.error(res.error);
        setAction(null);
        return;
      }
      window.location.href = res.url;
    });
  }

  function manageLemon() {
    setAction("manage");
    startTransition(async () => {
      const res = await createLemonPortalSession();
      if ("error" in res) {
        toast.error(res.error);
        setAction(null);
        return;
      }
      window.location.href = res.url;
    });
  }

  const current = PLAN_BY_ID[currentPlan as PlanId] ?? PLAN_BY_ID.FREE;
  // A Stripe subscription row means Stripe manages it; otherwise a Pro user on
  // a Merchant-of-Record provider is managed through that provider's portal.
  const paddleManaged = !subscription && provider === "paddle" && current.id !== "FREE";
  const lemonManaged = !subscription && provider === "lemonsqueezy" && current.id !== "FREE";
  const hostedManaged = paddleManaged || lemonManaged;
  const manageHosted = lemonManaged ? manageLemon : managePaddle;

  return (
    <div className="flex flex-col gap-6">
      {/* Current plan summary */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current plan</p>
            <p className="font-heading text-lg font-semibold">{current.name}</p>
            {subscription && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {subscription.cancelAtPeriodEnd
                  ? `Cancels on ${format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}`
                  : `Renews on ${format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}`}
                {subscription.status !== "active" && ` · ${subscription.status}`}
              </p>
            )}
          </div>
          {(subscription || hostedManaged) && (
            <Button
              variant="outline"
              onClick={subscription ? manage : manageHosted}
              disabled={isPending}
            >
              {isPending && action === "manage" && (
                <LoaderCircleIcon className="animate-spin" />
              )}
              Manage subscription
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="mx-auto max-w-2xl">
        {/* Annual toggle */}
        <div className="mb-5 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 rounded-full border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={cn(
                "rounded-full px-5 py-1.5 text-sm font-medium transition-colors",
                !annual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-5 py-1.5 text-sm font-medium transition-colors",
                annual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Annual
              <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Save 37%
              </span>
            </button>
          </div>
          {annual && (
            <p className="text-xs text-muted-foreground">
              Billed as <strong className="text-foreground">$90 / year</strong> — 3 months free
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === current.id;
          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col",
                plan.popular && "ring-2 ring-primary",
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-4">Most popular</Badge>
              )}
              <CardHeader>
                <CardTitle className="flex items-baseline gap-1">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline gap-1">
                <span className="font-heading text-3xl font-semibold">
                  {plan.id === "PRO" && proPrice
                    ? annual
                      ? proPrice.isPk ? proPrice.display : `$${plan.annualMonthly ?? plan.price}`
                      : proPrice.display
                    : `$${plan.price}`}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{plan.id === "PRO" && proPrice
                    ? annual && !proPrice.isPk
                      ? "mo · billed annually"
                      : proPrice.period
                    : "month"}
                </span>
              </div>
              {/* Strikethrough + promo badge */}
              {plan.id === "PRO" && !annual && plan.originalPrice && (
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground line-through">
                    ${plan.originalPrice}/mo
                  </span>
                  {plan.promoLabel && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      <ZapIcon className="size-2.5" />
                      {plan.promoLabel}
                    </span>
                  )}
                </div>
              )}
                <CardDescription>{plan.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <ul className="flex flex-1 flex-col gap-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <Button variant="outline" disabled>
                    Current plan
                  </Button>
                ) : plan.id === "FREE" ? (
                  subscription ? (
                    <Button variant="outline" onClick={manage} disabled={isPending}>
                      Downgrade
                    </Button>
                  ) : hostedManaged ? (
                    <Button variant="outline" onClick={manageHosted} disabled={isPending}>
                      Cancel subscription
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Downgrade
                    </Button>
                  )
                ) : provider === "lemonsqueezy" ? (
                  <Button
                    onClick={() => upgradeLemon(plan.id)}
                    disabled={isPending}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isPending && action === plan.id && (
                      <LoaderCircleIcon className="animate-spin" />
                    )}
                    Upgrade to {plan.name}
                  </Button>
                ) : provider === "safepay" ? (
                  <SafepayButton />
                ) : provider === "paddle" ? (
                  <PaddleUpgradeButton
                    userId={userId}
                    email={email}
                    annual={annual}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Upgrade to {plan.name}
                  </PaddleUpgradeButton>
                ) : (
                  <Button
                    onClick={() => upgrade(plan.id)}
                    disabled={isPending}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {isPending && action === plan.id && (
                      <LoaderCircleIcon className="animate-spin" />
                    )}
                    Upgrade to {plan.name}
                  </Button>
                )}

                {/* One-time pass. Most of what people come here for is a single
                    job — one invitation, one batch of conversions — and a monthly
                    subscription is the wrong ask for that. Hidden unless a
                    one-time price is configured in Paddle. */}
                {plan.id === "PRO" && !isCurrent && provider === "paddle" && isPaddlePassOffered && (
                  <div className="flex flex-col gap-1.5">
                    <PaddleUpgradeButton userId={userId} email={email} pass variant="outline">
                      Or buy a {PASS_DAYS}-day pass
                    </PaddleUpgradeButton>
                    <p className="text-center text-xs text-muted-foreground">
                      One payment, no subscription. Nothing renews.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Payments are securely handled by {provider === "safepay" ? "Safepay" : provider === "lemonsqueezy" ? "Lemon Squeezy" : provider === "paddle" ? "Paddle" : "Stripe"}.
      </p>
    </div>
  );
}
