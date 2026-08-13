// URL-safe encode/decode of a card into the share link. Works on both the
// client (editor builds the link) and the server (public route decodes it),
// with no database — the link *is* the card.

import { normalizeCard, type CardData } from "./types";

function toBase64(json: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(json, "utf8").toString("base64");
  }
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function fromBase64(b64: string): string {
  if (typeof window === "undefined") {
    return Buffer.from(b64, "base64").toString("utf8");
  }
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const urlSafe = (b64: string) => b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const urlUnsafe = (s: string) => s.replace(/-/g, "+").replace(/_/g, "/");

export function encodeCard(data: CardData): string {
  return urlSafe(toBase64(JSON.stringify(data)));
}

export function decodeCard(encoded: string | undefined | null): CardData | null {
  if (!encoded) return null;
  try {
    const parsed = JSON.parse(fromBase64(urlUnsafe(encoded)));
    return normalizeCard(parsed);
  } catch {
    return null;
  }
}

/** Full public share URL for a card (used for copy/share). */
export function cardShareUrl(origin: string, data: CardData): string {
  return `${origin}/card/${data.occasion}?d=${encodeCard(data)}`;
}
