// Canonical production origin, used for metadata, sitemap, robots, and JSON-LD.
// Hardcoded to the known domain (with an optional env override) so canonical
// and Open Graph URLs can never accidentally resolve to localhost via
// BETTER_AUTH_URL. Trailing slash stripped for safe concatenation.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ohotool.com"
).replace(/\/+$/, "");

export const SITE_NAME = "OhoTool";

/**
 * Central brand config — the single place to change site-wide values used
 * across metadata, JSON-LD, the logo, and Open Graph images. (The live tool
 * count lives with the tools — see TOOL_COUNT_LABEL in the tools registry —
 * because importing the registry here would be a circular dependency.)
 */
export const siteConfig = {
  name: SITE_NAME,
  url: SITE_URL,
  tagline: "Every online tool you need, in one place.",
  founder: "Sharafat Ali",
  social: {
    linkedin: "https://www.linkedin.com/in/sharafat-ali-04586028a/",
    facebook: "https://www.facebook.com/codes.ali",
  },
  /** Brand gradient — the logo, favicon, and OG images all read from here. */
  brand: {
    gradientFrom: "#6D28D9",
    gradientTo: "#A855F7",
  },
} as const;

