import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-get-hex-color-from-image",
  title: "How to Get the Hex Color Code from an Image",
  description:
    "Upload an image and click any pixel to grab its exact HEX, RGB, and HSL color — free, in your browser. Perfect for matching a brand color from a screenshot.",
  keywords: [
    "hex color from image",
    "get color from image",
    "image color picker",
    "color picker from image",
    "eyedropper online",
  ],
  date: "2026-07-31",
  readingMinutes: 3,
  tags: ["Images", "Web & SEO"],
  related: ["color-picker-from-image", "color-converter", "color-shades-generator", "css-gradient-generator"],
};

export function Body() {
  return (
    <>
      <p>
        You&apos;ve got a screenshot, a logo, or a photo and you need the <em>exact</em> color from it — to
        match a brand, build a palette, or fill a design. Eyeballing it never quite works. Here&apos;s how to
        get the hex color code from an image for free, by clicking the pixel you want.
      </p>

      <h2>Pick a color in three steps</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open the <Link href="/tools/color-picker-from-image">Color Picker from Image</Link> and upload your image.</li>
        <li>Click anywhere on the image to sample that pixel.</li>
        <li>Copy the <strong>HEX</strong>, <strong>RGB</strong>, or <strong>HSL</strong> value with one click.</li>
      </ol>

      <h2>HEX, RGB, or HSL — which do you need?</h2>
      <ul>
        <li><strong>HEX</strong> (e.g. <code>#6d28d9</code>) — the most common for web and design tools.</li>
        <li><strong>RGB</strong> — handy in CSS and when you need an alpha channel (rgba).</li>
        <li><strong>HSL</strong> — best when you want to tweak hue/saturation/lightness by hand.</li>
      </ul>
      <p>The picker shows all three for every color you sample, so you can copy whichever your tool expects.</p>

      <h2>Turn one color into a palette</h2>
      <p>
        Once you have a base color, the <Link href="/tools/color-shades-generator">Color Shades Generator</Link>{" "}
        builds tints and shades from it, the <Link href="/tools/color-converter">Color Converter</Link> switches
        between formats, and the <Link href="/tools/css-gradient-generator">CSS Gradient Generator</Link> blends
        two colors into a ready-to-use gradient.
      </p>

      <h2>FAQ</h2>
      <h3>Is my image uploaded anywhere?</h3>
      <p>No — the image is read into a canvas locally in your browser, so it never leaves your device.</p>
      <h3>Can I pick more than one color?</h3>
      <p>Yes — click as many spots as you like; each click updates the HEX, RGB, and HSL readout.</p>
      <h3>What image formats work?</h3>
      <p>JPG, PNG, WebP, and most common formats.</p>
    </>
  );
}
