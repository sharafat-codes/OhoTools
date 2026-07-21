import "server-only";

import { createHash } from "node:crypto";
import { customAlphabet } from "nanoid";

const rand = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  32,
);

export function hashApiKey(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export function generateApiKey() {
  const raw = `oho_${rand()}`;
  return {
    raw,
    hashedKey: hashApiKey(raw),
    prefix: raw.slice(0, 12), // "oho_" + 8 chars, shown in the UI
    last4: raw.slice(-4),
  };
}
