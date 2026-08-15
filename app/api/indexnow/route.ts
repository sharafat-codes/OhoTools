import { NextResponse, type NextRequest } from "next/server";

import { devTools, categoryPages } from "@/modules/tools/registry";
import { posts } from "@/modules/blog";
import { SITE_URL as siteUrl } from "@/lib/site";
import { submitToIndexNow, submitUrlsIndividually } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Notify IndexNow (Bing/Yandex/…) of new or changed pages. Guarded by CRON_SECRET.
//
// Recommended (targeted, individual submission — what Bing wants):
//   /api/indexnow?secret=<CRON_SECRET>&urls=/tools/eid-card-maker,/blog/foo
//   -> submits ONLY those URLs, one at a time.
//
// Rare one-off full sync (e.g. first-time setup) — do NOT run per deploy:
//   /api/indexnow?secret=<CRON_SECRET>&all=1
//
// Submitting the entire URL list repeatedly is the "batch mode" Bing flags for
// excessive crawl load, so it is now opt-in and no longer the default.
function absolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const urlsParam = req.nextUrl.searchParams.get("urls");
  if (urlsParam) {
    const urls = urlsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(absolute);
    const result = await submitUrlsIndividually(urls);
    return NextResponse.json({ mode: "individual", ...result });
  }

  if (req.nextUrl.searchParams.get("all") === "1") {
    const urls = [
      `${siteUrl}/`,
      `${siteUrl}/tools`,
      `${siteUrl}/send`,
      `${siteUrl}/pricing`,
      `${siteUrl}/blog`,
      ...categoryPages.map((c) => `${siteUrl}/tools/${c.slug}`),
      ...devTools.map((t) => `${siteUrl}/tools/${t.slug}`),
      ...posts.map((p) => `${siteUrl}/blog/${p.slug}`),
    ];
    const ok = await submitToIndexNow(urls);
    return NextResponse.json({ mode: "batch-full", ok, submitted: urls.length });
  }

  return NextResponse.json(
    {
      error:
        "Provide ?urls=/path1,/path2 to submit specific pages (recommended), or ?all=1 for a rare one-off full sync.",
    },
    { status: 400 },
  );
}

export const GET = handle;
export const POST = handle;
