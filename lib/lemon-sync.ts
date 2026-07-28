import "server-only";

import { prisma } from "@/lib/prisma";
import { isLemonConfigured, lemonFetch, lemonStoreId, lemonStatusIsPro } from "@/lib/lemonsqueezy";

// Reconcile a user's plan straight from Lemon Squeezy on return from checkout,
// so Pro unlocks even if the webhook is slow or missed. Upgrade-only — never
// downgrades here (the webhook is the source of truth for cancellations).
export async function syncLemonForUser(params: { userId: string; email: string }): Promise<void> {
  if (!isLemonConfigured) return;
  try {
    const store = lemonStoreId();
    const qs = new URLSearchParams();
    if (store) qs.set("filter[store_id]", store);
    qs.set("filter[user_email]", params.email);
    const json = await lemonFetch(`/subscriptions?${qs.toString()}`);
    const data = (json.data as { attributes?: { status?: string } }[] | undefined) ?? [];
    const active = data.some((s) => lemonStatusIsPro(s.attributes?.status ?? ""));
    if (active) {
      await prisma.user
        .update({ where: { id: params.userId }, data: { plan: "PRO" } })
        .catch(() => {});
    }
  } catch {
    // Best-effort; the webhook keeps the plan in sync going forward.
  }
}
