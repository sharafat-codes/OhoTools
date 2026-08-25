import { NextResponse } from "next/server";

import {
  isSafepayConfigured,
  verifySafepayWebhook,
  safepayIsSandbox,
  grantProFromPayment,
  PRO_CURRENCY,
} from "@/lib/safepay";

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

export async function POST(req: Request) {
  if (!isSafepayConfigured()) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await req.text();
  const sig = req.headers.get("x-sfpy-signature");
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    body = {};
  }

  const evt = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const data = (evt.data && typeof evt.data === "object" ? evt.data : evt) as Record<string, unknown>;

  const verified = verifySafepayWebhook(raw, sig);
  console.log("[safepay] webhook", { verified, hasSig: !!sig, bodyKeys: Object.keys(evt), hasDataKey: "data" in evt });

  // Enforce the signature in production; in sandbox we let it through so testing
  // isn't blocked while the exact signing shape is confirmed from these logs.
  if (!verified && !safepayIsSandbox()) {
    return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 400 });
  }

  const orderId = String(
    fromMetadata(data, "order_id") ??
      fromMetadata(evt, "order_id") ??
      pick(data, "order_id", "orderId") ??
      pick(evt, "order_id", "orderId") ??
      "",
  );
  const reference =
    orderId || String(pick(data, "token", "notification_id") ?? pick(evt, "token", "notification_id") ?? "");
  const amount = Math.round(Number(pick(data, "amount") ?? pick(evt, "amount") ?? 0));
  const currency = String(pick(data, "currency") ?? pick(evt, "currency") ?? PRO_CURRENCY);
  const state = String(pick(data, "state", "status") ?? pick(evt, "state", "status") ?? "").toLowerCase();
  const eventType = String(pick(evt, "type", "event", "event_type") ?? "").toLowerCase();

  const userId = orderId.startsWith("pro_") ? orderId.split("_")[1] : "";
  const isSuccess = state
    ? /paid|complete|success|captur/.test(state)
    : eventType
      ? !/fail|declin|refund|cancel|error|expire|void|revers/.test(eventType)
      : true;

  console.log("[safepay] parsed", { verified, state, eventType, orderId, userId, reference, amount });

  let grant: { ok: boolean; reason?: string } | null = null;
  let grantError: string | null = null;
  if (isSuccess && userId && reference && amount > 0) {
    try {
      grant = await grantProFromPayment({ userId, reference, orderId, amount, currency });
      console.log("[safepay] grant result", grant);
    } catch (e) {
      grantError = e instanceof Error ? e.message : String(e);
      console.error("[safepay] grant failed", e);
    }
  } else {
    console.log("[safepay] not fulfilled", { isSuccess, userId, reference, amount });
  }

  // Always 200 so Safepay stops retrying. In sandbox, echo diagnostics in the
  // response body so a replay (or the Safepay dashboard) shows exactly what
  // happened — no Vercel log-diving needed. Never leak this in production.
  if (safepayIsSandbox()) {
    return NextResponse.json({
      ok: true,
      debug: { verified, state, eventType, orderId, userId, reference, amount, isSuccess, grant, grantError },
    });
  }
  return NextResponse.json({ ok: true });
}
