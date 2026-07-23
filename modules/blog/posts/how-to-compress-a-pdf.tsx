import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-compress-a-pdf",
  title: "How to Compress a PDF to Reduce File Size",
  description:
    "Shrink a large PDF so it's easy to email and upload. A practical guide to reducing PDF file size without losing readability.",
  keywords: [
    "how to compress a pdf",
    "reduce pdf size",
    "compress pdf",
    "make pdf smaller",
    "shrink pdf file size",
  ],
  date: "2026-07-23",
  readingMinutes: 4,
  tags: ["PDF", "Productivity"],
  related: ["compress-pdf", "compress-image", "merge-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Email attachment limits and upload forms love to reject big PDFs. Most oversized PDFs are large
        because of <strong>high-resolution images</strong> inside them — scanned pages, photos, or
        exported designs. Here&apos;s how to shrink one down.
      </p>

      <h2>Compress a PDF</h2>
      <p>
        Use the <Link href="/tools/compress-pdf">Compress PDF tool</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/compress-pdf">Compress PDF</Link> and choose your file.</li>
        <li>Pick a quality/resolution level (lower = smaller file).</li>
        <li>Compress and download — you&apos;ll see the before/after size.</li>
      </ol>
      <p>It works especially well on <strong>scanned or image-heavy PDFs</strong>, which are usually the biggest offenders.</p>

      <h2>Pick the right quality</h2>
      <ul>
        <li><strong>Medium</strong> is a good default — big size savings, still readable.</li>
        <li><strong>Low</strong> for the smallest file when it&apos;s just for reference or email.</li>
        <li><strong>High</strong> when print quality matters and you only need a modest reduction.</li>
      </ul>

      <h2>Prevent big PDFs in the first place</h2>
      <p>
        If you&apos;re building a PDF from images, compress the images <em>before</em> you combine them with{" "}
        <Link href="/tools/compress-image">Compress Image</Link>, then assemble them with{" "}
        <Link href="/tools/images-to-pdf">Images to PDF</Link>. Smaller inputs mean a smaller PDF from the
        start.
      </p>

      <h2>FAQ</h2>
      <h3>Will compressing ruin the quality?</h3>
      <p>There&apos;s a trade-off, but at medium quality the difference is usually hard to notice while the file gets much smaller.</p>
      <h3>Is my file uploaded?</h3>
      <p>Your document is processed to compress it and then discarded — it isn&apos;t stored.</p>
    </>
  );
}
