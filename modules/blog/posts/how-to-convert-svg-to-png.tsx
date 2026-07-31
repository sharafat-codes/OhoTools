import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-svg-to-png",
  title: "How to Convert SVG to PNG (Free, Any Size)",
  description:
    "Turn an SVG into a crisp PNG (or JPG/WebP) at any scale — free and entirely in your browser. Great for exporting icons and logos at 2× or 3× for high-DPI screens.",
  keywords: [
    "svg to png",
    "how to convert svg to png",
    "svg to png converter",
    "export svg as png",
    "svg to jpg",
  ],
  date: "2026-07-31",
  readingMinutes: 4,
  tags: ["Images", "Developer"],
  related: ["svg-to-png", "svg-to-image", "image-to-svg", "svg-optimizer"],
};

export function Body() {
  return (
    <>
      <p>
        SVGs are perfect for the web — they scale to any size without blurring — but plenty of places
        don&apos;t accept them: social media, some document editors, email, and app stores usually want a
        raster image like PNG. Here&apos;s how to convert an SVG to PNG for free, at exactly the size you
        need, without uploading anything.
      </p>

      <h2>Convert SVG to PNG in three steps</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open the <Link href="/tools/svg-to-png">SVG to PNG tool</Link> and drop in your <code>.svg</code> file.</li>
        <li>Pick the output format (PNG, JPG, or WebP) and a scale.</li>
        <li>Download the rasterized image.</li>
      </ol>
      <p>
        Only have the SVG markup, not a file? Paste it into the{" "}
        <Link href="/tools/svg-to-image">SVG Code to Image tool</Link> instead.
      </p>

      <h2>Choose the right scale for sharp output</h2>
      <p>
        An SVG has no fixed resolution, so you decide how large the PNG should be. For crisp results on
        modern (high-DPI / &ldquo;Retina&rdquo;) screens, export at <strong>2× or 3×</strong> the display
        size:
      </p>
      <ul>
        <li><strong>1×</strong> — matches the SVG&apos;s intrinsic size; fine for quick previews.</li>
        <li><strong>2×–3×</strong> — recommended for logos and icons so they stay sharp everywhere.</li>
        <li><strong>4×</strong> — for print or very large displays.</li>
      </ul>

      <h2>PNG, JPG, or WebP?</h2>
      <ul>
        <li><strong>PNG</strong> — keeps transparency; best for logos and icons.</li>
        <li><strong>WebP</strong> — smallest file at good quality; great for the web.</li>
        <li><strong>JPG</strong> — no transparency (transparent areas become white); best for photo-like SVGs.</li>
      </ul>

      <h2>Going the other way</h2>
      <p>
        Need a raster image turned <em>into</em> an SVG? The{" "}
        <Link href="/tools/image-to-svg">Image to SVG tool</Link> traces a PNG or JPG into a scalable vector.
        And if your SVG is bloated with editor metadata, the{" "}
        <Link href="/tools/svg-optimizer">SVG Optimizer</Link> shrinks it without changing how it looks.
      </p>

      <h2>FAQ</h2>
      <h3>Is my file uploaded anywhere?</h3>
      <p>No — the SVG is rendered to a canvas and exported entirely in your browser.</p>
      <h3>Can I export at high resolution?</h3>
      <p>Yes — choose a 2×, 3×, or 4× scale to render the SVG larger for crisp, high-DPI output.</p>
      <h3>Why did my transparent SVG get a white background in JPG?</h3>
      <p>JPG doesn&apos;t support transparency, so transparent areas are filled with white. Use PNG or WebP to keep transparency.</p>
    </>
  );
}
