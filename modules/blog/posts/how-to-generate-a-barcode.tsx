import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-generate-a-barcode",
  title: "How to Generate a Barcode (Code 128, EAN & UPC)",
  description:
    "How to generate a barcode online for free — which format to choose (Code 128, EAN-13, UPC-A), and how to download it as a PNG or SVG for labels.",
  keywords: [
    "how to generate a barcode",
    "barcode generator",
    "code 128",
    "ean-13 barcode",
    "upc barcode",
  ],
  date: "2026-08-13",
  readingMinutes: 4,
  tags: ["Generators", "Business"],
  related: ["barcode-generator", "qr-code", "wifi-qr"],
};

export function Body() {
  return (
    <>
      <p>
        Barcodes turn a number or short text into a scannable pattern for products, inventory, assets, and
        shipping. Generating one is quick — the main decision is which <strong>format (symbology)</strong> to
        use, since each is designed for a different job.
      </p>

      <h2>Generate one now</h2>
      <p>
        Use our <Link href="/tools/barcode-generator">barcode generator</Link>: pick a format, type your value,
        adjust the size, and download a crisp <strong>PNG</strong> or a scalable <strong>SVG</strong> for print.
        It runs entirely in your browser.
      </p>

      <h2>Which barcode format should I use?</h2>
      <ul>
        <li><strong>Code 128</strong> — the most versatile 1D barcode; encodes any text and numbers. Great for internal inventory, assets, and general labels.</li>
        <li><strong>EAN-13</strong> — the 13-digit retail barcode used on products worldwide.</li>
        <li><strong>UPC-A</strong> — the 12-digit retail barcode common in North America.</li>
        <li><strong>Code 39</strong> — older, widely supported; used in logistics and ID cards.</li>
        <li><strong>ITF-14</strong> — for shipping cartons and cases.</li>
        <li><strong>Data Matrix / PDF417</strong> — 2D codes that hold much more data in a small space.</li>
      </ul>

      <h2>PNG or SVG?</h2>
      <p>
        Choose <strong>SVG</strong> for anything you&apos;ll print — it&apos;s vector, so it stays razor-sharp at
        any size, which matters for reliable scanning. Use <strong>PNG</strong> for quick on-screen use or when a
        tool only accepts raster images.
      </p>

      <h2>Tips for scannable barcodes</h2>
      <ul>
        <li>Keep a clear white margin (quiet zone) around the barcode — don&apos;t crop it tight.</li>
        <li>Make sure your value matches the format&apos;s rules (EAN-13 needs 12–13 digits, UPC-A needs 11–12).</li>
        <li>Print with good contrast — dark bars on a white background scan best.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Do I need to pay or register?</h3>
      <p>
        Generating a barcode is free. However, <strong>selling</strong> a product in retail usually requires an
        officially registered number (a GS1-issued UPC/EAN) — the generator makes the image, not the ownership
        of the number.
      </p>
      <h3>What&apos;s the difference between a barcode and a QR code?</h3>
      <p>
        A barcode is usually 1D and stores a short number; a <Link href="/tools/qr-code">QR code</Link> is 2D and
        can hold URLs and much more text. Use QR for links, barcodes for product/inventory numbers.
      </p>
      <h3>Is my data uploaded?</h3>
      <p>No — barcodes are generated locally in your browser.</p>
    </>
  );
}
