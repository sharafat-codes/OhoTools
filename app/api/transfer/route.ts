import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/dal";
import { isTransferConfigured, createUploadUrl, removeObjects } from "@/lib/transfer-storage";
import { FREE_MAX_BYTES, MAX_EXPIRY_HOURS } from "@/lib/transfer-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Create a transfer: store encrypted metadata, hand back a signed URL the
// browser uploads the ciphertext to directly. The decryption key never reaches
// us — it stays in the share link's URL fragment on the client.
export async function POST(req: Request) {
  if (!isTransferConfigured()) {
    return NextResponse.json({ error: "File sending isn't set up yet." }, { status: 503 });
  }

  let body: {
    metaCipher?: unknown;
    metaIv?: unknown;
    contentIv?: unknown;
    size?: unknown;
    expiresHours?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { metaCipher, metaIv, contentIv, size } = body;
  if (
    typeof metaCipher !== "string" ||
    typeof metaIv !== "string" ||
    typeof contentIv !== "string" ||
    typeof size !== "number"
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (size <= 0 || size > FREE_MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large. The current limit is ${Math.round(FREE_MAX_BYTES / 1024 / 1024)} MB.` },
      { status: 413 },
    );
  }
  if (metaCipher.length > 4000) {
    return NextResponse.json({ error: "Invalid metadata." }, { status: 400 });
  }

  const hours = Math.min(MAX_EXPIRY_HOURS, Math.max(1, Math.floor(Number(body.expiresHours) || MAX_EXPIRY_HOURS)));
  const expiresAt = new Date(Date.now() + hours * 3600 * 1000);

  const user = await getCurrentUser().catch(() => null);
  const storagePath = crypto.randomUUID();

  const row = await prisma.transfer.create({
    data: { storagePath, metaCipher, metaIv, contentIv, size, expiresAt, userId: user?.id ?? null },
  });

  try {
    const upload = await createUploadUrl(storagePath);
    return NextResponse.json({ id: row.id, path: storagePath, token: upload.token, expiresAt });
  } catch {
    await prisma.transfer.delete({ where: { id: row.id } }).catch(() => {});
    await removeObjects([storagePath]);
    return NextResponse.json({ error: "Could not start the upload. Try again." }, { status: 502 });
  }
}
