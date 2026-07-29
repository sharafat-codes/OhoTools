import "server-only";

import { SITE_URL } from "@/lib/site";

// IndexNow — instantly notify Bing, Yandex, Naver, Seznam of new/changed pages.
// The key is public; it's hosted at /<KEY>.txt to prove we own the domain.
export const INDEXNOW_KEY = "0a9d4c7e2f61483bb8e5d0a3c6f79b21";

/** Submit a batch of full URLs to IndexNow. Returns true on a 200/202 response. */
export async function submitToIndexNow(urls: string[]): Promise<boolean> {
  if (urls.length === 0) return true;
  try {
    const host = new URL(SITE_URL).host;
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.slice(0, 10000), // IndexNow accepts up to 10k per request
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
