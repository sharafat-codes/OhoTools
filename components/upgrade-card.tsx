"use client";

import Link from "next/link";
import { SparklesIcon, CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

// Conversion-focused upgrade card shown at the paywall moment (e.g. when a free
// user hits their daily AI limit). Value-forward, one click to checkout.
const BENEFITS = [
  "Unlimited AI runs — no daily cap",
  "Advanced Office ↔ PDF & CSV ↔ Excel converters",
  "Dynamic QR codes with analytics + the developer API",
  "No ads and priority support",
];

export function UpgradeCard({
  reason,
  href = "/dashboard/billing",
  cta = "Upgrade to Pro",
}: {
  reason?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
      <div className="flex items-center gap-2 text-primary">
        <SparklesIcon className="size-5" />
        <h3 className="font-heading text-base font-semibold">Go Pro — unlock unlimited AI</h3>
      </div>
      {reason && <p className="mt-1.5 text-sm text-muted-foreground">{reason}</p>}
      <ul className="mt-3 flex flex-col gap-1.5">
        {BENEFITS.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            {b}
          </li>
        ))}
      </ul>
      <Button className="mt-4 w-fit" render={<Link href={href} />}>
        <SparklesIcon className="size-4" />
        {cta}
      </Button>
    </div>
  );
}
