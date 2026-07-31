import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, ZapIcon, ShieldOffIcon, InfinityIcon, XCircleIcon } from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "OhoTool pricing — 150+ tools free. Upgrade to Pro for unlimited AI, advanced document conversions, dynamic QR analytics, bulk tools, and API access.",
  alternates: { canonical: "/pricing" },
};

const REASSURANCE = [
  { icon: InfinityIcon, label: "150+ free tools" },
  { icon: ShieldOffIcon, label: "No ads, ever" },
  { icon: ZapIcon, label: "No sign-up to use tools" },
  { icon: XCircleIcon, label: "Cancel anytime" },
];

const FAQS = [
  {
    q: "Are the tools really free?",
    a: "The vast majority are free and unlimited with no ads, and most don't even need an account. The AI tools give everyone a free daily allowance; Pro removes the limit. A few advanced document conversions are Pro features.",
  },
  {
    q: "What do I actually get with Pro?",
    a: "Unlimited AI tools, advanced document conversions (Office↔PDF, CSV↔Excel, PDF→PowerPoint, and more), dynamic QR codes with scan analytics and branding, bulk generation, API access, and priority support.",
  },
  {
    q: "Do I need an account to use the tools?",
    a: "No — the formatters, converters, calculators, and generators all run in your browser without an account. An account is only needed to save codes and use Pro features.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel from your billing page at any time and keep Pro access until the end of your current billing period.",
  },
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  const proHref = user ? "/dashboard/billing" : "/signup";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple, honest pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Most tools are free forever. Upgrade for unlimited AI, advanced document conversions,
          dynamic QR analytics, bulk tools, and the API.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {REASSURANCE.map((r) => (
            <span key={r.label} className="inline-flex items-center gap-1.5">
              <r.icon className="size-4 text-primary" />
              {r.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border border-border bg-card p-6",
              plan.popular && "border-primary/40 ring-2 ring-primary/20",
            )}
          >
            {plan.popular && <Badge className="absolute -top-2.5 left-6">Most popular</Badge>}
            <h2 className="font-heading text-lg font-semibold">{plan.name}</h2>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-4xl font-semibold">${plan.price}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
            <ul className="mt-5 flex flex-1 flex-col gap-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6"
              variant={plan.popular ? "default" : "outline"}
              render={<Link href={plan.price === 0 ? "/tools" : proHref} />}
            >
              {plan.price === 0 ? "Use the tools" : "Choose Pro"}
            </Button>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-center font-heading text-2xl font-semibold tracking-tight">
          Pricing questions
        </h2>
        <div className="mt-8 flex flex-col gap-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-border bg-card p-4 [&_summary]:cursor-pointer"
            >
              <summary className="font-medium marker:content-none">{item.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
