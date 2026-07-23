import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-save-a-webpage-as-pdf",
  title: "How to Save a Web Page as a PDF",
  description:
    "Archive any web page as a clean PDF — great for articles, receipts, and documentation. A quick guide to converting a URL to PDF.",
  keywords: [
    "save webpage as pdf",
    "url to pdf",
    "webpage to pdf",
    "save web page as pdf",
    "website to pdf",
  ],
  date: "2026-07-23",
  readingMinutes: 3,
  tags: ["PDF", "Productivity"],
  related: ["url-to-pdf", "merge-pdf", "compress-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Web pages change and disappear. Saving one as a PDF gives you a permanent, shareable copy —
        perfect for archiving an article, keeping an order confirmation, or attaching documentation to a
        ticket.
      </p>

      <h2>Convert a URL to PDF</h2>
      <p>
        Use the <Link href="/tools/url-to-pdf">URL to PDF tool</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/url-to-pdf">URL to PDF</Link>.</li>
        <li>Paste the full page address (starting with https://).</li>
        <li>Convert and download the PDF.</li>
      </ol>
      <p>
        The page is rendered with a real browser engine, so the PDF captures the <strong>entire</strong>{" "}
        page — not just the part visible on screen.
      </p>

      <h2>Why not just use the browser&apos;s print?</h2>
      <p>
        Browser &quot;Print → Save as PDF&quot; works for quick jobs, but it often clips content, includes
        headers/footers, and varies by browser. A dedicated URL-to-PDF renderer gives a consistent,
        full-page result you can automate and repeat.
      </p>

      <h2>Handy follow-ups</h2>
      <ul>
        <li>Saving several pages? Convert each, then <Link href="/tools/merge-pdf">merge them into one PDF</Link>.</li>
        <li>PDF too big to email? <Link href="/tools/compress-pdf">Compress it</Link>.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Can it capture pages behind a login?</h3>
      <p>No — it can only render publicly accessible URLs, since the page is fetched from our server.</p>
      <h3>Does it get the whole page?</h3>
      <p>Yes — the full rendered page is captured, not just the visible viewport.</p>
    </>
  );
}
