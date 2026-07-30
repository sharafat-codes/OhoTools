"use server";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import {
  isLemonConfigured,
  lemonFetch,
  lemonStoreId,
  lemonVariantForPlan,
  lemonStatusIsPro,
} from "@/lib/lemonsqueezy";

type ActionResult = { url: string } | { error: string };

/** Fetch a fresh customer-portal URL for a specific subscription id. */
async function portalUrlForSubscription(id: string): Promise<string | null> {
  const json = await lemonFetch(`/subscriptions/${id}`);
  const url = (json.data as { attributes?: { urls?: { customer_portal?: string } } } | undefined)
    ?.attributes?.urls?.customer_portal;
  return url ?? null;
}

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
    // 1) Preferred: the subscription id captured from the webhook — this is
    //    email-independent, so it works even if the checkout used another email.
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { lemonSubscriptionId: true },
    });
    if (dbUser?.lemonSubscriptionId) {
      try {
        const url = await portalUrlForSubscription(dbUser.lemonSubscriptionId);
        if (url) return { url };
      } catch {
        // Stored id is stale/invalid — fall through to the email lookup below.
      }
    }

    // 2) Fallback: find the subscription by the account email, then fetch its
    //    portal URL from the single-subscription endpoint (the list response
    //    doesn't always include it). Backfill the id for next time.
    const store = lemonStoreId();
    const qs = new URLSearchParams();
    if (store) qs.set("filter[store_id]", store);
    qs.set("filter[user_email]", user.email);
    const json = await lemonFetch(`/subscriptions?${qs.toString()}`);
    const data = (json.data as { id?: string; attributes?: { status?: string } }[] | undefined) ?? [];
    const sub = data.find((s) => lemonStatusIsPro(s.attributes?.status ?? "")) ?? data[0];
    if (sub?.id) {
      await prisma.user
        .update({ where: { id: user.id }, data: { lemonSubscriptionId: sub.id } })
        .catch(() => {});
      const url = await portalUrlForSubscription(sub.id);
      if (url) return { url };
    }

    return { error: "No Lemon Squeezy subscription was found for your account." };
  } catch (err) {
    const e = err as { message?: string };
    return {
      error: e.message
        ? `Could not open the billing portal: ${e.message}`
        : "Could not open the billing portal. Try again.",
    };
  }
}
