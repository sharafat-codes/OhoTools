import { NextResponse, type NextRequest } from "next/server";

import { expireProPasses } from "@/lib/safepay";

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
  return NextResponse.json({ ok: true, downgraded });
}

export const GET = handle;
export const POST = handle;
