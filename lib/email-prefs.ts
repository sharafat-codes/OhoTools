import "server-only";

import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { sendEmail, renderMarketingEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

// Stateless, signed unsubscribe tokens — no DB storage needed. The link in an
// email carries `${userId}.${hmac}`; /unsubscribe verifies it and flips the
// user's marketingEmails flag.
const secret = process.env.BETTER_AUTH_SECRET || "insecure-dev-secret";
const origin = SITE_URL.replace(/\/$/, "");

function sign(userId: string): string {
  return crypto.createHmac("sha256", secret).update(userId).digest("base64url");
}

export function unsubscribeToken(userId: string): string {
  return `${userId}.${sign(userId)}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  const i = token.lastIndexOf(".");
  if (i < 1) return null;
  const userId = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sign(userId);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return userId;
  } catch {
    /* malformed */
  }
  return null;
}

export function unsubscribeUrl(userId: string): string {
  return `${origin}/unsubscribe?token=${encodeURIComponent(unsubscribeToken(userId))}`;
}

/**
 * Sends an engagement email — but only if the user hasn't opted out. Always
 * attaches the unsubscribe footer + List-Unsubscribe header. Use this (never
 * sendEmail directly) for any non-transactional email so consent can't be
 * forgotten.
 */
export async function sendMarketingEmail(opts: {
  userId: string;
  to: string;
  subject: string;
  heading: string;
  intro: string;
  bullets?: string[];
  buttonLabel?: string;
  buttonUrl?: string;
  outro?: string;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  // Respect opt-out. If we can't confirm consent (DB error), don't send.
  try {
    const u = await prisma.user.findUnique({
      where: { id: opts.userId },
      select: { marketingEmails: true },
    });
    if (!u || u.marketingEmails === false) return { ok: false, skipped: true };
  } catch {
    return { ok: false, skipped: true };
  }

  const unsub = unsubscribeUrl(opts.userId);
  const html = renderMarketingEmail({
    heading: opts.heading,
    intro: opts.intro,
    bullets: opts.bullets,
    buttonLabel: opts.buttonLabel,
    buttonUrl: opts.buttonUrl,
    outro: opts.outro,
    unsubscribeUrl: unsub,
  });

  return sendEmail({
    to: opts.to,
    subject: opts.subject,
    html,
    headers: { "List-Unsubscribe": `<${unsub}>` },
  });
}
