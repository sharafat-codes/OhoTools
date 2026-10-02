import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { isCardMediaConfigured, createMediaUploadUrl, mediaPublicUrl } from "@/lib/card-media";
import { isAllowedMedia, extFor, type MediaKind } from "@/lib/card-media-shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hands a Pro user a one-shot token to upload one photo or one audio file
 * straight to storage, and the public URL it will live at. The bytes never
 * pass through this function — the browser uploads directly — so the size
 * checked here is a declaration, and the browser-side resize is what keeps
 * photos small in practice.
 *
 * Pro-only on purpose: the invitation website is the paid tier, and public
 * storage must not be a free file host.
 */
export async function POST(req: Request) {
  if (!isCardMediaConfigured()) {
    return NextResponse.json({ error: "Photo uploads aren't set up yet." }, { status: 503 });
  }

  const user = await getCurrentUser().catch(() => null);
  if (!user) return NextResponse.json({ error: "Please sign in to upload." }, { status: 401 });
  if (!isPro((user as { plan?: string }).plan ?? "FREE")) {
    return NextResponse.json({ error: "Photo and music uploads are part of the premium website edition." }, { status: 403 });
  }

  let body: { kind?: unknown; contentType?: unknown; size?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const kind = body.kind === "audio" ? "audio" : body.kind === "image" ? "image" : null;
  const contentType = typeof body.contentType === "string" ? body.contentType : "";
  const size = typeof body.size === "number" ? body.size : NaN;
  if (!kind || !isAllowedMedia(kind as MediaKind, contentType, size)) {
    return NextResponse.json(
      { error: kind === "audio" ? "Use an MP3 or M4A under 10 MB." : "Use a JPG, PNG or WebP under 6 MB." },
      { status: 400 },
    );
  }

  // Month-prefixed so the bucket can be swept by age later without a database
  // join; the uuid keeps a guessed URL from ever landing on someone's photo.
  const ym = new Date().toISOString().slice(0, 7).replace("-", "");
  const path = `${kind}/${ym}/${crypto.randomUUID()}.${extFor(contentType)}`;

  try {
    const { token } = await createMediaUploadUrl(path);
    return NextResponse.json({ path, token, url: mediaPublicUrl(path) });
  } catch {
    return NextResponse.json({ error: "Could not start the upload. Please try again." }, { status: 502 });
  }
}
