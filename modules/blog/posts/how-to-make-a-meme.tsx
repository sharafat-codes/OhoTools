import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-make-a-meme",
  title: "How to Make a Meme (Free, No Watermark)",
  description:
    "Add classic top and bottom captions to any image and download your meme — free, no watermark, no sign-up, and entirely in your browser.",
  keywords: [
    "how to make a meme",
    "meme generator free",
    "meme maker",
    "add text to image meme",
    "make a meme online",
  ],
  date: "2026-07-31",
  readingMinutes: 3,
  tags: ["Images"],
  related: ["meme-generator", "add-text-to-image", "crop-image", "image-converter"],
};

export function Body() {
  return (
    <>
      <p>
        A good meme is one image and a couple of punchy lines. You don&apos;t need an app or an account —
        just an image and something funny to say. Here&apos;s how to make a meme for free, with the classic
        bold caption style, no watermark, and nothing uploaded.
      </p>

      <h2>Make a meme in three steps</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open the <Link href="/tools/meme-generator">Meme Generator</Link> and drop in your image.</li>
        <li>Type your <strong>top</strong> and <strong>bottom</strong> text — the preview updates live.</li>
        <li>Download your meme as a PNG.</li>
      </ol>
      <p>
        Captions use the classic bold Impact style with a black outline, uppercased automatically, and long
        lines wrap so they always fit the image.
      </p>

      <h2>Tips for a meme that lands</h2>
      <ul>
        <li><strong>Keep it short.</strong> Two lines beat a paragraph — memes are read in a glance.</li>
        <li><strong>Top sets up, bottom pays off.</strong> The classic two-part structure still works.</li>
        <li><strong>Pick a clear image.</strong> Captions read best over simple, high-contrast areas.</li>
      </ul>

      <h2>Prep your image first</h2>
      <p>
        Want a specific shape for the platform? <Link href="/tools/crop-image">Crop it</Link> first (square for
        Instagram, 16:9 for a thumbnail). Need finer text control or a caption anywhere on the image, not just
        top/bottom? Try <Link href="/tools/add-text-to-image">Add Text to Image</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Is there a watermark?</h3>
      <p>No — your downloaded meme is clean, with no watermark or branding.</p>
      <h3>Is my image uploaded?</h3>
      <p>No — the meme is drawn on a canvas in your browser, so your image never leaves your device.</p>
      <h3>Do I need an account?</h3>
      <p>No — it&apos;s free with no sign-up.</p>
    </>
  );
}
