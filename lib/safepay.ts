import "server-only";

import { Safepay } from "@sfpy/node-sdk";

import { prisma } from "@/lib/prisma";

// Safepay one-time Pro pass. Web-only (no app-store rules apply). The webhook is
// the source of truth — access is never granted from the browser redirect alone.
const ENV = (process.env.SAFEPAY_ENVIRONMENT || "sandbox").trim();
const API_KEY = process.env.SAFEPAY_API_KEY?.trim();
const V1_SECRET = process.env.SAFEPAY_V1_SECRET?.trim();
const WEBHOOK_SECRET = process.env.SAFEPAY_WEBHOOK_SECRET?.trim();

// PRO_AMOUNT is the raw amount sent to Safepay — set it in env after a sandbox
// test so the unit (PKR vs paisa) is exactly what Safepay expects. Off until set.
export const PRO_CURRENCY = (process.env.SAFEPAY_PRO_CURRENCY || "PKR") as "PKR" | "USD";
export const PRO_AMOUNT = Number(process.env.SAFEPAY_PRO_AMOUNT || 0);
export const PRO_DAYS = Number(process.env.SAFEPAY_PRO_DAYS || 30);

export function isSafepayConfigured(): boolean {
  return Boolean(API_KEY && V1_SECRET && WEBHOOK_SECRET && PRO_AMOUNT > 0);
}

let cached: Safepay | null = null;
function client(): Safepay {
  if (!cached) {
    cached = new Safepay({
      environment: ENV,
      apiKey: API_KEY!,
      v1Secret: V1_SECRET!,
      webhookSecret: WEBHOOK_SECRET!,
    } as unknown as ConstructorParameters<typeof Safepay>[0]);
  }
  return cached;
}

/** Create a hosted-checkout URL for a Pro pass. Returns the URL to redirect to. */
export async function createProCheckout(opts: {
  orderId: string;
  redirectUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const sp = client();
  const { token } = await sp.payments.create({ amount: PRO_AMOUNT, currency: PRO_CURRENCY });
  return sp.checkout.create({
    token,
    orderId: opts.orderId,
    redirectUrl: opts.redirectUrl,
    cancelUrl: opts.cancelUrl,
    source: "custom",
    webhooks: true,
  });
}

/** Verify a webhook's signature via the SDK. */
export function verifyWebhook(req: { body?: unknown; headers?: Record<string, string | string[] | undefined> }): boolean {
  try {
    return client().verify.webhook(req as never);
  } catch {
    return false;
  }
}

/**
 * Idempotently record a payment and grant a Pro pass. Extends an existing
 * (unexpired) pass instead of overwriting it. Safe to call more than once for
 * the same `reference` — the unique constraint makes repeats a no-op.
 */
export async function grantProFromPayment(p: {
  userId: string;
  reference: string;
  orderId?: string;
  amount: number;
  currency: string;
}): Promise<void> {
  const existing = await prisma.payment.findUnique({ where: { reference: p.reference } });
  if (existing) return;

  const user = await prisma.user.findUnique({ where: { id: p.userId }, select: { id: true, proUntil: true } });
  if (!user) return;

  const now = new Date();
  const base = user.proUntil && user.proUntil > now ? user.proUntil : now;
  const proUntil = new Date(base.getTime() + PRO_DAYS * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.payment.create({
      data: {
        userId: p.userId,
        provider: "safepay",
        reference: p.reference,
        orderId: p.orderId,
        amount: p.amount,
        currency: p.currency,
        status: "paid",
        plan: "PRO",
      },
    }),
    prisma.user.update({ where: { id: p.userId }, data: { plan: "PRO", proUntil } }),
  ]);
}

/**
 * Downgrade expired one-time Pro passes to Free. Skips users with a live
 * subscription (their plan is managed by the subscription webhooks). Meant to be
 * called from a scheduled cron (see /api/cron/expire-pro).
 */
export async function expireProPasses(): Promise<number> {
  const expired = await prisma.user.findMany({
    where: { plan: "PRO", proUntil: { lt: new Date() }, subscription: { is: null } },
    select: { id: true },
  });
  if (!expired.length) return 0;
  await prisma.user.updateMany({
    where: { id: { in: expired.map((u) => u.id) } },
    data: { plan: "FREE" },
  });
  return expired.length;
}
