"use client";

import * as React from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PASS_DAYS, isPaddlePassOffered } from "@/lib/pro-pass";

export { PASS_DAYS, isPaddlePassOffered };

const TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
const PRICE_MONTHLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO;
const PRICE_ANNUAL = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL;
// One-time Pro pass. Absent means the pass simply isn't offered.
const PRICE_PASS = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_PASS;
const ENV = process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";

/** The one-time pass price id, for callers that open checkout themselves. */
export const PADDLE_PRICE_PASS = PRICE_PASS;

export function isPaddleClientConfigured() {
  return Boolean(TOKEN && PRICE_MONTHLY);
}

type OpenArgs = {
  priceId?: string;
  userId: string;
  email?: string;
  /** Where Paddle sends the browser after payment. Omit to stay on the page. */
  successUrl?: string;
};

/**
 * Opens Paddle's overlay checkout, loading Paddle.js on first use.
 *
 * Split out of PaddleUpgradeButton so a page that is not a billing page can
 * take payment without navigating away — the card editor holds an unsaved card
 * in component state, and sending someone to /pricing to upgrade would throw
 * away the thing they were about to pay for.
 *
 * Loading is deferred until the first click on purpose. Most visitors to a tool
 * page never open checkout, and they should not pay for a third-party script
 * (or its cookies) to find that out.
 */
export function usePaddleCheckout(onCompleted?: () => void) {
  const [opening, setOpening] = React.useState(false);
  const paddle = React.useRef<Paddle | null>(null);
  const loading = React.useRef<Promise<Paddle | null> | null>(null);

  const completed = React.useRef<(() => void) | undefined>(undefined);
  React.useEffect(() => {
    completed.current = onCompleted;
  }, [onCompleted]);

  const load = React.useCallback(() => {
    if (paddle.current) return Promise.resolve(paddle.current);
    if (loading.current) return loading.current;
    if (!TOKEN) return Promise.resolve(null);
    loading.current = initializePaddle({
      environment: ENV,
      token: TOKEN,
      eventCallback: (e) => {
        if (e.name === "checkout.closed") setOpening(false);
        if (e.name === "checkout.completed") completed.current?.();
      },
    })
      .then((p) => {
        paddle.current = p ?? null;
        return paddle.current;
      })
      .catch(() => null);
    return loading.current;
  }, []);

  /**
   * Returns false when checkout is not on offer at all (no token, price or
   * user), so the caller can fall back to another route. A true return means
   * the overlay is on its way; a failure to load after that is reported here.
   */
  const open = React.useCallback(
    ({ priceId, userId, email, successUrl }: OpenArgs) => {
      if (!TOKEN || !priceId || !userId) return false;
      setOpening(true);
      void load().then((p) => {
        if (!p) {
          setOpening(false);
          toast.error("Checkout isn’t available right now. Please try again shortly.");
          return;
        }
        p.Checkout.open({
          items: [{ priceId, quantity: 1 }],
          customData: { userId },
          customer: email ? { email } : undefined,
          settings: {
            displayMode: "overlay",
            ...(successUrl ? { successUrl } : {}),
          },
        });
      });
      return true;
    },
    [load],
  );

  return { opening, open };
}

export function PaddleUpgradeButton({
  userId,
  email,
  annual = false,
  pass = false,
  children,
  className,
  variant = "default",
}: {
  userId: string;
  email?: string;
  annual?: boolean;
  pass?: boolean;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  const { opening, open } = usePaddleCheckout();

  function start() {
    // Never silently fall back from annual to monthly. The visitor chose the
    // annual plan and saw its price; charging them the monthly one instead is
    // a different product than the one they agreed to.
    const priceId = pass ? PRICE_PASS : annual ? PRICE_ANNUAL : PRICE_MONTHLY;
    if (!priceId) {
      toast.error(
        annual
          ? "Annual billing isn’t available right now. Please choose monthly."
          : "Checkout isn’t available right now. Please try again shortly.",
      );
      return;
    }
    open({
      priceId,
      userId,
      email,
      successUrl: `${window.location.origin}/dashboard/billing?checkout=success`,
    });
  }

  if (!isPaddleClientConfigured()) return null;

  return (
    <Button onClick={start} disabled={opening} variant={variant} className={className}>
      {opening && <LoaderCircleIcon className="animate-spin" />}
      {children ?? "Upgrade to Pro"}
    </Button>
  );
}
