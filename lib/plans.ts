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
    tagline: "Everything you need, no account required.",
    features: [
      "200+ online tools — always free",
      "AI writing & Chat with PDF — free daily use",
      "AI mock interview + resume reviewer — free daily",
      "AI image upscaler & background remover",
      "PDF, image, audio & video tools",
      "Encrypted file sharing (Send)",
      "QR & barcode generator",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: 9,
    tagline: "For creators, teams, and businesses.",
    popular: true,
    features: [
      "Everything in Free",
      "No ads — a clean, ad-free experience",
      "Unlimited AI — writing, Chat with PDF & more",
      "AI mock interviews & resume rewrites — unlimited",
      "Office ↔ PDF, CSV ↔ Excel & more converters",
      "Developer API — convert & QR (1,000 calls/mo)",
      "Send links that last up to 7 days",
      "Dynamic QR codes + scan analytics",
      "Animated cards — custom colors, no watermark & image downloads",
      "Bulk image, PDF & QR processing",
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
