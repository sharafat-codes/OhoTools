import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-calculate-sales-tax",
  title: "How to Calculate Sales Tax (Add and Reverse)",
  description:
    "The simple formulas to add sales tax to a price and to reverse it out of a total, with worked examples — plus a free calculator that does both.",
  keywords: [
    "how to calculate sales tax",
    "sales tax formula",
    "add sales tax",
    "reverse sales tax",
    "sales tax calculator",
    "price plus tax",
  ],
  date: "2026-09-10",
  readingMinutes: 3,
  tags: ["Finance"],
  related: ["sales-tax-calculator", "discount-calculator", "percentage-calculator"],
};

export function Body() {
  return (
    <>
      <p>
        Sales tax is a percentage added to a price. Whether you&apos;re adding it to a pre-tax amount or
        working out the tax already baked into a total, it&apos;s two short formulas.
      </p>

      <h2>Let the tool do it</h2>
      <p>
        The <Link href="/tools/sales-tax-calculator">Sales Tax Calculator</Link> handles both directions —
        add tax to a price, or remove it from a total — instantly, in your browser.
      </p>

      <h2>Adding sales tax to a price</h2>
      <p><strong>Tax = price × (rate ÷ 100)</strong>, then <strong>total = price + tax</strong>.</p>
      <p>Example, a $100 item at 8.25%:</p>
      <ul>
        <li>Tax = 100 × 0.0825 = <strong>$8.25</strong></li>
        <li>Total = 100 + 8.25 = <strong>$108.25</strong></li>
      </ul>

      <h2>Reversing sales tax out of a total</h2>
      <p>If you have a tax-inclusive total and want the pre-tax price: <strong>price = total ÷ (1 + rate ÷ 100)</strong>.</p>
      <p>Example, a $108.25 total at 8.25%:</p>
      <ul>
        <li>Price = 108.25 ÷ 1.0825 = <strong>$100.00</strong></li>
        <li>Tax = 108.25 − 100 = <strong>$8.25</strong></li>
      </ul>

      <h2>Which rate should I use?</h2>
      <p>
        Use your <strong>combined</strong> local rate — state plus any city or county tax. Rates vary a lot by
        location, so check your area&apos;s current rate before relying on a figure.
      </p>

      <h2>FAQ</h2>
      <h3>How do I find the tax on a total that already includes it?</h3>
      <p>Divide the total by (1 + rate as a decimal) to get the pre-tax price, then subtract to get the tax. The calculator&apos;s &ldquo;Remove tax&rdquo; tab does this.</p>
      <h3>Is VAT/GST the same?</h3>
      <p>The math is the same. For VAT/GST specifically, use our <Link href="/tools/gst-vat-calculator">GST/VAT Calculator</Link>.</p>
    </>
  );
}
