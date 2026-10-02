"use client";

import { createClient } from "@supabase/supabase-js";

import { CARD_MEDIA_BUCKET, IMAGE_MAX_BYTES, AUDIO_MAX_BYTES, type MediaKind } from "@/lib/card-media-shared";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Shrinks a photo to something a phone can download in a second. The gallery
 * is viewed on WhatsApp-opened links on mobile data; a 12 MP original would be
 * 4–6 MB each, and twelve of them is a page nobody waits for. 1600px on the
 * long edge at JPEG 0.82 lands around 250–400 KB and still looks sharp.
 */
export async function resizeImage(file: File, maxEdge = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Couldn't read that image. Try a JPG or PNG.");
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't process that image.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
  if (!blob) throw new Error("Couldn't process that image.");
  return blob;
}

/**
 * Uploads a photo or audio file for an invitation website and returns its
 * public URL. Throws an Error whose message is safe to show the user.
 */
export async function uploadCardMedia(file: File, kind: MediaKind): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Uploads aren't available right now.");

  let blob: Blob = file;
  let contentType = file.type;
  if (kind === "image") {
    blob = await resizeImage(file);
    contentType = "image/jpeg";
  } else if (!contentType) {
    // Some Android pickers hand over audio with an empty type; infer from the name.
    contentType = /\.(m4a|aac|mp4)$/i.test(file.name) ? "audio/mp4" : "audio/mpeg";
  }
  if (blob.size > (kind === "image" ? IMAGE_MAX_BYTES : AUDIO_MAX_BYTES)) {
    throw new Error(kind === "image" ? "That photo is too large even after resizing." : "Music files must be under 10 MB.");
  }

  const res = await fetch("/api/card/media", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, contentType, size: blob.size }),
  });
  const j = (await res.json().catch(() => ({}))) as { path?: string; token?: string; url?: string; error?: string };
  if (!res.ok || !j.path || !j.token || !j.url) throw new Error(j.error || "Couldn't start the upload.");

  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error } = await sb.storage.from(CARD_MEDIA_BUCKET).uploadToSignedUrl(j.path, j.token, blob, { contentType });
  if (error) throw new Error("Upload failed. Please try again.");
  return j.url;
}
