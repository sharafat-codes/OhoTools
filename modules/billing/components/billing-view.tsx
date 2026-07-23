"use client";

import * as React from "react";
import { format } from "date-fns";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import {
  createCheckoutSession,
  createPortalSession,
} from "@/modules/billing/actions";
import { createPaddlePortalSession } from "@/modules/billing/paddle-actions";
import { PLANS, PLAN_BY_ID, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { PaddleUpgradeButton } from "@/components/paddle-upgrade-button";
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

export function BillingView({
  currentPlan,
  subscription,
  checkoutStatus,
  provider = "stripe",
  userId,
  email,
}: {
  currentPlan: string;
  subscription: SubscriptionInfo;
  checkoutStatus: string | null;
  provider?: "stripe" | "paddle";
  userId: string;
  email?: string;
}) {
  const [isPending, startTransition] = React.useTransition();
  const [action, setAction] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (checkoutStatus === "success") {
      toast.success("You're subscribed! Your plan will update momentarily.");
    } else if (checkoutStatus === "cancelled") {
      toast.info("Checkout cancelled — no charge was made.");
    }
  }, [checkoutStatus]);

  function upgrade(plan: PlanId) {
    if (plan === "FREE") return;
    setAction(plan);
    startTransition(async () => {
      const res = await createCheckoutSession(plan);
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

  const current = PLAN_BY_ID[currentPlan as PlanId] ?? PLAN_BY_ID.FREE;
  // A Stripe subscription row means Stripe manages it; otherwise a Pro user on
  // the Paddle provider is managed through Paddle's customer portal.
  const paddleManaged = !subscription && provider === "paddle" && current.id !== "FREE";

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
          {(subscription || paddleManaged) && (
            <Button
              variant="outline"
              onClick={subscription ? manage : managePaddle}
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
      <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
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
                    ${plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
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
                  ) : paddleManaged ? (
                    <Button variant="outline" onClick={managePaddle} disabled={isPending}>
                      Cancel subscription
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Downgrade
                    </Button>
                  )
                ) : provider === "paddle" ? (
                  <PaddleUpgradeButton
                    userId={userId}
                    email={email}
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Payments are securely handled by {provider === "paddle" ? "Paddle" : "Stripe"}. Cancel anytime.
      </p>
    </div>
  );
}
