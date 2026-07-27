import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-excel-to-pdf",
  title: "How to Convert Excel to PDF (and Keep It on One Page)",
  description:
    "Convert an Excel spreadsheet (.xlsx or .xls) to a clean PDF for sharing or printing — with tips to stop your columns spilling onto extra pages.",
  keywords: [
    "how to convert excel to pdf",
    "excel to pdf",
    "xlsx to pdf",
    "spreadsheet to pdf",
    "convert excel to pdf",
  ],
  date: "2026-07-23",
  readingMinutes: 4,
  tags: ["PDF", "Productivity"],
  related: ["excel-to-pdf", "office-to-pdf", "word-to-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Sharing a raw Excel file means the recipient can accidentally break a formula, resort your data, or
        see it differently depending on their app. Exporting to PDF gives them a clean, read-only snapshot
        that looks exactly as you intended. Here&apos;s how — plus how to stop a wide sheet from sprawling
        across a dozen pages.
      </p>

      <h2>Convert Excel to PDF</h2>
      <p>
        Use the <Link href="/tools/excel-to-pdf">Excel to PDF tool</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/excel-to-pdf">Excel to PDF</Link> and select your <code>.xlsx</code> or <code>.xls</code> file.</li>
        <li>Convert — your sheets, values, and formatting are rendered into a PDF.</li>
        <li>Download the PDF, ready to send or print.</li>
      </ol>

      <h2>Stop your spreadsheet spilling onto extra pages</h2>
      <p>
        Spreadsheets are the trickiest Office files to convert because they have no fixed page size. A little
        prep in Excel <em>before</em> converting makes a huge difference:
      </p>
      <ul>
        <li><strong>Set a print area</strong> (Page Layout → Print Area) so only the range you care about is included.</li>
        <li><strong>Use &ldquo;Fit to width&rdquo;</strong> under Page Layout → Scale to Fit so wide tables land on one page across.</li>
        <li><strong>Switch to landscape</strong> for tables with many columns.</li>
        <li><strong>Check page breaks</strong> in Page Break Preview to see exactly where each page will split.</li>
      </ul>

      <h2>Other Office formats</h2>
      <p>
        Working with Word or PowerPoint too? <Link href="/tools/office-to-pdf">Office to PDF</Link> converts
        all three, and <Link href="/tools/word-to-pdf">Word to PDF</Link> is a dedicated shortcut for
        documents. See the rest of our <Link href="/tools/pdf">PDF tools</Link> for merging, splitting, and
        compressing the result.
      </p>

      <h2>FAQ</h2>
      <h3>Will my formulas and formatting be preserved?</h3>
      <p>The PDF captures the calculated values and cell formatting exactly as they appear in Excel — the result is a static, print-ready copy.</p>
      <h3>Can I convert a workbook with multiple sheets?</h3>
      <p>Yes — each sheet is included in the resulting PDF.</p>
    </>
  );
}
