import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-youtube-titles",
  title: "How to Write YouTube Titles That Get Clicks",
  description:
    "What makes a YouTube title work — curiosity, clarity, and keywords — with examples, plus a free AI tool that writes titles, descriptions, and tags.",
  keywords: [
    "how to write youtube titles",
    "youtube title tips",
    "youtube title ideas",
    "youtube ctr",
    "youtube title generator",
    "clickable youtube titles",
  ],
  date: "2026-09-10",
  readingMinutes: 4,
  tags: ["Social Media", "AI"],
  related: ["youtube-title-generator", "headline-generator", "hashtag-generator"],
};

export function Body() {
  return (
    <>
      <p>
        Your title and thumbnail decide whether anyone watches. A good title creates curiosity, is instantly
        clear, and includes the words people search — without misleading anyone. Here&apos;s how to nail it.
      </p>

      <h2>Generate titles, description &amp; tags</h2>
      <p>
        Describe your video in the{" "}
        <Link href="/tools/youtube-title-generator">AI YouTube Title &amp; Description Generator</Link> and get
        several title options, a full description, and tags — everything you need to publish.
      </p>

      <h2>What makes a title click</h2>
      <ul>
        <li><strong>Clarity first</strong> — the viewer should instantly know what they&apos;ll get.</li>
        <li><strong>A curiosity gap</strong> — hint at the payoff without giving it all away.</li>
        <li><strong>Keywords</strong> — include the phrase people search, near the front.</li>
        <li><strong>Specifics &amp; numbers</strong> — &ldquo;7 tips,&rdquo; &ldquo;in 10 minutes,&rdquo; &ldquo;that actually work.&rdquo;</li>
        <li><strong>Front-load</strong> — the important words go first; titles get truncated.</li>
      </ul>

      <h2>Keep it honest</h2>
      <p>
        Clickbait that doesn&apos;t match the video kills your retention and the algorithm punishes it. Aim for
        <strong> compelling but true</strong> — the title promises exactly what the video delivers.
      </p>

      <h2>Don&apos;t forget the description and tags</h2>
      <p>
        The first two lines of your description show in search, so put a hook and keywords there. Add a call to
        action and relevant tags (the tool generates these too). Pair with the{" "}
        <Link href="/tools/hashtag-generator">Hashtag Generator</Link> for Shorts.
      </p>

      <h2>FAQ</h2>
      <h3>How long should a YouTube title be?</h3>
      <p>Aim for under ~60 characters so it isn&apos;t cut off, with the key words at the start.</p>
      <h3>Do tags still matter?</h3>
      <p>They&apos;re a minor ranking signal — helpful for disambiguation and misspellings, but title, thumbnail, and retention matter far more.</p>
    </>
  );
}
