import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-come-up-with-a-business-name",
  title: "How to Come Up With a Business Name",
  description:
    "Stuck naming your business? A practical process for brainstorming brandable names — plus a free AI generator to spark ideas and what to check before you commit.",
  keywords: [
    "how to come up with a business name",
    "business name ideas",
    "business name generator",
    "company name ideas",
    "brand name ideas",
  ],
  date: "2026-07-29",
  readingMinutes: 4,
  tags: ["Business", "AI"],
  related: ["business-name-generator", "slogan-generator", "bio-generator", "caption-generator"],
};

export function Body() {
  return (
    <>
      <p>
        A good business name is short, easy to say, easy to spell, and available as a domain and handle.
        Getting there is part brainstorming, part filtering. Here&apos;s a simple process — and a free
        generator to jump-start the ideas when you&apos;re staring at a blank page.
      </p>

      <h2>Generate a shortlist fast</h2>
      <p>
        Describe what your business does in the <Link href="/tools/business-name-generator">Business Name Generator</Link>,
        pick a style, and get a batch of ideas in seconds. Run it a few times — the goal is quantity first,
        then you filter.
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Describe your product, audience, and vibe.</li>
        <li>Choose a style — modern, playful, professional, or one-word.</li>
        <li>Generate, star your favorites, and regenerate for more angles.</li>
      </ol>

      <h2>What makes a name work</h2>
      <ul>
        <li><strong>Easy to say and spell</strong> — if people can&apos;t repeat it after hearing it once, it&apos;s too clever.</li>
        <li><strong>Short</strong> — one or two words is easier to remember and fits a logo.</li>
        <li><strong>Distinct</strong> — it shouldn&apos;t be confused with an existing brand in your space.</li>
        <li><strong>Room to grow</strong> — avoid boxing yourself in with an overly specific name.</li>
      </ul>

      <h2>Before you commit — check these</h2>
      <ul>
        <li><strong>Domain</strong> — is a clean <code>.com</code> (or a good alternative) available?</li>
        <li><strong>Social handles</strong> — can you get a consistent handle across platforms?</li>
        <li><strong>Trademark</strong> — search your country&apos;s trademark register so you&apos;re not building on someone else&apos;s mark.</li>
      </ul>
      <p>
        The generator suggests ideas but can&apos;t verify availability — always run these checks yourself
        before you print business cards.
      </p>

      <h2>Once you&apos;ve got the name</h2>
      <p>
        Give it a tagline with the <Link href="/tools/slogan-generator">Slogan Generator</Link>, write your{" "}
        <Link href="/tools/bio-generator">profile bios</Link>, and draft launch{" "}
        <Link href="/tools/caption-generator">captions</Link> — all in the{" "}
        <Link href="/tools/ai">AI tools</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Is the business name generator free?</h3>
      <p>You get a set number of free AI runs each day; go Pro for unlimited use.</p>
      <h3>Are the names available to trademark or register?</h3>
      <p>Not guaranteed — always check domain, handle, and trademark availability yourself before committing.</p>
    </>
  );
}
