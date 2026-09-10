import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "what-is-robots-txt",
  title: "What Is robots.txt? (With Examples)",
  description:
    "What a robots.txt file does, the syntax with examples, common mistakes, and a free generator to create a valid one for your site.",
  keywords: [
    "what is robots.txt",
    "robots.txt",
    "robots.txt example",
    "robots.txt generator",
    "disallow robots.txt",
    "robots.txt sitemap",
  ],
  date: "2026-09-10",
  readingMinutes: 4,
  tags: ["Web & SEO"],
  related: ["robots-txt-generator", "meta-tag-generator", "favicon-generator"],
};

export function Body() {
  return (
    <>
      <p>
        A <code>robots.txt</code> file lives at the root of your site (<code>yoursite.com/robots.txt</code>)
        and tells search-engine crawlers which parts of your site they may or may not request. It guides
        crawling — but it&apos;s not a security tool.
      </p>

      <h2>Create one in seconds</h2>
      <p>
        Use the <Link href="/tools/robots-txt-generator">robots.txt Generator</Link> to build a valid file
        with allow/disallow rules and your sitemap, then paste it into your site&apos;s root.
      </p>

      <h2>The basic syntax</h2>
      <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-xs"><code>{`User-agent: *
Disallow: /admin/
Disallow: /cart/

Sitemap: https://example.com/sitemap.xml`}</code></pre>
      <ul>
        <li><strong>User-agent</strong> — which crawler the rules apply to. <code>*</code> means all of them.</li>
        <li><strong>Disallow</strong> — a path crawlers should not request. An empty <code>Disallow:</code> allows everything.</li>
        <li><strong>Sitemap</strong> — the full URL of your sitemap, so crawlers can find all your pages.</li>
      </ul>

      <h2>Common examples</h2>
      <ul>
        <li><strong>Allow everything:</strong> <code>User-agent: *</code> then <code>Disallow:</code> (empty).</li>
        <li><strong>Block the whole site:</strong> <code>User-agent: *</code> then <code>Disallow: /</code>.</li>
        <li><strong>Block one folder:</strong> <code>Disallow: /private/</code>.</li>
      </ul>

      <h2>The mistake everyone makes</h2>
      <p>
        <strong>Disallow does not hide a page from Google.</strong> It only asks crawlers not to fetch it — a
        blocked URL can still appear in results if other sites link to it. To keep a page out of search, use a{" "}
        <code>noindex</code> meta tag or HTTP header instead (and don&apos;t also block it in robots.txt, or
        Google can&apos;t see the noindex). Also never rely on robots.txt to hide sensitive pages — the file
        is public, so it can actually reveal the paths you&apos;re trying to hide.
      </p>

      <h2>FAQ</h2>
      <h3>Where does robots.txt go?</h3>
      <p>In your domain root, reachable at <code>https://yoursite.com/robots.txt</code>. It won&apos;t work in a subfolder.</p>
      <h3>Do I need a robots.txt file?</h3>
      <p>It&apos;s optional, but recommended — at minimum to point crawlers to your sitemap and keep them out of admin or duplicate pages.</p>
      <h3>Should I add my sitemap?</h3>
      <p>Yes — the Sitemap line helps search engines discover all your pages, which helps indexing.</p>
    </>
  );
}
