import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-a-short-story",
  title: "How to Write a Short Story (Simple Structure)",
  description:
    "A beginner-friendly structure for writing a short story — character, conflict, and resolution — with tips to beat the blank page and a free AI story generator for ideas.",
  keywords: [
    "how to write a short story",
    "short story structure",
    "story writing tips",
    "story generator",
    "writing prompts",
    "how to start a story",
  ],
  date: "2026-09-04",
  readingMinutes: 4,
  tags: ["Writing", "AI"],
  related: ["story-generator", "ai-paraphraser", "headline-generator", "caption-generator"],
};

export function Body() {
  return (
    <>
      <p>
        A short story does one thing well: it takes a single character through a single change. You don&apos;t
        need a huge plot — you need a person who wants something and an obstacle in the way. Here&apos;s a
        simple structure to get you writing.
      </p>

      <h2>Beat the blank page</h2>
      <p>
        Stuck for an idea? Give a premise, character, or vibe to the{" "}
        <Link href="/tools/story-generator">AI Story Generator</Link>, pick a genre and length, and get a
        full draft to react to — keep what works and rewrite the rest.
      </p>

      <h2>The five beats</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li><strong>Character &amp; want</strong> — introduce someone with a clear desire.</li>
        <li><strong>Inciting moment</strong> — something disrupts their normal.</li>
        <li><strong>Rising conflict</strong> — attempts to get what they want, each harder.</li>
        <li><strong>Turning point</strong> — a choice or revelation changes everything.</li>
        <li><strong>Resolution</strong> — the new normal; show how they&apos;ve changed.</li>
      </ol>

      <h2>Tips that make it work</h2>
      <ul>
        <li><strong>Start late, end early</strong> — open close to the action, stop once the change lands.</li>
        <li><strong>Show, don&apos;t tell</strong> — reveal emotion through action and detail.</li>
        <li><strong>One point of view</strong> — short stories rarely need more than one.</li>
        <li><strong>Give it a strong last line</strong> — it&apos;s what the reader remembers.</li>
      </ul>

      <h2>Polish the draft</h2>
      <p>
        Read it aloud, cut anything that doesn&apos;t serve the change, and tighten wording — the{" "}
        <Link href="/tools/ai-paraphraser">Paraphraser</Link> can help smooth clunky lines. Need a title? Try
        the <Link href="/tools/headline-generator">Headline Generator</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>How long is a short story?</h3>
      <p>Usually 1,000–7,500 words. Flash fiction is under 1,000; either way, focus on a single change.</p>
      <h3>Can AI write a story for me?</h3>
      <p>It&apos;s great for ideas and drafts, but the best stories come from your edits — use it to start, then make it yours.</p>
      <h3>Is the story generator free?</h3>
      <p>You get a set number of free AI runs each day; go Pro for unlimited use.</p>
    </>
  );
}
