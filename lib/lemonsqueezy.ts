import "server-only";

// Lemon Squeezy (Merchant of Record) — the active billing provider. Server-side
// config + a thin JSON:API fetch helper (no SDK dependency). Checkout, portal,
// and plan sync mirror the Paddle integration.

const API = "https://api.lemonsqueezy.com/v1";

const API_KEY = process.env.LEMONSQUEEZY_API_KEY?.trim();
const STORE_ID = process.env.LEMONSQUEEZY_STORE_ID?.trim();
const VARIANT_PRO = process.env.LEMONSQUEEZY_VARIANT_PRO?.trim();

export const isLemonConfigured = Boolean(API_KEY && STORE_ID && VARIANT_PRO);

export function lemonStoreId(): string | null {
  return STORE_ID || null;
}

export function lemonVariantForPlan(plan: string): string | null {
  if (plan === "PRO") return VARIANT_PRO || null;
  return null;
}

type Json = Record<string, unknown>;

export async function lemonFetch(path: string, init?: RequestInit): Promise<Json> {
  if (!API_KEY) throw new Error("LEMONSQUEEZY_API_KEY is not set");
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${API_KEY}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  const json = (text ? JSON.parse(text) : {}) as Json;
  if (!res.ok) {
    const errors = (json as { errors?: { detail?: string }[] }).errors;
    throw new Error(errors?.[0]?.detail || `Lemon Squeezy API error (${res.status})`);
  }
  return json;
}

// Statuses that entitle a user to Pro. "cancelled" keeps access until the
// period ends (a later `subscription_expired` event downgrades to FREE).
export function lemonStatusIsPro(status: string): boolean {
  return ["active", "on_trial", "past_due", "cancelled"].includes(status);
}
