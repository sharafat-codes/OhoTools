import "server-only";

import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import { buildHashMessage, jazzCashSecureHash as signFields } from "@/lib/jazzcash-hash";

// JazzCash Payment Gateway — hosted "Page Redirection" checkout.
//
// Pakistan's largest mobile wallet, and the reason this exists: Paddle does not
// support PKR, so Pakistani buyers are quoted USD and need an internationally
// enabled card, which most local debit cards are not. JazzCash settles in PKR
// over local rails.
//
// Flow: we POST a signed form to JazzCash, the customer pays on their page, and
// JazzCash POSTs the result back to our return URL. Everything is verified with
// an HMAC-SHA256 secure hash in both directions.
//
// Inert until JAZZCASH_MERCHANT_ID / PASSWORD / INTEGRITY_SALT are all set.

const MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID?.trim() || "";
const PASSWORD = process.env.JAZZCASH_PASSWORD?.trim() || "";
const INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT?.trim() || "";

const IS_PRODUCTION = (process.env.JAZZCASH_ENVIRONMENT || "sandbox").trim() === "production";

/** Rupees. Stored on the Payment row in rupees, matching the Safepay rows. */
export const JAZZCASH_PRO_AMOUNT = Number(process.env.JAZZCASH_PRO_AMOUNT || 0);
export const JAZZCASH_PRO_DAYS = Number(process.env.JAZZCASH_PRO_DAYS || 30);

const POST_URL = IS_PRODUCTION
  ? "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"
  : "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

export function isJazzCashConfigured(): boolean {
  return Boolean(MERCHANT_ID && PASSWORD && INTEGRITY_SALT && JAZZCASH_PRO_AMOUNT > 0);
}

export function jazzCashIsSandbox(): boolean {
  return !IS_PRODUCTION;
}


/** Signs with this merchant’s integrity salt. */
export function jazzCashSecureHash(fields: Record<string, string>): string {
  return signFields(fields, INTEGRITY_SALT);
}

export { buildHashMessage };

/** yyyyMMddHHmmss in Pakistan Standard Time (UTC+5), which is what the gateway expects. */
function pktStamp(at: Date): string {
  const pkt = new Date(at.getTime() + 5 * 60 * 60 * 1000);
  return pkt.toISOString().replace(/[-:T]/g, "").slice(0, 14);
}

/**
 * pp_TxnRefNo is capped at 20 characters, so unlike the Safepay flow the user id
 * cannot be encoded into it. Instead a pending Payment row is written before the
 * redirect and looked up by reference when JazzCash calls back — which also
 * avoids depending on whether the gateway echoes our optional fields.
 */
function newTxnRef(): string {
  const stamp = pktStamp(new Date()); // 14
  const rand = crypto.randomBytes(3).toString("hex").slice(0, 5); // 5
  return `T${stamp}${rand}`; // 20
}

export type JazzCashCheckout = { postUrl: string; fields: Record<string, string> };

/** Builds the signed form for a Pro pass and records it as pending. */
export async function createJazzCashCheckout(opts: {
  userId: string;
  returnUrl: string;
  description?: string;
}): Promise<JazzCashCheckout> {
  if (!isJazzCashConfigured()) throw new Error("JazzCash is not configured.");

  const now = new Date();
  const txnRef = newTxnRef();

  const fields: Record<string, string> = {
    pp_Version: "1.1",
    // Left blank so the customer picks their method on JazzCash's page — mobile
    // wallet, over the counter, or card.
    pp_TxnType: "",
    pp_Language: "EN",
    pp_MerchantID: MERCHANT_ID,
    pp_SubMerchantID: "",
    pp_Password: PASSWORD,
    pp_BankID: "",
    pp_ProductID: "",
    pp_TxnRefNo: txnRef,
    // Paisa: the guide states 100.00 is sent as 10000.
    pp_Amount: String(Math.round(JAZZCASH_PRO_AMOUNT * 100)),
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: pktStamp(now),
    pp_BillReference: "ohotoolpro",
    pp_Description: opts.description ?? `OhoTool Pro — ${JAZZCASH_PRO_DAYS} days`,
    // One hour to pay. The gateway allows up to three months.
    pp_TxnExpiryDateTime: pktStamp(new Date(now.getTime() + 60 * 60 * 1000)),
    pp_ReturnURL: opts.returnUrl,
  };

  fields.pp_SecureHash = jazzCashSecureHash(fields);

  // Written before the redirect so the callback can attribute the payment even
  // if JazzCash drops our optional fields.
  await prisma.payment.create({
    data: {
      userId: opts.userId,
      provider: "jazzcash",
      reference: txnRef,
      amount: JAZZCASH_PRO_AMOUNT,
      currency: "PKR",
      status: "pending",
      plan: "PRO",
    },
  });

  return { postUrl: POST_URL, fields };
}

export type JazzCashResult =
  | { ok: true; alreadyHandled: boolean }
  | { ok: false; reason: string };

/**
 * Handles the callback. Verifies the signature, checks the response code, then
 * grants Pro. Mirrors the Safepay grant: idempotent, extends an unexpired pass
 * rather than truncating it, and treats the plan update as the step that must
 * not fail.
 */
export async function completeJazzCashPayment(
  fields: Record<string, string>,
): Promise<JazzCashResult> {
  if (!isJazzCashConfigured()) return { ok: false, reason: "not-configured" };

  const provided = (fields.pp_SecureHash || "").toUpperCase();
  const expected = jazzCashSecureHash(fields);
  if (!provided || provided !== expected) {
    return { ok: false, reason: "bad-signature" };
  }

  const code = fields.pp_ResponseCode;
  const txnRef = fields.pp_TxnRefNo;
  if (!txnRef) return { ok: false, reason: "no-reference" };

  const payment = await prisma.payment.findUnique({ where: { reference: txnRef } });
  if (!payment) return { ok: false, reason: "unknown-reference" };
  if (payment.status === "paid") return { ok: true, alreadyHandled: true };

  // 000 is the only success code; everything else is a decline or an error.
  if (code !== "000") {
    await prisma.payment
      .update({ where: { reference: txnRef }, data: { status: "failed" } })
      .catch(() => {});
    return { ok: false, reason: `declined-${code ?? "unknown"}` };
  }

  const user = await prisma.user.findUnique({
    where: { id: payment.userId },
    select: { id: true, proUntil: true },
  });
  if (!user) return { ok: false, reason: "user-not-found" };

  const now = new Date();
  const base = user.proUntil && user.proUntil > now ? user.proUntil : now;
  const proUntil = new Date(base.getTime() + JAZZCASH_PRO_DAYS * 24 * 60 * 60 * 1000);

  await prisma.user.update({ where: { id: user.id }, data: { plan: "PRO", proUntil } });

  await prisma.payment
    .update({
      where: { reference: txnRef },
      data: { status: "paid", orderId: fields.pp_RetreivalReferenceNo || null },
    })
    .catch((e) => {
      console.error("[jazzcash] payment row update failed (Pro still granted)", e);
    });

  return { ok: true, alreadyHandled: false };
}
