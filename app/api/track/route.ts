import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight, anonymous tool-view counter for the admin analytics dashboard.
// No personal data — just a per-tool daily tally. Fails silently.
export async function POST(req: Request) {
  // Only the live site counts. A dev server and a preview deployment share this
  // database, and the `oho_no_track` cookie below is scoped to one origin and
  // one browser profile — it is never present on localhost, in an incognito
  // window, or on a phone. Without this, building the site inflates the numbers
  // you then use to decide what to build.
  if (process.env.VERCEL_ENV !== "production") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Don't count the owner's own visits — the admin area sets an `oho_no_track`
  // cookie (see modules/admin/components/no-track.tsx), which rides along on
  // this same-origin beacon.
  if ((req.headers.get("cookie") || "").includes("oho_no_track=1")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let slug = "";
  try {
    const body = (await req.json()) as { slug?: unknown };
    slug = typeof body.slug === "string" ? body.slug.slice(0, 80) : "";
  } catch {
    return NextResponse.json({ ok: true });
  }
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ ok: true });

  const day = new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
  try {
    await prisma.toolView.upsert({
      where: { slug_day: { slug, day } },
      create: { slug, day, count: 1 },
      update: { count: { increment: 1 } },
    });
  } catch {
    /* tool_view table not migrated yet — ignore */
  }
  return NextResponse.json({ ok: true });
}
