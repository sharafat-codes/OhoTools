// Canonical production origin, used for metadata, sitemap, robots, and JSON-LD.
// Hardcoded to the known domain (with an optional env override) so canonical
// and Open Graph URLs can never accidentally resolve to localhost via
// BETTER_AUTH_URL. Trailing slash stripped for safe concatenation.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ohotool.com"
).replace(/\/+$/, "");

export const SITE_NAME = "OhoTool";
