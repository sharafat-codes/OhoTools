import "server-only";

import { prisma } from "@/lib/prisma";
import { sendEmail, renderActionEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";
import { PASS_DAYS, PASS_PRICE } from "@/lib/pro-pass";

// Emails around the one-time Pro pass: a thank-you when it is bought, and a
// reminder a day or two before it ends. Both are transactional (they are about
// something the person paid for), so they carry no unsubscribe link.
//
// Replies go to CONTACT_EMAIL, a real inbox, rather than the noreply sender —
// the thank-you explicitly asks buyers to reply with what they wish OhoTool
// did, and paying users are the best source of that there is.

const origin = SITE_URL.replace(/\/$/, "");
const replyTo = () => process.env.CONTACT_EMAIL?.trim() || undefined;
const DAY_MS = 24 * 60 * 60 * 1000;

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

function firstName(name: string | null | undefined): string {
  return esc((name ?? "").trim().split(/\s+/)[0] || "there");
}

/**
 * "21 October 2026, 14:05 UTC". Spelled out in UTC because the server cannot
 * know the reader's timezone — a bare date would be a day off for anyone whose
 * pass ends late in the UTC day.
 */
export function formatPassEnd(d: Date): string {
  const date = d.toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: false });
  return `${date}, ${time} UTC`;
}

// What the pass unlocks. Kept to things that are actually Pro-gated in the code.
const UNLOCKS =
  "every premium card and invitation design; the invitation website — countdown, schedule, photo gallery, " +
  "your own music and RSVP; no watermark; image and video downloads; the full RSVP guest list with CSV export; " +
  "and every Pro tool on OhoTool";

export function renderPassThanks(p: {
  name: string | null;
  proUntil: Date;
  extended: boolean;
  provider: string;
}): { subject: string; html: string } {
  const until = `<strong>${formatPassEnd(p.proUntil)}</strong>`;
  const opening = p.extended
    ? `Your Pro pass has been extended and now runs until ${until}. The new days were added on top of the time you had left.`
    : `Your Pro pass is active until ${until}.`;
  return {
    subject: p.extended ? "Your OhoTool Pro pass has been extended" : "Thank you — your OhoTool Pro pass is active",
    html: renderActionEmail({
      heading: `Thank you, ${firstName(p.name)}!`,
      body:
        `${opening}<br/><br/>` +
        `Everything Pro is unlocked: ${UNLOCKS}.<br/><br/>` +
        `<strong>Is there something you need that OhoTool doesn't do yet?</strong> Just reply to this email and tell us. ` +
        `Requests from paying users go to the front of the queue — the invitation website itself started as one person's request.`,
      buttonLabel: "Open your dashboard",
      buttonUrl: `${origin}/dashboard`,
      footnote:
        `Your payment receipt comes separately from ${esc(p.provider)}, our payment provider. ` +
        `This was a one-time payment — nothing renews automatically.`,
    }),
  };
}

export function renderPassReminder(p: { name: string | null; proUntil: Date; now?: Date }): { subject: string; html: string } {
  const hoursLeft = (p.proUntil.getTime() - (p.now ?? new Date()).getTime()) / 36e5;
  const when = hoursLeft <= 36 ? "tomorrow" : "in 2 days";
  const extendLabel = PASS_PRICE ? `Extend ${PASS_DAYS} days — ${PASS_PRICE}` : "Extend your pass";
  return {
    subject: `Your OhoTool Pro pass ends ${when}`,
    html: renderActionEmail({
      heading: `Your Pro pass ends ${when}`,
      body:
        `Hi ${firstName(p.name)}, your OhoTool Pro pass ends on <strong>${formatPassEnd(p.proUntil)}</strong>.<br/><br/>` +
        `After that your account goes back to Free. <strong>Everything you've made stays</strong> — your cards and ` +
        `invitation websites keep working, and their links don't change. What locks is the Pro side: premium designs ` +
        `and website features when you create or edit, watermark-free downloads, and the full RSVP guest list ` +
        `(you'll still see the counts, and still get an email for every reply).<br/><br/>` +
        `Need more time? Extending now adds ${PASS_DAYS} days on top of what you have left — you don't lose a day.`,
      buttonLabel: extendLabel,
      buttonUrl: `${origin}/dashboard/billing`,
      footnote:
        "Nothing renews automatically, so if you don't need more time you can simply ignore this email. " +
        "Something you'd like OhoTool to do? Just reply.",
    }),
  };
}

/**
 * Thank-you for a purchased pass. Best-effort by design: it is called after the
 * pass has already been granted, and a failed email must never surface as a
 * failed payment — so it never throws.
 */
export async function sendPassThanks(p: {
  userId: string;
  proUntil: Date;
  extended: boolean;
  provider: string;
}): Promise<void> {
  try {
    const user = await prisma.user.findUnique({ where: { id: p.userId }, select: { email: true, name: true } });
    if (!user?.email) return;
    const { subject, html } = renderPassThanks({ name: user.name, proUntil: p.proUntil, extended: p.extended, provider: p.provider });
    await sendEmail({ to: user.email, subject, html, replyTo: replyTo() });
  } catch (e) {
    console.error("[pass-emails] thank-you failed (pass already granted)", e);
  }
}

/**
 * Reminds everyone whose pass ends within the next 48 hours. Run once a day
 * (from /api/cron/expire-pro), each pass is first caught when it is 24–48 hours
 * from ending, so the email lands one to two days before.
 *
 * Each reminder is claimed by inserting a PassReminder row before sending; the
 * unique (userId, proUntil) key turns a second run on the same day into a
 * no-op. If the send fails the claim is released, so the next run retries.
 * Subscribers are skipped — their plan is managed by the subscription.
 */
export async function remindExpiringPasses(now = new Date()): Promise<{ due: number; sent: number; skipped: number; failed: number }> {
  const due = await prisma.user.findMany({
    where: {
      plan: "PRO",
      proUntil: { gt: now, lte: new Date(now.getTime() + 2 * DAY_MS) },
      subscription: { is: null },
    },
    select: { id: true, email: true, name: true, proUntil: true },
  });

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  for (const u of due) {
    if (!u.proUntil || !u.email) continue;
    try {
      await prisma.passReminder.create({ data: { userId: u.id, proUntil: u.proUntil } });
    } catch (e) {
      if ((e as { code?: string })?.code === "P2002") {
        skipped++; // already reminded about this expiry
        continue;
      }
      throw e; // e.g. the table isn't migrated yet — let the caller report it
    }
    const { subject, html } = renderPassReminder({ name: u.name, proUntil: u.proUntil, now });
    const { ok } = await sendEmail({ to: u.email, subject, html, replyTo: replyTo() });
    if (ok) {
      sent++;
    } else {
      failed++;
      await prisma.passReminder
        .delete({ where: { userId_proUntil: { userId: u.id, proUntil: u.proUntil } } })
        .catch(() => {});
    }
  }
  return { due: due.length, sent, skipped, failed };
}
