import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "301-vs-302-redirect",
  title: "301 vs 302 Redirect: What's the Difference?",
  description:
    "301 vs 302 redirects explained simply: permanent vs temporary, the SEO impact of each, when to use 307/308, and how to check which one a URL returns.",
  keywords: [
    "301 vs 302",
    "301 redirect",
    "302 redirect",
    "permanent vs temporary redirect",
    "301 vs 302 seo",
    "http redirect",
  ],
  date: "2026-08-21",
  readingMinutes: 4,
  tags: ["Developer"],
  related: ["http-status-codes", "what-is-my-ip", "json-formatter"],
};

export function Body() {
  return (
    <>
      <p>
        A redirect sends a visitor (and search engines) from one URL to another. The two you&apos;ll meet most —
        <strong> 301</strong> and <strong>302</strong> — look identical to a user but mean very different things to
        browsers and Google. Getting them wrong can quietly cost you SEO rankings.
      </p>

      <h2>The quick answer</h2>
      <ul>
        <li><strong>301 = permanent.</strong> &quot;This page has moved for good — use the new URL from now on.&quot;</li>
        <li><strong>302 = temporary.</strong> &quot;This page is somewhere else for now — keep using the original URL.&quot;</li>
      </ul>

      <h2>Why the difference matters for SEO</h2>
      <p>
        This is the part that trips people up. A <strong>301</strong> tells Google to transfer the old page&apos;s
        ranking signals (&quot;link equity&quot;) to the new URL and index the new one. A <strong>302</strong>
        tells Google to <em>keep</em> the original URL indexed, because the move is temporary — so it generally
        does <strong>not</strong> pass ranking power the same way.
      </p>
      <p>
        The classic mistake: permanently moving a page but using a 302. Google keeps the old URL, the new one
        struggles to rank, and your traffic dips. If a move is permanent, use a 301.
      </p>

      <h2>When to use each</h2>
      <ul>
        <li><strong>Use 301</strong> when: you&apos;ve renamed a URL, moved to HTTPS, merged pages, or changed domains.</li>
        <li><strong>Use 302</strong> when: A/B testing, a short promo page, geo/language redirects, or temporary maintenance.</li>
      </ul>

      <h2>What about 307 and 308?</h2>
      <p>
        These are the stricter, modern versions:
      </p>
      <ul>
        <li><strong>308</strong> = permanent (like 301) but the HTTP method must not change on redirect.</li>
        <li><strong>307</strong> = temporary (like 302) but the method must not change.</li>
      </ul>
      <p>
        For everyday page moves, 301 and 302 are what you&apos;ll use. 307/308 matter mostly for non-GET requests
        (like POST) where preserving the method is important.
      </p>

      <h2>How to check which redirect a URL returns</h2>
      <p>
        Open your browser&apos;s DevTools → Network tab, load the URL, and look at the <strong>Status</strong>
        column for the first request (301, 302, 307, or 308). Not sure what a code means? Look it up in the{" "}
        <Link href="/tools/http-status-codes">HTTP status codes reference</Link> — it explains every response code
        in plain English.
      </p>

      <h2>FAQ</h2>
      <h3>Is a 301 better than a 302 for SEO?</h3>
      <p>
        For a permanent move, yes — a 301 passes ranking signals to the new URL. Use a 302 only when the change is
        genuinely temporary.
      </p>
      <h3>Do 301 redirects lose any ranking?</h3>
      <p>
        Modern Google passes nearly all ranking signals through a 301, so any loss is minimal. Chaining many
        redirects together is what to avoid — keep it to a single hop.
      </p>
      <h3>Can I change a 302 to a 301 later?</h3>
      <p>Yes. If a &quot;temporary&quot; move becomes permanent, switch it to a 301 so Google updates the indexed URL.</p>
      <h3>How do I see a page&apos;s status code?</h3>
      <p>
        Use your browser&apos;s Network tab, or check the meaning of any code in the{" "}
        <Link href="/tools/http-status-codes">HTTP status codes list</Link>.
      </p>
    </>
  );
}
