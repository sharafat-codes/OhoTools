import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import { lemonStatusIsPro } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only these carry a subscription lifecycle status in data.attributes.status.
// NOT subscription_payment_* — those carry an INVOICE (status "paid"/"refunded"),
// which would otherwise be misread as a non-Pro status and wrongly downgrade.
const LIFECYCLE_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
  "subscription_paused",
  "subscription_unpaused",
]);

// Lemon Squeezy webhooks -> keep User.plan in sync (PRO/FREE).
// Signature is an HMAC-SHA256 hex of the raw body using the signing secret.
// Our userId is attached as custom data at checkout (meta.custom_data.user_id).
export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");

  let valid = false;
  try {
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");
    valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    valid = false;
  }
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let event: {
    meta?: { event_name?: string; custom_data?: { user_id?: string } };
    data?: { id?: string; attributes?: { status?: string; user_email?: string } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  try {
    const name = event.meta?.event_name ?? "";
    if (LIFECYCLE_EVENTS.has(name)) {
      const status = event.data?.attributes?.status ?? "";
      let userId = event.meta?.custom_data?.user_id;

      // Fallback: map by the subscription's email if custom data is missing.
      if (!userId) {
        const email = event.data?.attributes?.user_email;
        if (email) {
          const u = await prisma.user.findUnique({ where: { email }, select: { id: true } });
          userId = u?.id;
        }
      }

      if (userId && status) {
        const plan = lemonStatusIsPro(status) ? "PRO" : "FREE";
        const subId = event.data?.id;
        await prisma.user
          .update({
            where: { id: userId },
            data: { plan, ...(subId ? { lemonSubscriptionId: subId } : {}) },
          })
          .catch(() => {});
      }
    }
  } catch {
    // Never fail the webhook on our side — Lemon Squeezy would retry.
  }

  return NextResponse.json({ received: true });
}
