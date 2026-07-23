"use client";

import * as React from "react";
import { initializePaddle, type Paddle } from "@paddle/paddle-js";
import { LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
const PRICE = process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO;
const ENV = process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";

export function isPaddleClientConfigured() {
  return Boolean(TOKEN && PRICE);
}

export function PaddleUpgradeButton({
  userId,
  email,
  children,
  className,
  variant = "default",
}: {
  userId: string;
  email?: string;
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
    if (!paddle || !PRICE) return;
    setOpening(true);
    paddle.Checkout.open({
      items: [{ priceId: PRICE, quantity: 1 }],
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
