import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-pdf-to-jpg",
  title: "How to Convert a PDF to JPG or PNG (Free, In Your Browser)",
  description:
    "Turn PDF pages into JPG or PNG images for free — privately in your browser. Learn when to use JPG vs PNG and how to keep the quality sharp.",
  keywords: [
    "how to convert pdf to jpg",
    "pdf to jpg",
    "pdf to png",
    "convert pdf to image",
    "pdf to jpg free",
  ],
  date: "2026-07-22",
  readingMinutes: 4,
  tags: ["PDF", "Images"],
  related: ["pdf-to-images", "images-to-pdf", "image-converter"],
};

export function Body() {
  return (
    <>
      <p>
        Sometimes you need a PDF page as an <em>image</em> — to drop into a slide deck, post online, or
        preview a document as a thumbnail. Converting a PDF to JPG or PNG is quick, and you can do it
        without uploading your file anywhere.
      </p>

      <h2>Convert a PDF to images</h2>
      <p>
        Use our <Link href="/tools/pdf-to-images">PDF to Images tool</Link>. It renders each page to a
        crisp JPG or PNG right in your browser:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/pdf-to-images">PDF to Images</Link> and choose your PDF.</li>
        <li>Pick JPG or PNG, the resolution, and (for JPG) the quality.</li>
        <li>Convert, then download each page — or all of them as a ZIP with Pro.</li>
      </ol>

      <h2>JPG or PNG — which should you choose?</h2>
      <ul>
        <li><strong>JPG</strong> — smaller files, ideal for scanned documents and photo-heavy pages. Slight quality loss you won&apos;t usually notice.</li>
        <li><strong>PNG</strong> — lossless and razor-sharp for text and line art, but larger files.</li>
      </ul>

      <h2>Keeping quality high</h2>
      <p>
        The <strong>resolution</strong> setting controls how sharp the output is. Choose &quot;High&quot; or
        &quot;Very high&quot; for text you&apos;ll zoom into or print; &quot;Standard&quot; is fine for quick
        on-screen previews and keeps file sizes down.
      </p>

      <h2>Going the other way</h2>
      <p>
        Need to build a PDF from images instead? Use <Link href="/tools/images-to-pdf">Images to PDF</Link>.
        And to convert between image formats (say, the exported PNGs to WebP), the{" "}
        <Link href="/tools/image-converter">image converter</Link> handles that.
      </p>

      <h2>FAQ</h2>
      <h3>Is my PDF uploaded to convert it?</h3>
      <p>No — every page is rendered to an image locally in your browser, so your document never leaves your device.</p>
      <h3>Can I convert every page at once?</h3>
      <p>The free tier converts the first few pages; OhoTool Pro converts the whole document and packages the images as a ZIP.</p>
    </>
  );
}
