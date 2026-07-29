import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-make-a-free-invoice",
  title: "How to Make a Free Invoice (Fast)",
  description:
    "Create a professional invoice PDF for free in minutes — no template hunting, no sign-up. What to include on an invoice and how to generate one in your browser.",
  keywords: [
    "how to make an invoice",
    "free invoice generator",
    "create an invoice",
    "invoice template",
    "make an invoice pdf",
  ],
  date: "2026-07-29",
  readingMinutes: 4,
  tags: ["Productivity", "Business"],
  related: ["invoice-generator", "excel-to-pdf", "text-to-pdf", "csv-to-xlsx"],
};

export function Body() {
  return (
    <>
      <p>
        Sending your first invoice — or just tired of wrestling with a spreadsheet template? You don&apos;t
        need accounting software to bill a client. Here&apos;s what belongs on a professional invoice and how
        to generate a clean PDF for free, right in your browser.
      </p>

      <h2>Make an invoice in three steps</h2>
      <p>
        Use the <Link href="/tools/invoice-generator">Invoice Generator</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Fill in your business details and your client&apos;s details.</li>
        <li>Add line items (description, quantity, price), plus tax and any notes — the totals calculate for you.</li>
        <li>Click <strong>Download PDF</strong>. Done.</li>
      </ol>

      <h2>What every invoice should include</h2>
      <ul>
        <li><strong>The word &ldquo;Invoice&rdquo;</strong> and a unique invoice number.</li>
        <li><strong>Your details</strong> — name/business, address, and contact.</li>
        <li><strong>Your client&apos;s details.</strong></li>
        <li><strong>Date issued</strong> and a <strong>due date</strong>.</li>
        <li><strong>Line items</strong> — a clear description, quantity, and unit price for each.</li>
        <li><strong>Subtotal, tax, and total.</strong></li>
        <li><strong>Payment terms / notes</strong> — how and when to pay.</li>
      </ul>
      <p>The generator lays all of this out for you, so you just fill in the blanks.</p>

      <h2>Tips to get paid faster</h2>
      <ul>
        <li><strong>Number your invoices</strong> (001, 002…) so they&apos;re easy to track and reference.</li>
        <li><strong>Set a clear due date</strong> — &ldquo;due in 14 days&rdquo; beats &ldquo;due on receipt&rdquo; for prompt payment.</li>
        <li><strong>Spell out payment methods</strong> in the notes.</li>
        <li><strong>Keep a copy</strong> — download and file every invoice you send.</li>
      </ul>

      <h2>Related tools</h2>
      <p>
        Tracking invoices in a spreadsheet? Turn one into a shareable PDF with{" "}
        <Link href="/tools/excel-to-pdf">Excel to PDF</Link>, or move data between formats with{" "}
        <Link href="/tools/csv-to-xlsx">CSV to Excel</Link>. Need a plain document instead? Try{" "}
        <Link href="/tools/text-to-pdf">Text to PDF</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Is it really free?</h3>
      <p>Yes — the invoice generator is free and builds the PDF in your browser. No sign-up, nothing uploaded.</p>
      <h3>Can I use my own currency?</h3>
      <p>Yes — set any currency symbol, and the subtotal, tax, and total are calculated automatically.</p>
      <h3>Is my invoice data private?</h3>
      <p>Completely — the PDF is generated on your device, so the details you enter never leave your browser.</p>
    </>
  );
}
