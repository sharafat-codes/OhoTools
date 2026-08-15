import "server-only";

import { SITE_URL } from "@/lib/site";

// IndexNow — instantly notify Bing, Yandex, Naver, Seznam of new/changed pages.
// The key is public; it's hosted at /<KEY>.txt to prove we own the domain.
export const INDEXNOW_KEY = "0a9d4c7e2f61483bb8e5d0a3c6f79b21";

const ENDPOINT = "https://api.indexnow.org/indexnow";

function keyLocation(): string {
  return `${SITE_URL}/${INDEXNOW_KEY}.txt`;
}

/**
 * Submit a SINGLE URL to IndexNow (GET). This is the recommended method — Bing
 * flags repeated bulk/batch submission of a site's whole URL list because it
 * makes crawlers re-hit every page at once. Notify per new/changed page instead.
 */
export async function submitUrlToIndexNow(url: string): Promise<boolean> {
  try {
    const u = new URL(ENDPOINT);
    u.searchParams.set("url", url);
    u.searchParams.set("key", INDEXNOW_KEY);
    u.searchParams.set("keyLocation", keyLocation());
    const res = await fetch(u, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

/** Submit several URLs one at a time (individual submission — avoids batch mode). */
export async function submitUrlsIndividually(urls: string[]): Promise<{ submitted: number; ok: number }> {
  let ok = 0;
  for (const url of urls) {
    if (await submitUrlToIndexNow(url)) ok++;
  }
  return { submitted: urls.length, ok };
}

/**
 * Batch submit (single POST with a urlList). Retained ONLY for a rare one-off
 * full sync (e.g. first-time setup). Do NOT run this on every deploy — Bing
 * recommends against repeated batch submission. Prefer submitUrlToIndexNow.
 */
export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  if (urls.length === 0) return true;
  try {
    const host = new URL(SITE_URL).host;
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: keyLocation(),
        urlList: urls.slice(0, 10000),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
