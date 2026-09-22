import { NextResponse, type NextRequest } from "next/server";

import { getPaddle, grantPaddlePass, isPaddlePassConfigured, PADDLE_PASS_PRICE_ID } from "@/lib/paddle";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Paddle subscription webhooks -> keep User.plan in sync (PRO/FREE).
// The userId is attached as customData at checkout.
export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("paddle-signature") ?? "";
  const raw = await req.text();

  let event;
  try {
    event = await getPaddle().webhooks.unmarshal(raw, secret, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }
  if (!event) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }

  try {
    if (event.eventType.startsWith("subscription.")) {
      const data = event.data as {
        status?: string;
        customerId?: string;
        customData?: { userId?: string } | null;
      };
      let userId = data.customData?.userId;

      // Fallback: if customData didn't carry our userId, map via the Paddle
      // customer's email so cancellations/renewals still resolve to a user.
      if (!userId && data.customerId) {
        try {
          const customer = await getPaddle().customers.get(data.customerId);
          if (customer?.email) {
            const u = await prisma.user.findUnique({
              where: { email: customer.email },
              select: { id: true },
            });
            userId = u?.id;
          }
        } catch {
          // ignore — nothing we can do without a mappable user
        }
      }

      if (userId) {
        const canceled = event.eventType === "subscription.canceled" || data.status === "canceled";
        const active = data.status === "active" || data.status === "trialing";
        if (canceled) {
          // Don't revoke a one-time pass that is still running: the user paid
          // for a window, and cancelling a separate subscription must not cut
          // it short. expireProPasses() downgrades them when the date passes.
          const u = await prisma.user
            .findUnique({ where: { id: userId }, select: { proUntil: true } })
            .catch(() => null);
          const passStillValid = !!u?.proUntil && u.proUntil > new Date();
          if (!passStillValid) {
            await prisma.user.update({ where: { id: userId }, data: { plan: "FREE" } }).catch(() => {});
          }
        } else if (active) {
          await prisma.user.update({ where: { id: userId }, data: { plan: "PRO" } }).catch(() => {});
        }
      }
    }

    // One-time Pro pass. A subscription's first payment also fires
    // transaction.completed, so match on the pass price id specifically —
    // otherwise every subscription payment would also grant a pass.
    if (event.eventType === "transaction.completed" && isPaddlePassConfigured) {
      const data = event.data as {
        id?: string;
        customerId?: string;
        customData?: { userId?: string } | null;
        items?: Array<{ price?: { id?: string } | null } | null> | null;
        currencyCode?: string;
        details?: { totals?: { grandTotal?: string; currencyCode?: string } | null } | null;
      };

      const isPass = (data.items ?? []).some((i) => i?.price?.id === PADDLE_PASS_PRICE_ID);
      if (isPass && data.id) {
        let userId = data.customData?.userId;

        // Same email fallback as the subscription path, for a checkout that
        // somehow lost its customData.
        if (!userId && data.customerId) {
          try {
            const customer = await getPaddle().customers.get(data.customerId);
            if (customer?.email) {
              const u = await prisma.user.findUnique({
                where: { email: customer.email },
                select: { id: true },
              });
              userId = u?.id;
            }
          } catch {
            // nothing we can do without a mappable user
          }
        }

        if (userId) {
          // Paddle sends totals as a string in minor units ("900" = 9.00).
          const minor = Number(data.details?.totals?.grandTotal ?? NaN);
          await grantPaddlePass({
            userId,
            reference: data.id,
            amount: Number.isFinite(minor) ? minor / 100 : 0,
            currency: data.details?.totals?.currencyCode ?? data.currencyCode ?? "USD",
          });
        }
      }
    }
  } catch {
    // Never fail the webhook on our side — Paddle would retry.
  }

  return NextResponse.json({ received: true });
}
