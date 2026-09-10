import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-a-meta-description",
  title: "How to Write a Meta Description (With Examples)",
  description:
    "What a meta description is, the ideal length, how to write one that earns clicks, and common mistakes — plus a free AI meta description generator.",
  keywords: [
    "how to write a meta description",
    "meta description length",
    "meta description examples",
    "meta description generator",
    "seo meta description",
    "what is a meta description",
  ],
  date: "2026-09-10",
  readingMinutes: 3,
  tags: ["Web & SEO", "AI"],
  related: ["meta-description-generator", "meta-tag-generator", "headline-generator"],
};

export function Body() {
  return (
    <>
      <p>
        A meta description is the snippet of text shown under your page title in search results. It
        doesn&apos;t directly change your ranking — but a good one improves click-through rate, which does
        matter. Here&apos;s how to write one that earns the click.
      </p>

      <h2>Generate one instantly</h2>
      <p>
        Describe your page in the <Link href="/tools/meta-description-generator">AI Meta Description Generator</Link>{" "}
        and get several options, each under 155 characters and keyword-aware.
      </p>

      <h2>The rules</h2>
      <ul>
        <li><strong>Length</strong> — keep it under about 155 characters so it isn&apos;t truncated.</li>
        <li><strong>Include the keyword</strong> — Google bolds matching terms, which draws the eye.</li>
        <li><strong>Lead with value</strong> — say what the reader gets, not what the page &ldquo;is about.&rdquo;</li>
        <li><strong>Add a call to action</strong> — &ldquo;Learn how,&rdquo; &ldquo;Compare options,&rdquo; &ldquo;Try it free.&rdquo;</li>
        <li><strong>Unique per page</strong> — never reuse the same description across pages.</li>
      </ul>

      <h2>Where it goes</h2>
      <p>In your page&apos;s <code>{`<head>`}</code>:</p>
      <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-xs"><code>{`<meta name="description" content="Your compelling description here." />`}</code></pre>

      <h2>Mistakes to avoid</h2>
      <ul>
        <li><strong>Too long</strong> — it gets cut off mid-sentence.</li>
        <li><strong>Keyword stuffing</strong> — write for humans; one natural mention is enough.</li>
        <li><strong>Duplicates</strong> — Google may ignore a description reused site-wide and write its own.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Does a meta description affect SEO rankings?</h3>
      <p>Not directly — but it affects click-through rate from search, which indirectly helps.</p>
      <h3>What if I don&apos;t write one?</h3>
      <p>Google will generate a snippet from your page. Writing your own gives you control over the pitch.</p>
    </>
  );
}
