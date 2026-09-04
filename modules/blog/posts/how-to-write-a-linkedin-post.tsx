import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-a-linkedin-post",
  title: "How to Write a LinkedIn Post That Gets Engagement",
  description:
    "What makes a LinkedIn post perform — the hook, formatting, and call to action — with examples and a free AI generator to draft posts that get seen.",
  keywords: [
    "how to write a linkedin post",
    "linkedin post tips",
    "linkedin engagement",
    "linkedin post generator",
    "linkedin post ideas",
    "linkedin hook",
  ],
  date: "2026-09-04",
  readingMinutes: 4,
  tags: ["Social Media", "Career"],
  related: ["linkedin-post-generator", "caption-generator", "bio-generator", "hashtag-generator"],
};

export function Body() {
  return (
    <>
      <p>
        On LinkedIn, the first line decides everything — it&apos;s all most people see before &ldquo;…see
        more.&rdquo; Nail the hook, keep it scannable, and end with a reason to comment. Here&apos;s how.
      </p>

      <h2>Draft it in seconds</h2>
      <p>
        Describe your idea, story, or announcement in the{" "}
        <Link href="/tools/linkedin-post-generator">AI LinkedIn Post Generator</Link> and get a ready-to-edit
        post with a hook, short paragraphs, and hashtags — then tweak it so it sounds like you.
      </p>

      <h2>Start with a scroll-stopping hook</h2>
      <ul>
        <li>Lead with a bold statement, a surprising result, or a relatable problem.</li>
        <li>Keep the first line short — no context yet, just the hook.</li>
        <li>Avoid burying the point below the fold.</li>
      </ul>

      <h2>Format for the feed</h2>
      <ul>
        <li><strong>One idea per line</strong> — lots of white space; no dense paragraphs.</li>
        <li><strong>Tell a story</strong> — a small personal moment beats a generic lesson.</li>
        <li><strong>Keep it to ~150–250 words</strong> — enough to say something, short enough to finish.</li>
      </ul>

      <h2>End with engagement</h2>
      <p>
        Close with a question or a clear call to action so people comment — early comments are what push a
        post into more feeds. Add 3–5 relevant hashtags (the generator suggests them, or use the{" "}
        <Link href="/tools/hashtag-generator">Hashtag Generator</Link>).
      </p>

      <h2>A few do&apos;s and don&apos;ts</h2>
      <ul>
        <li><strong>Do</strong> post consistently — reach compounds with frequency.</li>
        <li><strong>Do</strong> reply to every comment in the first hour.</li>
        <li><strong>Don&apos;t</strong> put important links in the post body (they can cut reach) — add them in the first comment.</li>
        <li><strong>Don&apos;t</strong> over-hashtag — 3–5 focused tags beat a wall of them.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>How long should a LinkedIn post be?</h3>
      <p>Around 150–250 words works well — a strong hook, a short story or insight, and a call to action.</p>
      <h3>How many hashtags should I use?</h3>
      <p>Three to five relevant ones. More looks spammy and doesn&apos;t help.</p>
      <h3>Is the LinkedIn post generator free?</h3>
      <p>You get a set number of free AI runs each day; go Pro for unlimited use.</p>
    </>
  );
}
