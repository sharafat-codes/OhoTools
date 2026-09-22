"use client";

import * as React from "react";
import Link from "next/link";
import { CheckIcon, ZapIcon } from "lucide-react";

import type { Plan } from "@/lib/plans";

/** Mirrors lib/region.ProPrice — duplicated here to avoid importing server-only. */
type ProPrice = {
  isPk: boolean;
  currency: "USD" | "PKR";
  display: string;
  period: string;
};
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PASS_DAYS, PASS_PRICE, isPaddlePassOffered } from "@/lib/pro-pass";

type Props = {
  plans: Plan[];
  proPrice: ProPrice;
  proHref: string;
  isLoggedIn: boolean;
};

export function PricingCards({ plans, proPrice, proHref }: Props) {
  const [annual, setAnnual] = React.useState(false);

  return (
    <div className="mx-auto mt-12 max-w-3xl">
      {/* Monthly / Annual toggle */}
      <div className="mb-8 flex flex-col items-center gap-3">
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
            Billed as <strong className="text-foreground">$90 / year</strong> — that&apos;s 3 months
            free vs the original $12/month price.
          </p>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {plans.map((plan) => {
          const isProPlan = plan.id === "PRO";
          const isPkr = proPrice.isPk;

          // Price display logic
          const monthlyDisplay = isProPlan && isPkr ? proPrice.display : `$${plan.price}`;
          const annualMonthlyDisplay = isProPlan
            ? isPkr
              ? proPrice.display // PKR doesn't have annual yet
              : `$${plan.annualMonthly ?? plan.price}`
            : `$${plan.price}`;

          const displayPrice = !isProPlan
            ? monthlyDisplay
            : annual
              ? annualMonthlyDisplay
              : monthlyDisplay;

          const periodLabel = !isProPlan
            ? "month"
            : annual && !isPkr
              ? "mo · billed annually"
              : proPrice.period;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border border-border bg-card p-6",
                plan.popular && "border-primary/40 ring-2 ring-primary/20",
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <Badge className="absolute -top-2.5 left-6">Most popular</Badge>
              )}

              <h2 className="font-heading text-lg font-semibold">{plan.name}</h2>

              {/* Price row */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-semibold">{displayPrice}</span>
                <span className="text-sm text-muted-foreground">/{periodLabel}</span>
              </div>

              {/* Strikethrough original price + promo label (Pro only, monthly view) */}
              {isProPlan && !annual && plan.originalPrice && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">
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

              {/* Annual savings callout */}
              {isProPlan && annual && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <ZapIcon className="size-2.5" />
                    Save $54 vs original price
                  </span>
                </div>
              )}

              <p className="mt-2 text-sm text-muted-foreground">{plan.tagline}</p>

              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <Button className="mt-6" variant="outline" render={<Link href="/tools" />}>
                  Use the free tools
                </Button>
              ) : (
                <Button
                  className="mt-6"
                  variant={plan.popular ? "default" : "outline"}
                  render={
                    <Link
                      href={`${proHref}${annual ? "?billing=annual" : ""}`}
                    />
                  }
                >
                  {annual ? "Get annual Pro" : "Upgrade to Pro"}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* One-time pass. Most people arrive for a single job — one invitation,
          one batch of conversions — and bounce at a monthly commitment. This is
          the alternative, so it has to be visible before they leave. Pakistani
          visitors are routed to Safepay, which has its own pass, so it is hidden
          for them. */}
      {isPaddlePassOffered && !proPrice.isPk && (
        <div className="mt-5 rounded-xl border border-primary/25 bg-primary/[0.04] p-5 text-center">
          <p className="font-heading text-base font-semibold">Only need it once?</p>
          <p className="mx-auto mt-1 max-w-md text-pretty text-sm text-muted-foreground">
            Get the full Pro toolkit for {PASS_DAYS} days{PASS_PRICE ? ` for ${PASS_PRICE}` : ""}. One payment,
            nothing renews, no subscription to cancel.
          </p>
          <Button className="mt-4" variant="outline" render={<Link href={`${proHref}?billing=pass`} />}>
            Get the {PASS_DAYS}-day pass
          </Button>
        </div>
      )}
    </div>
  );
}
