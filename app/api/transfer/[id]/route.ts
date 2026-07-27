import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";
import { isTransferConfigured, createDownloadUrl, removeObjects } from "@/lib/transfer-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  storagePath: string;
  metaCipher: string;
  metaIv: string;
  contentIv: string;
  size: number;
  expiresAt: Date;
  passwordHash: string | null;
  passwordSalt: string | null;
};

async function loadValid(id: string): Promise<Row | { error: string; status: number }> {
  const row = await prisma.transfer.findUnique({ where: { id } });
  if (!row) return { error: "This link is invalid or has expired.", status: 404 };
  if (row.expiresAt.getTime() < Date.now()) {
    await removeObjects([row.storagePath]);
    await prisma.transfer.delete({ where: { id } }).catch(() => {});
    return { error: "This link has expired.", status: 410 };
  }
  return row as Row;
}

async function issueDownload(row: Row) {
  const downloadUrl = await createDownloadUrl(row.storagePath, 3600);
  await prisma.transfer.update({ where: { id: row.id }, data: { downloads: { increment: 1 } } }).catch(() => {});
  return downloadUrl;
}

function meta(row: Row) {
  return {
    metaCipher: row.metaCipher,
    metaIv: row.metaIv,
    contentIv: row.contentIv,
    size: row.size,
    expiresAt: row.expiresAt,
    protected: Boolean(row.passwordHash),
    passwordSalt: row.passwordHash ? row.passwordSalt : undefined,
  };
}

// Metadata (always) + a download URL only when the transfer isn't password-gated.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTransferConfigured()) {
    return NextResponse.json({ error: "File sending isn't set up yet." }, { status: 503 });
  }
  const { id } = await params;
  const row = await loadValid(id);
  if ("error" in row) return NextResponse.json({ error: row.error }, { status: row.status });

  if (row.passwordHash) {
    return NextResponse.json(meta(row)); // no downloadUrl until unlocked
  }
  try {
    const downloadUrl = await issueDownload(row);
    return NextResponse.json({ ...meta(row), downloadUrl });
  } catch {
    return NextResponse.json({ error: "Could not open this file. Try again." }, { status: 502 });
  }
}

// Unlock a password-protected transfer: verify the client-supplied verifier,
// then hand back the signed download URL.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isTransferConfigured()) {
    return NextResponse.json({ error: "File sending isn't set up yet." }, { status: 503 });
  }
  const { id } = await params;
  const row = await loadValid(id);
  if ("error" in row) return NextResponse.json({ error: row.error }, { status: row.status });

  if (row.passwordHash) {
    let verifier = "";
    try {
      const body = (await req.json()) as { verifier?: unknown };
      verifier = typeof body.verifier === "string" ? body.verifier : "";
    } catch {
      /* fall through to bad-password */
    }
    const provided = crypto.createHash("sha256").update(verifier, "utf8").digest("base64url");
    const a = Buffer.from(provided);
    const b = Buffer.from(row.passwordHash);
    const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
    if (!ok) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
  }

  try {
    const downloadUrl = await issueDownload(row);
    return NextResponse.json({ downloadUrl });
  } catch {
    return NextResponse.json({ error: "Could not open this file. Try again." }, { status: 502 });
  }
}
