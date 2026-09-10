import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-a-cold-email",
  title: "How to Write a Cold Email That Gets Replies",
  description:
    "The structure of a cold email that works — subject line, personalized opener, value, and CTA — with examples and mistakes, plus a free AI cold email generator.",
  keywords: [
    "how to write a cold email",
    "cold email template",
    "cold email tips",
    "cold outreach email",
    "cold email generator",
    "sales email",
  ],
  date: "2026-09-10",
  readingMinutes: 4,
  tags: ["Business", "AI"],
  related: ["cold-email-generator", "ai-email-writer", "cover-letter-generator"],
};

export function Body() {
  return (
    <>
      <p>
        A cold email works when it&apos;s short, relevant, and about the reader — not you. Get the subject line
        and first line right, make one clear ask, and you&apos;ll get replies. Here&apos;s the structure.
      </p>

      <h2>Draft one instantly</h2>
      <p>
        Describe your offer and prospect in the <Link href="/tools/cold-email-generator">AI Cold Email Generator</Link>{" "}
        and get a personalized email with a subject line and call to action — then add your specifics.
      </p>

      <h2>The 4 parts</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li><strong>Subject line</strong> — short, specific, and curiosity-driven; not salesy.</li>
        <li><strong>Personalized opener</strong> — a real reason you&apos;re reaching out to <em>them</em>.</li>
        <li><strong>Value</strong> — one sentence on the outcome you can help them get.</li>
        <li><strong>One clear CTA</strong> — a low-friction ask (&ldquo;Open to a quick call next week?&rdquo;).</li>
      </ol>

      <h2>Rules that get replies</h2>
      <ul>
        <li><strong>Keep it under ~120 words</strong> — busy people skim; short wins.</li>
        <li><strong>Make it about them</strong> — lead with their goal or problem, not your company.</li>
        <li><strong>One ask only</strong> — multiple CTAs kill response rates.</li>
        <li><strong>No fake urgency</strong> — &ldquo;Act now!!!&rdquo; reads as spam.</li>
      </ul>

      <h2>Mistakes to avoid</h2>
      <ul>
        <li><strong>Generic openers</strong> — &ldquo;I hope this email finds you well&rdquo; signals a blast.</li>
        <li><strong>Talking about yourself</strong> — nobody cares about your features until they see the benefit.</li>
        <li><strong>A wall of text</strong> — long emails get archived unread.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>How long should a cold email be?</h3>
      <p>Short — ideally 50–120 words. Enough to be relevant, short enough to read in seconds.</p>
      <h3>Should I follow up?</h3>
      <p>Yes — most replies come from a polite follow-up or two, spaced a few days apart.</p>
    </>
  );
}
