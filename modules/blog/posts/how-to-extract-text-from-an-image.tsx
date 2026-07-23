import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-extract-text-from-an-image",
  title: "How to Extract Text From an Image (OCR)",
  description:
    "Pull editable text out of a photo, screenshot, or scanned document using OCR. A quick guide to turning images into copyable text.",
  keywords: [
    "extract text from image",
    "image to text",
    "ocr online",
    "photo to text",
    "copy text from picture",
  ],
  date: "2026-07-23",
  readingMinutes: 4,
  tags: ["OCR", "Productivity"],
  related: ["image-to-text", "pdf-to-text", "strip-html"],
};

export function Body() {
  return (
    <>
      <p>
        Ever needed to copy text from a screenshot, a photo of a whiteboard, or a scanned receipt? You
        can&apos;t select text in an image — but <strong>OCR</strong> (optical character recognition) can
        read it for you and turn it into editable text.
      </p>

      <h2>Extract text from an image</h2>
      <p>
        Use the <Link href="/tools/image-to-text">Image to Text tool</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/image-to-text">Image to Text</Link> and upload your image (JPG, PNG, or a photo).</li>
        <li>Click Extract — OCR reads the text.</li>
        <li>Copy the recognized text and use it anywhere.</li>
      </ol>

      <h2>Where OCR helps</h2>
      <ul>
        <li>Copying text from a <strong>screenshot</strong> you can&apos;t select.</li>
        <li>Digitizing a <strong>receipt or business card</strong>.</li>
        <li>Getting text out of a <strong>photo of a document</strong> or a slide.</li>
        <li>Turning a <strong>scanned page</strong> into editable text.</li>
      </ul>

      <h2>Tips for accurate results</h2>
      <ul>
        <li><strong>Good lighting and focus</strong> — blurry or dark photos reduce accuracy.</li>
        <li><strong>Straight, not skewed</strong> — crop to the text and keep it roughly level.</li>
        <li><strong>Higher resolution</strong> generally reads better than a tiny thumbnail.</li>
      </ul>

      <h2>Working with PDFs</h2>
      <p>
        If your text is in a PDF that has real (selectable) text, skip OCR and use{" "}
        <Link href="/tools/pdf-to-text">PDF to Text</Link> — it&apos;s instant and free. Use OCR
        (Image to Text) when the PDF or file is a scan or photo with no selectable text.
      </p>

      <h2>FAQ</h2>
      <h3>Which languages are supported?</h3>
      <p>OCR handles a wide range of languages, with English and other common languages recognized well.</p>
      <h3>Is handwriting supported?</h3>
      <p>OCR is designed for printed text. Neat handwriting may work partially, but printed text is far more reliable.</p>
    </>
  );
}
