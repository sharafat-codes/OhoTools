"use client";

import * as React from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
const PRICE_MONTHLY = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO;
const PRICE_ANNUAL = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL;
const ENV = process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";

export function isPaddleClientConfigured() {
  return Boolean(TOKEN && PRICE_MONTHLY);
}

export function PaddleUpgradeButton({
  userId,
  email,
  annual = false,
  children,
  className,
  variant = "default",
}: {
  userId: string;
  email?: string;
  annual?: boolean;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}) {
  const [paddle, setPaddle] = React.useState<Paddle | null>(null);
  const [opening, setOpening] = React.useState(false);

  React.useEffect(() => {
    if (!TOKEN) return;
    let ok = true;
    initializePaddle({
      environment: ENV,
      token: TOKEN,
      eventCallback: (e) => {
        if (e.name === "checkout.closed") setOpening(false);
      },
    }).then((p) => {
      if (ok && p) setPaddle(p);
    });
    return () => {
      ok = false;
    };
  }, []);

  function open() {
    // Never silently fall back from annual to monthly. The visitor chose the
    // annual plan and saw its price; charging them the monthly one instead is
    // a different product than the one they agreed to.
    const priceId = annual ? PRICE_ANNUAL : PRICE_MONTHLY;
    if (!paddle) return;
    if (!priceId) {
      toast.error(
        annual
          ? "Annual billing isn’t available right now. Please choose monthly."
          : "Checkout isn’t available right now. Please try again shortly.",
      );
      return;
    }
    setOpening(true);
    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customData: { userId },
      customer: email ? { email } : undefined,
      settings: {
        displayMode: "overlay",
        successUrl: `${window.location.origin}/dashboard/billing?checkout=success`,
      },
    });
  }

  if (!isPaddleClientConfigured()) return null;

  return (
    <Button onClick={open} disabled={!paddle || opening} variant={variant} className={className}>
      {opening && <LoaderCircleIcon className="animate-spin" />}
      {children ?? "Upgrade to Pro"}
    </Button>
  );
}
