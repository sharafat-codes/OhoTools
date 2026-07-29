import { NextResponse, type NextRequest } from "next/server";

import { devTools, categoryPages } from "@/modules/tools/registry";
import { posts } from "@/modules/blog";
import { SITE_URL as siteUrl } from "@/lib/site";
import { submitToIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Submit every public URL to IndexNow. Guarded by CRON_SECRET so it can't be
// spammed. Trigger it after deploying new content (manually or via a Vercel
// "Deployment Succeeded" webhook pointing at ?secret=<CRON_SECRET>).
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  return NextResponse.json({ ok, submitted: urls.length });
}

export const GET = handle;
export const POST = handle;
