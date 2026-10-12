import { NextResponse, type NextRequest } from "next/server";

import { expireProPasses } from "@/lib/safepay";
import { remindExpiringPasses } from "@/lib/pass-emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Downgrades expired one-time Pro passes to Free. Point a daily Vercel Cron at
// this (or call manually) with ?secret=<CRON_SECRET>. Subscription users are
// untouched — their plan is managed by the subscription webhooks.
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const downgraded = await expireProPasses();

  // Reminders ride on the same daily run rather than a cron entry of their own.
  // Run after the downgrade, and isolated from it: a reminder problem (an email
  // outage, or the pass_reminder table not migrated yet) must never stop
  // expired passes being downgraded.
  let reminders: Awaited<ReturnType<typeof remindExpiringPasses>> | { error: string };
  try {
    reminders = await remindExpiringPasses();
  } catch (e) {
    console.error("[cron/expire-pro] pass reminders failed", e);
    reminders = { error: "reminders failed — see server logs" };
  }

  return NextResponse.json({ ok: true, downgraded, reminders });
}

export const GET = handle;
export const POST = handle;
