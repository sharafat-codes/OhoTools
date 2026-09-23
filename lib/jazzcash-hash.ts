import crypto from "node:crypto";

// Pure signing helpers for JazzCash, deliberately free of any other import so
// they can be unit-tested on their own. Everything stateful lives in
// lib/jazzcash.ts.

/**
 * Builds the string that gets signed, exactly as specified in JazzCash's
 * Payment Gateway Integration Guide for Merchants v4.2, section 14.2:
 *
 *   1. Include every field whose name begins with "pp".
 *   2. Concatenate the VALUES in ascending ASCII order of the FIELD NAME,
 *      separated by "&".
 *   3. Prepend the shared secret (integrity salt), also followed by "&".
 *
 * The guide's worked example — merchant MER123, order A48cvE28, amount 2995 —
 * yields "<salt>&2995&MER123&A48cvE28".
 *
 * Empty values are skipped. The guide is silent on this and every working
 * reference implementation omits them; including them would emit "&&" runs.
 * Worth re-confirming against a real sandbox transaction.
 */
export function buildHashMessage(fields: Record<string, string>, salt: string): string {
  const names = Object.keys(fields)
    .filter((k) => k.toLowerCase().startsWith("pp"))
    .filter((k) => k !== "pp_SecureHash")
    .filter((k) => fields[k] !== undefined && fields[k] !== null && String(fields[k]) !== "")
    // Plain ordinal comparison: localeCompare applies locale rules and would
    // order these differently.
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  return [salt, ...names.map((n) => String(fields[n]))].join("&");
}

/**
 * HMAC-SHA256 of the message above, keyed with the same shared secret, hex
 * encoded and uppercased.
 *
 * The guide also describes a UTF-8 → ISO-8859-1 conversion before hashing. That
 * round-trip leaves the byte sequence unchanged, so hashing the UTF-8 bytes
 * directly is equivalent — and these fields are ASCII in practice.
 */
export function jazzCashSecureHash(fields: Record<string, string>, salt: string): string {
  const message = buildHashMessage(fields, salt);
  return crypto
    .createHmac("sha256", Buffer.from(salt, "utf8"))
    .update(Buffer.from(message, "utf8"))
    .digest("hex")
    .toUpperCase();
}
