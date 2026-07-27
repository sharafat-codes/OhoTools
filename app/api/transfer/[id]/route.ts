import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { isTransferConfigured, createDownloadUrl, removeObjects } from "@/lib/transfer-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Return a transfer's encrypted metadata + a signed URL to fetch the ciphertext.
// The client decrypts using the key from the link fragment.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTransferConfigured()) {
    return NextResponse.json({ error: "File sending isn't set up yet." }, { status: 503 });
  }

  const { id } = await params;
  const row = await prisma.transfer.findUnique({ where: { id } });
  if (!row) {
    return NextResponse.json({ error: "This link is invalid or has expired." }, { status: 404 });
  }

  if (row.expiresAt.getTime() < Date.now()) {
    // Expired — clean up opportunistically and refuse.
    await removeObjects([row.storagePath]);
    await prisma.transfer.delete({ where: { id } }).catch(() => {});
    return NextResponse.json({ error: "This link has expired." }, { status: 410 });
  }

  let downloadUrl: string;
  try {
    downloadUrl = await createDownloadUrl(row.storagePath, 3600);
  } catch {
    return NextResponse.json({ error: "Could not open this file. Try again." }, { status: 502 });
  }

  await prisma.transfer.update({ where: { id }, data: { downloads: { increment: 1 } } }).catch(() => {});

  return NextResponse.json({
    metaCipher: row.metaCipher,
    metaIv: row.metaIv,
    contentIv: row.contentIv,
    size: row.size,
    expiresAt: row.expiresAt,
    downloadUrl,
  });
}
