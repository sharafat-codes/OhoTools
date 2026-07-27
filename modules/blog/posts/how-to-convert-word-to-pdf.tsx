import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-word-to-pdf",
  title: "How to Convert Word to PDF (Without Losing Formatting)",
  description:
    "Convert a Word document (.doc or .docx) into a clean, shareable PDF that keeps your fonts, images, and layout exactly as designed. A quick step-by-step.",
  keywords: [
    "how to convert word to pdf",
    "word to pdf",
    "doc to pdf",
    "docx to pdf",
    "convert word document to pdf",
  ],
  date: "2026-07-23",
  readingMinutes: 4,
  tags: ["PDF", "Productivity"],
  related: ["word-to-pdf", "office-to-pdf", "pdf-to-word", "merge-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Word is where documents get written — but PDF is how they get shared. A <code>.docx</code>{" "}
        can shift its layout depending on the fonts and Word version on someone else&apos;s computer, while
        a PDF looks identical everywhere. Here&apos;s how to turn a Word file into a polished PDF that keeps
        your formatting intact.
      </p>

      <h2>Convert Word to PDF</h2>
      <p>
        Use the <Link href="/tools/word-to-pdf">Word to PDF tool</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/word-to-pdf">Word to PDF</Link> and choose your <code>.doc</code> or <code>.docx</code> file.</li>
        <li>Convert — fonts, images, headings, and page layout are preserved.</li>
        <li>Download the finished PDF, ready to email, print, or upload.</li>
      </ol>
      <p>
        The conversion runs on our servers so the output matches how Word itself renders the document —
        embedded fonts and all — rather than a rough browser approximation.
      </p>

      <h2>Why send a PDF instead of a Word file?</h2>
      <ul>
        <li><strong>It looks the same for everyone.</strong> No shifted margins or substituted fonts on the other end.</li>
        <li><strong>It&apos;s harder to accidentally edit.</strong> Great for contracts, invoices, and final drafts.</li>
        <li><strong>It prints reliably</strong> and is the expected format for job applications and official forms.</li>
      </ul>

      <h2>Tips for a clean result</h2>
      <ul>
        <li><strong>Finish formatting in Word first.</strong> Page breaks and spacing carry straight over, so tidy them before converting.</li>
        <li><strong>Embed unusual fonts</strong> in Word (File → Options → Save → Embed fonts) if your document relies on them.</li>
        <li><strong>Check images are high resolution</strong> — a blurry image in Word will be blurry in the PDF too.</li>
      </ul>

      <h2>Working with other Office files</h2>
      <p>
        Need PowerPoint or Excel as well? <Link href="/tools/office-to-pdf">Office to PDF</Link> handles
        Word, PowerPoint, and Excel in one place. And if you ever need to go back the other way, turn a
        PDF into an editable document with <Link href="/tools/pdf-to-word">PDF to Word</Link>.
      </p>
      <p>
        You&apos;ll find these alongside merge, split, and compress in our full set of{" "}
        <Link href="/tools/pdf">PDF tools</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Will my formatting change?</h3>
      <p>No — headings, fonts, images, and layout are preserved so the PDF matches your Word document.</p>
      <h3>What file types can I convert?</h3>
      <p>Both modern <code>.docx</code> and older <code>.doc</code> files, plus <code>.odt</code> and <code>.rtf</code>.</p>
      <h3>Can I combine several documents into one PDF?</h3>
      <p>Yes — convert each to PDF, then <Link href="/tools/merge-pdf">merge the PDFs</Link> into a single file.</p>
    </>
  );
}
