import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-bulk-convert-and-resize-images",
  title: "How to Convert and Resize Images in Bulk",
  description:
    "Batch-convert and resize many images at once — to WebP, JPG, or PNG — for free in your browser, then download them all as a ZIP.",
  keywords: [
    "bulk image converter",
    "batch resize images",
    "convert multiple images",
    "bulk convert images to webp",
    "resize images in bulk",
  ],
  date: "2026-07-22",
  readingMinutes: 4,
  tags: ["Images", "Productivity"],
  related: ["bulk-image-converter", "image-converter", "image-resizer"],
};

export function Body() {
  return (
    <>
      <p>
        Converting images one at a time is fine for a single file — but when you have a folder of
        photos to prepare for a website, a batch of screenshots to shrink, or a set of product images
        to standardize, you want to do them all at once. Here&apos;s how to batch-process images for
        free, without uploading them anywhere.
      </p>

      <h2>Why bulk (and why WebP)</h2>
      <p>
        Doing images in bulk saves obvious time, and it&apos;s also where format choice pays off. Converting
        to <strong>WebP</strong> typically cuts file size 25–35% versus JPG at similar quality — across
        dozens of images, that&apos;s a big speed win for a website.
      </p>

      <h2>Convert and resize a whole batch</h2>
      <p>
        Use the <Link href="/tools/bulk-image-converter">Bulk Image Converter &amp; Resizer</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/bulk-image-converter">Bulk Image Converter</Link> and add your images.</li>
        <li>Choose the output format (WebP, JPG, or PNG), quality, and an optional max size.</li>
        <li>Convert them all and download individually — or as one ZIP with Pro.</li>
      </ol>
      <p>Everything runs in your browser, so even a large batch of photos never leaves your device.</p>

      <h2>Just one image?</h2>
      <ul>
        <li>Convert a single image&apos;s format with the <Link href="/tools/image-converter">image converter</Link>.</li>
        <li>Resize one image to exact dimensions with the <Link href="/tools/image-resizer">image resizer</Link>.</li>
        <li>Turn a set of images into a document with <Link href="/tools/images-to-pdf">Images to PDF</Link>.</li>
      </ul>

      <h2>Tips for web images</h2>
      <ul>
        <li><strong>Cap the dimensions</strong> — most sites never display images wider than ~1600px, so set a max size to save weight.</li>
        <li><strong>Use WebP</strong> for photos and JPG-like content; keep PNG only when you need transparency or crisp text.</li>
        <li><strong>Aim for 70–85% quality</strong> — usually indistinguishable from full quality at a fraction of the size.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>How many images can I process at once?</h3>
      <p>The free tier processes up to 3 images per batch; OhoTool Pro removes the limit and adds one-click ZIP download.</p>
      <h3>Are my images uploaded?</h3>
      <p>No — all conversion and resizing happens locally in your browser using a canvas, so nothing is uploaded.</p>
    </>
  );
}
