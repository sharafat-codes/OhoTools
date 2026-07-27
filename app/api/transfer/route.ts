import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/dal";
import { isTransferConfigured, createUploadUrl, removeObjects } from "@/lib/transfer-storage";
import { FREE_MAX_BYTES, maxExpiryHours } from "@/lib/transfer-shared";
import { isPro } from "@/lib/plans";

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
    password?: { hash?: unknown; salt?: unknown } | null;
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

  const user = await getCurrentUser().catch(() => null);
  const cap = maxExpiryHours(isPro((user as { plan?: string } | null)?.plan ?? "FREE"));
  const hours = Math.min(cap, Math.max(1, Math.floor(Number(body.expiresHours) || 24)));
  const expiresAt = new Date(Date.now() + hours * 3600 * 1000);

  // Optional password gate (client sends SHA-256(verifier) + salt; never the password).
  let passwordHash: string | null = null;
  let passwordSalt: string | null = null;
  const pw = body.password;
  if (pw && typeof pw.hash === "string" && typeof pw.salt === "string") {
    if (pw.hash.length > 200 || pw.salt.length > 200) {
      return NextResponse.json({ error: "Invalid password data." }, { status: 400 });
    }
    passwordHash = pw.hash;
    passwordSalt = pw.salt;
  }

  const storagePath = crypto.randomUUID();

  const row = await prisma.transfer.create({
    data: { storagePath, metaCipher, metaIv, contentIv, size, expiresAt, passwordHash, passwordSalt, userId: user?.id ?? null },
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
