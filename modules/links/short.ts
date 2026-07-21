import { customAlphabet } from "nanoid";

// Unambiguous URL-safe alphabet (no look-alikes like 0/O, 1/l).
const nano = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 7);

export function newShortCode() {
  return nano();
}
