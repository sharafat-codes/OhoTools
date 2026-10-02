// Constants shared by the card-media server route and the browser uploader.
// Kept apart from lib/card-media.ts so client code can import these without
// pulling in the server-only Supabase admin client.

export const CARD_MEDIA_BUCKET = "card-media";

export type MediaKind = "image" | "audio";

// Images are downscaled in the browser before upload (see modules/cards/
// media-client.ts), so 6 MB is a ceiling for a pathological file, not a target.
export const IMAGE_MAX_BYTES = 6 * 1024 * 1024;
export const AUDIO_MAX_BYTES = 10 * 1024 * 1024;

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/aac"] as const;

export function isAllowedMedia(kind: MediaKind, contentType: string, size: number): boolean {
  if (!Number.isFinite(size) || size <= 0) return false;
  if (kind === "image") return (IMAGE_TYPES as readonly string[]).includes(contentType) && size <= IMAGE_MAX_BYTES;
  return (AUDIO_TYPES as readonly string[]).includes(contentType) && size <= AUDIO_MAX_BYTES;
}

/** File extension for a stored object, from its MIME type. */
export function extFor(contentType: string): string {
  switch (contentType) {
    case "image/jpeg": return "jpg";
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "audio/mpeg": return "mp3";
    case "audio/mp4":
    case "audio/x-m4a":
    case "audio/aac": return "m4a";
    default: return "bin";
  }
}
