import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-px-to-rem",
  title: "PX to REM: A Simple CSS Conversion Guide",
  description:
    "What rem and em mean, the simple formula to convert px to rem, why rem is better for accessibility, and a free converter to do the math.",
  keywords: [
    "px to rem",
    "convert px to rem",
    "rem to px",
    "px to em",
    "css rem",
    "rem vs em",
  ],
  date: "2026-09-10",
  readingMinutes: 3,
  tags: ["Developer"],
  related: ["px-rem-converter", "css-gradient-generator", "color-converter"],
};

export function Body() {
  return (
    <>
      <p>
        Sizing in CSS with <code>rem</code> instead of <code>px</code> makes your layout scale with the
        user&apos;s font settings — better for accessibility and responsive design. The conversion is one
        simple division.
      </p>

      <h2>The formula</h2>
      <p>
        <strong>rem = px ÷ root font size.</strong> The root font size defaults to <strong>16px</strong>, so:
      </p>
      <ul>
        <li>24px ÷ 16 = <strong>1.5rem</strong></li>
        <li>32px ÷ 16 = <strong>2rem</strong></li>
        <li>To go back: rem × 16 = px.</li>
      </ul>
      <p>
        Skip the mental math with the <Link href="/tools/px-rem-converter">PX to REM Converter</Link> — set
        your root size and convert both ways instantly.
      </p>

      <h2>rem vs. em — what&apos;s the difference?</h2>
      <ul>
        <li><strong>rem</strong> is relative to the <em>root</em> (the <code>html</code> element), so it&apos;s predictable everywhere.</li>
        <li><strong>em</strong> is relative to the <em>parent</em> element&apos;s font size, so it compounds when elements are nested.</li>
      </ul>
      <p>For most spacing and font sizes, <strong>rem is the safer default</strong>; reach for em when you want a value to scale with its local context.</p>

      <h2>Why use rem at all?</h2>
      <p>
        If a user increases their browser&apos;s default font size (for readability), <code>rem</code>-based
        layouts grow with it, while fixed <code>px</code> values don&apos;t. That makes rem the accessible,
        user-respecting choice for typography and spacing.
      </p>

      <h2>FAQ</h2>
      <h3>What is 1rem in px?</h3>
      <p>1rem equals your root font size — 16px by default, so 1rem = 16px unless you&apos;ve changed the html font-size.</p>
      <h3>Should I use px anywhere?</h3>
      <p>Yes — px is fine for borders, hairlines, and anything that shouldn&apos;t scale with font size. Use rem for type and spacing.</p>
    </>
  );
}
