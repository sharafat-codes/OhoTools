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

// Safepay payment webhook. Verifies the signature, then grants a Pro pass.
// NOTE: confirm the exact payload field names against a real sandbox webhook —
// the raw event is logged below so the parsing can be finalized after one test.
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
  const data = (evt.data && typeof evt.data === "object" ? evt.data : evt) as Record<string, unknown>;

  const orderId = String(pick(data, "order_id", "orderId") ?? pick(evt, "order_id", "orderId") ?? "");
  const tracker = String(pick(data, "tracker", "token", "tracker_token") ?? pick(evt, "tracker") ?? "");
  const amount = Number(pick(data, "amount") ?? pick(evt, "amount") ?? 0);
  const currency = String(pick(data, "currency") ?? PRO_CURRENCY);
  const state = String(pick(data, "state", "status") ?? pick(evt, "type") ?? "").toLowerCase();

  const paid = /paid|complete|success|tracker_ended|captured/.test(state);
  const userId = orderId.startsWith("pro_") ? orderId.split("_")[1] : "";

  if (paid && userId && tracker) {
    try {
      await grantProFromPayment({ userId, reference: tracker, orderId, amount, currency });
    } catch (e) {
      console.error("[safepay webhook] grant failed", e);
    }
  } else {
    // Log so the payload shape / state values can be confirmed on first test.
    console.log("[safepay webhook] not fulfilled", { state, orderId, tracker, amount });
  }

  // Always 200 so Safepay stops retrying a received event.
  return NextResponse.json({ ok: true });
}
