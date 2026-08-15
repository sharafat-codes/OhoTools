import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendEmail, renderActionEmail } from "@/lib/email";
import { normalizeCard, OCCASIONS } from "@/modules/cards/types";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Client-fired open counter. Only real browsers run the beacon, so link-preview
// crawlers (WhatsApp/Facebook/etc.) never inflate the count. Increments views,
// stamps lastOpenedAt, and emails watchers on the first open (once).
export async function POST(req: NextRequest) {
  let code: unknown;
  try {
    code = (await req.json())?.code;
  } catch {
    code = undefined;
  }
  if (!code || typeof code !== "string") return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const card = await prisma.card.update({
      where: { shortCode: code },
      data: { views: { increment: 1 }, lastOpenedAt: new Date() },
      select: { id: true, occasion: true, data: true },
    });

    const watchers = await prisma.cardWatch.findMany({
      where: { cardId: card.id, notified: false },
      select: { id: true, email: true },
    });

    if (watchers.length) {
      let to = "";
      try {
        to = normalizeCard(JSON.parse(card.data)).to;
      } catch {
        to = "";
      }
      const occ = OCCASIONS[card.occasion as keyof typeof OCCASIONS];
      const label = (occ ? occ.label : "card").toLowerCase();
      const html = renderActionEmail({
        heading: "🎉 Your card was just opened!",
        body: `Good news — your ${label} card${to ? ` for ${to}` : ""} was just opened. Want to make another?`,
        buttonLabel: "Create another card",
        buttonUrl: `${SITE_URL}/tools/cards`,
        footnote: "You're getting this because you asked to be notified when this card was opened.",
      });
      for (const w of watchers) {
        await sendEmail({ to: w.email, subject: "🎉 Your card was just opened!", html }).catch(() => {});
        await prisma.cardWatch.update({ where: { id: w.id }, data: { notified: true } }).catch(() => {});
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Unknown code (or DB error) — nothing to count.
    return NextResponse.json({ ok: false }, { status: 404 });
  }
}
