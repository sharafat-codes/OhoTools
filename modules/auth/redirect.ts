/**
 * Sanitises a `?redirect=` value before it reaches router.push().
 *
 * Only same-origin paths are allowed: anything absolute ("https://evil.test"),
 * protocol-relative ("//evil.test") or non-path is discarded in favour of the
 * fallback, so a crafted login link cannot bounce a freshly authenticated user
 * off-site.
 */
export function safeRedirect(value: string | undefined | null, fallback = "/dashboard"): string {
  if (!value) return fallback;
  const v = value.trim();
  if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\")) return fallback;
  return v;
}
