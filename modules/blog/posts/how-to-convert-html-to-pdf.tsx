import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-html-to-pdf",
  title: "How to Convert HTML to PDF (Keep the Layout)",
  description:
    "Turn an HTML file into a clean, shareable PDF with the layout preserved — great for invoices, reports, and templates. Here is how, and when to use URL to PDF instead.",
  keywords: [
    "how to convert html to pdf",
    "html to pdf",
    "convert html file to pdf",
    "save html as pdf",
    "html to pdf online",
  ],
  date: "2026-07-28",
  readingMinutes: 4,
  tags: ["PDF", "Converters"],
  related: ["html-to-pdf", "url-to-pdf", "markdown-to-html", "text-to-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        HTML is perfect for the web but awkward to email or print. Converting an HTML file to PDF gives you a
        fixed, shareable document with the layout locked in — ideal for invoices, receipts, reports, and
        templates. Here&apos;s how to do it, and when a different tool is the better choice.
      </p>

      <h2>Convert HTML to PDF in three steps</h2>
      <p>
        Use the <Link href="/tools/html-to-pdf">HTML to PDF converter</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/html-to-pdf">HTML to PDF</Link> and choose your <code>.html</code> file.</li>
        <li>Click <strong>Convert to PDF</strong>.</li>
        <li>Download the PDF with the page layout preserved.</li>
      </ol>

      <h2>HTML file vs. a live web page</h2>
      <p>
        This tool converts an <strong>HTML file you upload</strong>. If you instead want to save a page
        that&apos;s already online by its address, use <Link href="/tools/url-to-pdf">URL to PDF</Link> — paste
        the link and it renders the live page to PDF.
      </p>

      <h2>Tips for a clean result</h2>
      <ul>
        <li><strong>Inline your CSS.</strong> Styles inside the HTML (or in a <code>&lt;style&gt;</code> block) apply reliably; separate stylesheet files may not travel with a single uploaded file.</li>
        <li><strong>Embed images.</strong> Images referenced by a local path won&apos;t be found — use full <code>https://</code> URLs or base64 data URIs so they render in the PDF.</li>
        <li><strong>Use print-friendly widths.</strong> Design around an A4/Letter width so nothing important is cut off at the page edge.</li>
      </ul>

      <h2>Other ways to make a PDF</h2>
      <p>
        Writing in Markdown? Turn it into HTML first with{" "}
        <Link href="/tools/markdown-to-html">Markdown to HTML</Link>. Just have plain text? Use{" "}
        <Link href="/tools/text-to-pdf">Text to PDF</Link>. Explore all our{" "}
        <Link href="/tools/pdf">PDF tools</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Is this free?</h3>
      <p>HTML to PDF is an OhoTool Pro tool. Most of our tools are free; the document converters are part of Pro.</p>
      <h3>What happens to my file?</h3>
      <p>It&apos;s processed securely on our server only to perform the conversion, then deleted right after.</p>
      <h3>Why do my images or styles look wrong?</h3>
      <p>Usually because they point to local files or an external stylesheet. Inline your CSS and use absolute image URLs (or data URIs) so everything is self-contained.</p>
    </>
  );
}
