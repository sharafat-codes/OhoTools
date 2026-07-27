import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { isTransferConfigured, removeObjects } from "@/lib/transfer-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Purge expired transfers (rows + storage objects). Called hourly by Vercel Cron
// (see vercel.json). Protected by CRON_SECRET when set.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isTransferConfigured()) {
    return NextResponse.json({ purged: 0, note: "storage not configured" });
  }

  const expired = await prisma.transfer.findMany({
    where: { expiresAt: { lt: new Date() } },
    select: { id: true, storagePath: true },
    take: 1000,
  });

  if (expired.length > 0) {
    await removeObjects(expired.map((e) => e.storagePath));
    await prisma.transfer.deleteMany({ where: { id: { in: expired.map((e) => e.id) } } });
  }

  return NextResponse.json({ purged: expired.length });
}
