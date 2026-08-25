import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Manual Pro grant / comp — guarded by CRON_SECRET. Use to comp a user or when a
// payment webhook misfires. Example:
//   /api/admin/grant-pro?secret=<CRON_SECRET>&email=user@example.com&days=30
// Pass days=0 (or negative) has no effect; omit for 30. Sets plan=PRO + proUntil.
async function handle(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = req.nextUrl.searchParams.get("email")?.trim();
  const days = Math.max(1, Number(req.nextUrl.searchParams.get("days") || 30));
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true },
  });
  if (!user) return NextResponse.json({ error: "user not found", email }, { status: 404 });

  const proUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await prisma.user.update({ where: { id: user.id }, data: { plan: "PRO", proUntil } });

  return NextResponse.json({ ok: true, email: user.email, plan: "PRO", proUntil });
}

export const GET = handle;
export const POST = handle;
