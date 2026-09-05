import "server-only";

import { headers } from "next/headers";

// Country-aware pricing. We never store the visitor's IP — we read Vercel's edge
// geo header per request (empty in local dev). Pakistani visitors are shown the
// Safepay PKR price (a one-time 30-day Pro pass); everyone else sees USD.

export async function getRequestCountry(): Promise<string> {
  const h = await headers();
  return (h.get("x-vercel-ip-country") || "").toUpperCase();
}

export type ProPrice = {
  isPk: boolean;
  currency: "USD" | "PKR";
  /** Formatted price with symbol, e.g. "$9" or "Rs 2,500". */
  display: string;
  /** Billing period label, e.g. "month". */
  period: string;
};

/** Resolve the Pro price to show this visitor. `usdPrice` is the default (USD). */
export async function getProPrice(usdPrice: number): Promise<ProPrice> {
  const country = await getRequestCountry();
  const pkr = Number(process.env.SAFEPAY_PRO_AMOUNT || 0);
  // Only show the PKR (Safepay) price once Safepay is LIVE in production. While
  // it's still in sandbox/pending approval, PK visitors pay via Paddle in USD,
  // so we must show USD to match. Flip SAFEPAY_ENVIRONMENT=production to re-enable.
  const safepayLive = (process.env.SAFEPAY_ENVIRONMENT || "sandbox").trim() === "production";
  if (country === "PK" && pkr > 0 && safepayLive) {
    return {
      isPk: true,
      currency: "PKR",
      display: `PKR ${pkr.toLocaleString("en-PK")}`,
      period: "month",
    };
  }
  return { isPk: false, currency: "USD", display: `$${usdPrice}`, period: "month" };
}
