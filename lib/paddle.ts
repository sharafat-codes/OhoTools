import "server-only";

import { Environment, Paddle } from "@paddle/paddle-node-sdk";

import { prisma } from "@/lib/prisma";

// Paddle (Merchant of Record) — used alongside Stripe. Server-side config only.
// The browser uses NEXT_PUBLIC_PADDLE_* vars via the checkout button.

// Trim defensively — a stray space/newline in the env value produces
// Paddle's "authentication_malformed" and breaks every server-side call.
const PADDLE_API_KEY = process.env.PADDLE_API_KEY?.trim();

export const isPaddleConfigured = Boolean(PADDLE_API_KEY);

export const paddleEnvironment: Environment =
  process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
    ? Environment.production
    : Environment.sandbox;

let cached: Paddle | null = null;

export function getPaddle(): Paddle {
  if (!PADDLE_API_KEY) {
    throw new Error("PADDLE_API_KEY is not set");
  }
  if (!cached) {
    cached = new Paddle(PADDLE_API_KEY, { environment: paddleEnvironment });
  }
  return cached;
}

// ── One-time Pro pass ────────────────────────────────────────────────────────
// A subscription is the wrong shape for a product people use once: a wedding
// invitation, a single batch of conversions, one mock interview. The pass sells
// a fixed window of Pro instead. The grant/expiry machinery already exists
// (User.proUntil + /api/cron/expire-pro); this just lets Paddle reach it, the
// way Safepay already can for Pakistan.
//
// Inert until NEXT_PUBLIC_PADDLE_PRICE_PRO_PASS is set, so nothing about the
// current subscription flow changes until you create the price in Paddle.
export const PADDLE_PASS_PRICE_ID = (process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_PASS || "").trim();
export const PADDLE_PASS_DAYS = Number(process.env.NEXT_PUBLIC_PADDLE_PASS_DAYS || 30);
export const isPaddlePassConfigured = Boolean(PADDLE_PASS_PRICE_ID);

/**
 * Grant (or extend) a one-time Pro pass from a completed Paddle transaction.
 *
 * Deliberately mirrors grantSafepayPro rather than sharing code with it: the
 * Safepay path is live and working, and a refactor there is not worth the risk.
 * Idempotent on the transaction id, extends an unexpired pass instead of
 * truncating it, and treats the plan update as the critical step — the payment
 * row is best-effort so a bookkeeping failure can never cost someone what they
 * paid for.
 */
export async function grantPaddlePass(p: {
  userId: string;
  reference: string;
  amount: number;
  currency: string;
}): Promise<{ ok: boolean; reason?: string }> {
  try {
    const existing = await prisma.payment.findUnique({ where: { reference: p.reference } });
    if (existing) return { ok: true, reason: "already-recorded" };
  } catch (e) {
    console.error("[paddle] payment lookup failed (continuing to grant)", e);
  }

  const user = await prisma.user.findUnique({
    where: { id: p.userId },
    select: { id: true, proUntil: true },
  });
  if (!user) return { ok: false, reason: "user-not-found" };

  const now = new Date();
  const base = user.proUntil && user.proUntil > now ? user.proUntil : now;
  const proUntil = new Date(base.getTime() + PADDLE_PASS_DAYS * 24 * 60 * 60 * 1000);

  await prisma.user.update({ where: { id: p.userId }, data: { plan: "PRO", proUntil } });

  try {
    await prisma.payment.create({
      data: {
        userId: p.userId,
        provider: "paddle",
        reference: p.reference,
        amount: p.amount,
        currency: p.currency,
        status: "paid",
        plan: "PRO",
      },
    });
  } catch (e) {
    console.error("[paddle] payment record failed (Pro still granted)", e);
  }

  return { ok: true };
}
