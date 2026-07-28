"use server";

import { requireUser } from "@/lib/dal";
import { SITE_URL } from "@/lib/site";
import {
  isLemonConfigured,
  lemonFetch,
  lemonStoreId,
  lemonVariantForPlan,
  lemonStatusIsPro,
} from "@/lib/lemonsqueezy";

type ActionResult = { url: string } | { error: string };

/** Create a Lemon Squeezy hosted checkout and return its URL to redirect to. */
export async function createLemonCheckout(plan: "PRO" | "BUSINESS"): Promise<ActionResult> {
  const user = await requireUser();
  if (!isLemonConfigured) return { error: "Billing isn't configured yet." };

  const storeId = lemonStoreId();
  const variantId = lemonVariantForPlan(plan);
  if (!storeId || !variantId) return { error: "That plan isn't available yet." };

  try {
    const body = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: user.email,
            name: user.name,
            custom: { user_id: user.id },
          },
          product_options: {
            redirect_url: `${SITE_URL}/dashboard/billing?checkout=success`,
            enabled_variants: [Number(variantId)],
          },
        },
        relationships: {
          store: { data: { type: "stores", id: String(storeId) } },
          variant: { data: { type: "variants", id: String(variantId) } },
        },
      },
    };
    const json = await lemonFetch("/checkouts", { method: "POST", body: JSON.stringify(body) });
    const url = (json.data as { attributes?: { url?: string } } | undefined)?.attributes?.url;
    if (!url) return { error: "Could not start checkout." };
    return { url };
  } catch (err) {
    const e = err as { message?: string };
    return {
      error: e.message ? `Could not start checkout: ${e.message}` : "Something went wrong starting checkout.",
    };
  }
}

/** Open the Lemon Squeezy customer portal (manage / cancel), looked up by email. */
export async function createLemonPortalSession(): Promise<ActionResult> {
  const user = await requireUser();
  if (!isLemonConfigured) return { error: "Billing isn't configured yet." };

  try {
    const store = lemonStoreId();
    const qs = new URLSearchParams();
    if (store) qs.set("filter[store_id]", store);
    qs.set("filter[user_email]", user.email);
    const json = await lemonFetch(`/subscriptions?${qs.toString()}`);
    const data =
      (json.data as { attributes?: { status?: string; urls?: { customer_portal?: string } } }[] | undefined) ?? [];
    const sub = data.find((s) => lemonStatusIsPro(s.attributes?.status ?? "")) ?? data[0];
    const url = sub?.attributes?.urls?.customer_portal;
    if (!url) return { error: "No Lemon Squeezy subscription was found for your account." };
    return { url };
  } catch (err) {
    const e = err as { message?: string };
    return {
      error: e.message
        ? `Could not open the billing portal: ${e.message}`
        : "Could not open the billing portal. Try again.",
    };
  }
}
