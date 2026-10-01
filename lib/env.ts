import "server-only";

/**
 * Whether this process is serving the live public site.
 *
 * Two things key off this — the tool-view beacon in app/api/track/route.ts and
 * the GA4 + AdSense tags in app/layout.tsx — and both fail silently when they
 * get it wrong: no error, just numbers that quietly stop and ad tags that never
 * render.
 *
 * `APP_ENV` is the app's own flag, so the answer no longer depends on which
 * host we happen to be on. `VERCEL_ENV` is still honoured as a fallback so a
 * Vercel deployment keeps working without it being set; on any other host that
 * variable simply does not exist.
 *
 * Note it has to be set at BUILD time as well as runtime: the root layout is
 * part of every statically prerendered page, so its branch is baked in when
 * `next build` runs.
 */
export const isLiveSite =
  process.env.APP_ENV === "production" || process.env.VERCEL_ENV === "production";
