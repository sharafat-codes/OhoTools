import "server-only";

import { getPaddle, isPaddleConfigured } from "@/lib/paddle";
import { prisma } from "@/lib/prisma";

// Reconcile a user's plan straight from Paddle. Called on return from checkout
// so Pro unlocks even if the webhook is slow, missed, or not yet configured —
// the Paddle equivalent of syncStripeForCustomer.
//
// Upgrade-only: we set PRO when an active/trialing subscription is found, but
// never downgrade here (Paddle's list can lag a moment right after checkout).
// The webhook remains the source of truth for cancellations/downgrades.
export async function syncPaddleForUser(params: {
  userId: string;
  email: string;
}): Promise<void> {
  if (!isPaddleConfigured) return;
  try {
    const paddle = getPaddle();

    const customers = await paddle.customers.list({ email: [params.email] }).next();
    const customer = customers?.[0];
    if (!customer) return;

    const subs = await paddle.subscriptions.list({ customerId: [customer.id] }).next();
    const active = subs?.some(
      (s) => s.status === "active" || s.status === "trialing",
    );

    if (active) {
      await prisma.user
        .update({ where: { id: params.userId }, data: { plan: "PRO" } })
        .catch(() => {});
    }
  } catch {
    // Best-effort; the webhook keeps the plan in sync going forward.
  }
}
