import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-markdown-to-pdf",
  title: "How to Convert Markdown to PDF (Free)",
  description:
    "Turn Markdown into a clean PDF with selectable text — headings, lists, quotes, and code blocks — free and entirely in your browser, with a live preview.",
  keywords: [
    "markdown to pdf",
    "convert markdown to pdf",
    "md to pdf",
    "export markdown as pdf",
    "markdown pdf",
  ],
  date: "2026-07-31",
  readingMinutes: 3,
  tags: ["Developer", "PDF"],
  related: ["markdown-to-pdf", "markdown-to-html", "html-to-pdf", "text-to-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Markdown is great for writing — READMEs, notes, docs — but when it&apos;s time to share, people want a
        PDF. Here&apos;s how to convert Markdown to a clean, shareable PDF for free, with real selectable text
        (not a screenshot), a live preview, and nothing uploaded.
      </p>

      <h2>Convert Markdown to PDF in three steps</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open the <Link href="/tools/markdown-to-pdf">Markdown to PDF tool</Link>.</li>
        <li>Paste or write your Markdown — the live preview shows how it renders.</li>
        <li>Click <strong>Download PDF</strong>.</li>
      </ol>

      <h2>What&apos;s supported</h2>
      <ul>
        <li><strong>Headings</strong> (# through ######), sized appropriately in the PDF.</li>
        <li><strong>Lists</strong> — bulleted and numbered.</li>
        <li><strong>Blockquotes</strong> and <strong>code blocks</strong>, laid out clearly.</li>
        <li><strong>Paragraphs</strong> with automatic page breaks for long documents.</li>
      </ul>
      <p>The text in the PDF is real, selectable text — so it&apos;s searchable and copyable, and the file stays small.</p>

      <h2>Why not just print to PDF?</h2>
      <p>
        You can, but browser print output includes headers, footers, and page margins you didn&apos;t ask for,
        and it&apos;s fiddly to get consistent. A dedicated converter gives you a clean document every time,
        with one click.
      </p>

      <h2>Related conversions</h2>
      <p>
        Need HTML instead of a PDF? Use <Link href="/tools/markdown-to-html">Markdown to HTML</Link>. Have an
        existing web page or HTML to turn into a PDF? Try{" "}
        <Link href="/tools/html-to-pdf">HTML to PDF</Link>. Or drop plain text into{" "}
        <Link href="/tools/text-to-pdf">Text to PDF</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Is my content uploaded anywhere?</h3>
      <p>No — both the preview and the PDF are generated entirely in your browser.</p>
      <h3>Is the PDF text selectable?</h3>
      <p>Yes — it&apos;s rendered as real, selectable text, not a flat image, so it&apos;s searchable and small.</p>
      <h3>Does it handle long documents?</h3>
      <p>Yes — content flows across pages automatically.</p>
    </>
  );
}
