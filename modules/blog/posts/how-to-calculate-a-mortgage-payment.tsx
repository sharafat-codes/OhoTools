import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-calculate-a-mortgage-payment",
  title: "How to Calculate a Mortgage Payment",
  description:
    "How to calculate your monthly mortgage payment — the principal & interest formula, plus taxes, insurance, PMI, and HOA (PITI), with a worked example.",
  keywords: [
    "how to calculate mortgage payment",
    "mortgage payment formula",
    "monthly mortgage payment",
    "piti",
    "amortization",
  ],
  date: "2026-08-13",
  readingMinutes: 6,
  tags: ["Finance", "Calculators"],
  related: ["mortgage-calculator", "loan-calculator", "compound-interest-calculator"],
};

export function Body() {
  return (
    <>
      <p>
        Your monthly mortgage payment is more than just paying back the loan. Lenders call the full figure{" "}
        <strong>PITI</strong> — <strong>P</strong>rincipal, <strong>I</strong>nterest,{" "}
        <strong>T</strong>axes, and <strong>I</strong>nsurance — and there&apos;s often an HOA fee on top.
      </p>

      <h2>The principal &amp; interest formula</h2>
      <p>The core of the payment is the amortized principal and interest (P&amp;I):</p>
      <p>
        <code>M = P × r × (1 + r)^n / ((1 + r)^n − 1)</code>
      </p>
      <ul>
        <li><strong>M</strong> — monthly principal &amp; interest payment</li>
        <li><strong>P</strong> — loan amount (home price minus down payment)</li>
        <li><strong>r</strong> — monthly interest rate (annual rate ÷ 12 ÷ 100)</li>
        <li><strong>n</strong> — total number of payments (years × 12)</li>
      </ul>

      <h2>A worked example</h2>
      <p>
        Say you buy a $350,000 home with 20% down ($70,000), leaving a $280,000 loan at 6.5% for 30 years.
        The monthly rate is 0.065 ÷ 12 ≈ 0.00542, over 360 payments. Plugging in gives a P&amp;I payment of
        roughly <strong>$1,770/month</strong>. Add, say, $300 property tax and $100 insurance per month and
        your real payment is closer to <strong>$2,170</strong>.
      </p>

      <h2>Don&apos;t forget the extras</h2>
      <ul>
        <li><strong>Property tax</strong> — usually a yearly amount, divided by 12.</li>
        <li><strong>Home insurance</strong> — also yearly, divided by 12.</li>
        <li><strong>PMI</strong> — private mortgage insurance, typically required if you put down less than 20%.</li>
        <li><strong>HOA</strong> — monthly homeowners-association dues, if any.</li>
      </ul>

      <h2>Calculate it in seconds</h2>
      <p>
        Instead of doing the math by hand, use our{" "}
        <Link href="/tools/mortgage-calculator">mortgage calculator</Link>. Enter the price, down payment, rate,
        and term (plus taxes, insurance, and HOA) to see your full monthly payment, the total interest over the
        life of the loan, and a year-by-year amortization schedule.
      </p>

      <h2>How much house can you afford?</h2>
      <p>
        A common guideline is the <strong>28/36 rule</strong>: keep your housing payment under 28% of gross
        monthly income, and total debt payments under 36%. For a quick income or interest sanity-check, the{" "}
        <Link href="/tools/percentage-calculator">percentage calculator</Link> helps.
      </p>

      <h2>FAQ</h2>
      <h3>Why is so much of my early payment interest?</h3>
      <p>
        With amortization, interest is charged on the remaining balance, which is highest at the start. Over
        time the split tips toward principal — the amortization schedule shows exactly how.
      </p>
      <h3>Does a bigger down payment lower my payment?</h3>
      <p>Yes — it reduces the loan amount, lowers the monthly payment, and can remove PMI once you reach 20% down.</p>
      <h3>What&apos;s the difference between this and a loan calculator?</h3>
      <p>
        A basic <Link href="/tools/loan-calculator">loan calculator</Link> covers principal and interest; a
        mortgage calculator also folds in taxes, insurance, and HOA for the true monthly cost.
      </p>
    </>
  );
}
