import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-choose-hashtags",
  title: "How to Choose Hashtags That Actually Get Reach",
  description:
    "Big hashtags bury you; the right mix gets you seen. Here's how to pick hashtags by size and relevance, how many to use per platform, and a free generator to build your set.",
  keywords: [
    "how to choose hashtags",
    "best hashtags",
    "hashtag generator",
    "instagram hashtags",
    "hashtag strategy",
    "how many hashtags to use",
  ],
  date: "2026-09-04",
  readingMinutes: 4,
  tags: ["Social Media", "AI"],
  related: ["hashtag-generator", "caption-generator", "bio-generator", "headline-generator"],
};

export function Body() {
  return (
    <>
      <p>
        Hashtags help the right people find your post — but only if you pick them well. Stuffing in the
        biggest tags actually hurts: your post drowns under millions of others in minutes. Here&apos;s how to
        build a set that gets reach, plus a free tool to generate ideas.
      </p>

      <h2>Mix hashtags by size</h2>
      <p>
        The trick is a spread, not all giants. Think of three buckets and pull a few from each:
      </p>
      <ul>
        <li><strong>Large (500k+ posts)</strong> — broad reach, but you rank for seconds. Use a few.</li>
        <li><strong>Medium (50k–500k)</strong> — the sweet spot; enough audience, less competition. Use most of your set here.</li>
        <li><strong>Small / niche (under 50k)</strong> — highly relevant, easier to rank and stay visible. Include several.</li>
      </ul>
      <p>
        Describe your post in the <Link href="/tools/hashtag-generator">Hashtag Generator</Link> to get a
        batch of relevant tags fast, then sort them into these buckets.
      </p>

      <h2>Relevance beats popularity</h2>
      <p>
        A hashtag is a search. If your tag doesn&apos;t match your content, the people who find you won&apos;t
        care — and the algorithm learns your post is a poor match. Always choose tags that genuinely describe
        the post, the audience, or the niche.
      </p>

      <h2>How many should you use?</h2>
      <ul>
        <li><strong>Instagram:</strong> 5–15 well-chosen tags outperform the old &ldquo;max them out&rdquo; advice.</li>
        <li><strong>TikTok:</strong> 3–5 relevant tags plus one or two broad ones.</li>
        <li><strong>X / Threads:</strong> 1–2 — more looks spammy.</li>
        <li><strong>LinkedIn:</strong> 3–5 professional, topic-specific tags.</li>
      </ul>

      <h2>Build a few reusable sets</h2>
      <p>
        Save two or three ready-made groups for your recurring content themes so you&apos;re not starting from
        scratch every post. Refresh them every month or two — hashtag sizes shift, and reusing the exact same
        block forever can look automated.
      </p>

      <h2>Pair them with a strong caption</h2>
      <p>
        Hashtags get you discovered; the caption gets the save and the follow. Draft one with the{" "}
        <Link href="/tools/caption-generator">Caption Generator</Link>, tidy your{" "}
        <Link href="/tools/bio-generator">bio</Link>, and browse the rest of the{" "}
        <Link href="/tools/ai">AI tools</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Do more hashtags mean more reach?</h3>
      <p>No. Beyond a point they look spammy and dilute relevance. A tight, well-sized set beats a wall of tags.</p>
      <h3>Should I put hashtags in the caption or first comment?</h3>
      <p>Either works on Instagram now. Pick one and stay consistent; keep the caption itself readable.</p>
      <h3>Is the hashtag generator free?</h3>
      <p>You get a set number of free AI runs each day; go Pro for unlimited use.</p>
    </>
  );
}
