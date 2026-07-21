import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { parseDevice, parseReferrer } from "@/modules/links/scan";

export const dynamic = "force-dynamic";

function message(title: string, body: string, status: number) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="font-family:system-ui;display:grid;place-items:center;min-height:100vh;margin:0;color:#111"><div style="text-align:center;padding:24px"><h1 style="font-size:18px;margin:0 0 6px">${title}</h1><p style="color:#666;margin:0">${body}</p></div></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  const link = await prisma.dynamicLink.findUnique({
    where: { shortCode: code },
  });

  if (!link) {
    return message("Link not found", "This short link doesn't exist.", 404);
  }
  if (!link.active) {
    return message("Link inactive", "This link has been turned off.", 410);
  }
  if (link.expiresAt && link.expiresAt.getTime() < Date.now()) {
    return message("Link expired", "This link is no longer available.", 410);
  }

  // Log the scan and bump the counter (best-effort; never block the redirect).
  try {
    await prisma.$transaction([
      prisma.scanLog.create({
        data: {
          linkId: link.id,
          device: parseDevice(req.headers.get("user-agent")),
          referrer: parseReferrer(req.headers.get("referer")),
          country: req.headers.get("x-vercel-ip-country") || null,
          userAgent: req.headers.get("user-agent")?.slice(0, 512) || null,
        },
      }),
      prisma.dynamicLink.update({
        where: { id: link.id },
        data: { scanCount: { increment: 1 } },
      }),
    ]);
  } catch {
    // Swallow logging errors — the redirect is what matters.
  }

  return Response.redirect(link.targetUrl, 302);
}
