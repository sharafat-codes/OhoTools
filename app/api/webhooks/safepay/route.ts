import { NextResponse } from "next/server";

import { isSafepayConfigured, verifyWebhook, grantProFromPayment, PRO_CURRENCY } from "@/lib/safepay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function pick(o: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    const v = o[k];
    if (v != null && v !== "") return v;
  }
  return undefined;
}

// Safepay puts custom fields in payment_metadata: [{ meta_key, meta_value }, …]
function fromMetadata(o: Record<string, unknown>, key: string): string | undefined {
  const md = o.payment_metadata;
  if (Array.isArray(md)) {
    for (const item of md) {
      if (item && typeof item === "object") {
        const r = item as Record<string, unknown>;
        if (r.meta_key === key && r.meta_value != null) return String(r.meta_value);
      }
    }
  }
  return undefined;
}

// Safepay payment webhook. Verifies the signature, then grants a Pro pass.
export async function POST(req: Request) {
  if (!isSafepayConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await req.text();
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    body = raw;
  }
  const headers = Object.fromEntries(req.headers);

  if (!verifyWebhook({ body, headers })) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 400 });
  }

  const evt = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  // Payment fields may sit at the root or under `data`.
  const data = (evt.data && typeof evt.data === "object" ? evt.data : evt) as Record<string, unknown>;

  const eventType = String(
    pick(evt, "type", "event", "event_type") ?? pick(data, "type", "event", "event_type") ?? "",
  ).toLowerCase();

  // order_id is nested in payment_metadata (meta_key = "order_id").
  const orderId = String(
    fromMetadata(data, "order_id") ??
      fromMetadata(evt, "order_id") ??
      pick(data, "order_id", "orderId") ??
      pick(evt, "order_id", "orderId") ??
      "",
  );
  // The order id is unique per checkout — use it as the idempotency reference.
  const reference =
    orderId || String(pick(data, "token", "notification_id") ?? pick(evt, "token", "notification_id") ?? "");
  const amount = Math.round(Number(pick(data, "amount") ?? pick(evt, "amount") ?? 0));
  const currency = String(pick(data, "currency") ?? pick(evt, "currency") ?? PRO_CURRENCY);

  const userId = orderId.startsWith("pro_") ? orderId.split("_")[1] : "";
  // Grant unless the event explicitly signals a non-success (refund/fail/etc.).
  const isSuccess = eventType ? !/fail|declin|refund|cancel|error|expire|void|revers/.test(eventType) : true;

  if (isSuccess && userId && reference && amount > 0) {
    try {
      await grantProFromPayment({ userId, reference, orderId, amount, currency });
    } catch (e) {
      console.error("[safepay webhook] grant failed", e);
    }
  } else {
    console.log("[safepay webhook] not fulfilled", { eventType, orderId, userId, reference, amount });
  }

  // Always 200 so Safepay stops retrying a received event.
  return NextResponse.json({ ok: true });
}
