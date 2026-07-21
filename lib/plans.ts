// Client-safe plan metadata + gating helpers. No secrets / env here so this can
// be imported by client components (pricing cards, badges).

export type PlanId = "FREE" | "PRO" | "BUSINESS";

export type Plan = {
  id: PlanId;
  name: string;
  price: number; // USD / month
  tagline: string;
  features: string[];
  popular?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "FREE",
    name: "Free",
    price: 0,
    tagline: "For getting started.",
    features: [
      "QR & barcode generators",
      `Save up to ${10} of each`,
      "PNG downloads",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: 9,
    tagline: "For freelancers and creators.",
    popular: true,
    features: [
      "Unlimited saved codes",
      "Priority generation",
      "Everything in Free",
      "API access (coming soon)",
    ],
  },
  {
    id: "BUSINESS",
    name: "Business",
    price: 29,
    tagline: "For teams and agencies.",
    features: [
      "Everything in Pro",
      "Team workspace (coming soon)",
      "Advanced analytics (coming soon)",
      "Priority support",
    ],
  },
];

export const PLAN_BY_ID: Record<PlanId, Plan> = Object.fromEntries(
  PLANS.map((p) => [p.id, p]),
) as Record<PlanId, Plan>;

// Free-tier limits (per asset type). Paid plans are unlimited.
export const FREE_SAVE_LIMIT = 10;

const PLAN_RANK: Record<string, number> = { FREE: 0, PRO: 1, BUSINESS: 2 };

export function hasPlan(current: string, required: PlanId): boolean {
  return (PLAN_RANK[current] ?? 0) >= (PLAN_RANK[required] ?? 0);
}

export function isPro(plan: string): boolean {
  return hasPlan(plan, "PRO");
}
