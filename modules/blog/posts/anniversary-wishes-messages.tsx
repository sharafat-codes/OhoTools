import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "anniversary-wishes-messages",
  title: "Anniversary Wishes: 60+ Messages to Write in a Card (Copy & Paste)",
  description:
    "Heartfelt, funny, and religious anniversary wishes for your wife, husband, parents, and friends — plus milestone-year lines and how to make an animated anniversary card.",
  keywords: [
    "anniversary wishes",
    "anniversary messages",
    "happy anniversary wishes for wife",
    "wedding anniversary wishes for husband",
    "anniversary card message",
  ],
  date: "2026-08-14",
  readingMinutes: 5,
  tags: ["Cards & Invitations"],
  related: ["anniversary-card-maker", "wedding-invitation-maker", "birthday-card-maker"],
};

export function Body() {
  return (
    <>
      <p>
        The right words make an anniversary card land. Below are 60+ anniversary wishes — for your wife, husband,
        parents, and friends, plus funny and religious lines and milestone-year messages. Pick one, then put it in
        the <Link href="/tools/anniversary-card-maker">anniversary card maker</Link> to send an animated card.
      </p>

      <h2>For your wife</h2>
      <ul>
        <li>&quot;Every year with you is my favourite year. Happy anniversary, my love.&quot;</li>
        <li>&quot;You are my best decision, my calm, and my home. Happy anniversary.&quot;</li>
        <li>&quot;Thank you for [number] years of love and laughter. Here&apos;s to many more.&quot;</li>
        <li>&quot;I&apos;d marry you all over again. Happy anniversary to the love of my life.&quot;</li>
        <li>&quot;Growing old with you is the adventure I never want to end.&quot;</li>
      </ul>

      <h2>For your husband</h2>
      <ul>
        <li>&quot;Through everything, you&apos;re still my favourite person. Happy anniversary.&quot;</li>
        <li>&quot;Thank you for being my partner in all things. I love our life together.&quot;</li>
        <li>&quot;[Number] years and my heart still skips for you. Happy anniversary.&quot;</li>
        <li>&quot;You make ordinary days feel special. Here&apos;s to us — always.&quot;</li>
        <li>&quot;Still choosing you, every single day. Happy anniversary, my love.&quot;</li>
      </ul>

      <h2>For parents</h2>
      <ul>
        <li>&quot;Happy anniversary to the two people who taught me what real love looks like.&quot;</li>
        <li>&quot;[Number] years together and still the best example of love and patience. We love you.&quot;</li>
        <li>&quot;Mom and Dad, thank you for the home you built. Happy anniversary!&quot;</li>
        <li>&quot;Your love is the foundation of our whole family. Happy anniversary.&quot;</li>
      </ul>

      <h2>For friends &amp; family</h2>
      <ul>
        <li>&quot;Happy anniversary! Wishing you both a lifetime of love and happiness.&quot;</li>
        <li>&quot;Congratulations on [number] wonderful years together. Cheers to you two!&quot;</li>
        <li>&quot;So happy to celebrate your love today. Happy anniversary!&quot;</li>
      </ul>

      <h2>Funny</h2>
      <ul>
        <li>&quot;Happy anniversary! Still putting up with each other — that&apos;s true love.&quot;</li>
        <li>&quot;[Number] years and you haven&apos;t returned me yet. Must be love. Happy anniversary!&quot;</li>
        <li>&quot;Congrats on another year of not being able to agree on what to watch.&quot;</li>
      </ul>

      <h2>Religious &amp; blessings</h2>
      <ul>
        <li>&quot;May Allah bless your marriage with love, patience, and countless happy years. Happy anniversary.&quot;</li>
        <li>&quot;Wishing you God&apos;s blessings on your anniversary and always.&quot;</li>
        <li>&quot;May your bond grow stronger with every year, by the grace of the Almighty.&quot;</li>
      </ul>

      <h2>Milestone years</h2>
      <ul>
        <li>
          <strong>1st (Paper):</strong> &quot;One year down, forever to go. Happy first anniversary!&quot;
        </li>
        <li>
          <strong>5th:</strong> &quot;Five years of us — and it keeps getting better. Happy anniversary.&quot;
        </li>
        <li>
          <strong>10th:</strong> &quot;A whole decade of love. Here&apos;s to the next ten and beyond.&quot;
        </li>
        <li>
          <strong>25th (Silver):</strong> &quot;25 years of love that only shines brighter. Happy Silver Anniversary.&quot;
        </li>
        <li>
          <strong>50th (Golden):</strong> &quot;Fifty golden years together — a love story for the ages.&quot;
        </li>
      </ul>

      <h2>Make an animated anniversary card</h2>
      <p>
        Choose your message, open the{" "}
        <Link href="/tools/anniversary-card-maker">anniversary card maker</Link>, add a photo and music, and share
        the card by link — including on{" "}
        <Link href="/blog/how-to-send-a-digital-invitation-on-whatsapp">WhatsApp</Link>. For other occasions, see
        all the <Link href="/tools/cards">card &amp; invitation makers</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>How long should an anniversary message be?</h3>
      <p>
        One or two heartfelt sentences is plenty for a card. Add the number of years and a personal detail to make
        it feel specific.
      </p>
      <h3>What do I write for a milestone like the 25th or 50th?</h3>
      <p>
        Name the milestone — &quot;Silver&quot; for 25, &quot;Golden&quot; for 50 — and celebrate the length of
        the journey. See the milestone lines above.
      </p>
      <h3>Can I send an anniversary card digitally?</h3>
      <p>Yes — make one in a couple of minutes and share the link, or download it as an image or video.</p>
    </>
  );
}
