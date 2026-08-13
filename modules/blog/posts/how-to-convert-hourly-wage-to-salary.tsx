import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-hourly-wage-to-salary",
  title: "How to Convert Hourly Wage to Annual Salary",
  description:
    "How to convert an hourly wage to a yearly salary (and back) — the simple formula, the 2,080-hours rule, and how part-time hours change the math.",
  keywords: [
    "hourly to salary",
    "hourly wage to annual salary",
    "convert hourly to yearly",
    "salary to hourly",
    "annual salary calculator",
  ],
  date: "2026-08-13",
  readingMinutes: 4,
  tags: ["Finance", "Calculators"],
  related: ["salary-calculator", "percentage-calculator", "loan-calculator"],
};

export function Body() {
  return (
    <>
      <p>
        Converting between an hourly wage and an annual salary is useful when comparing job offers, budgeting, or
        quoting freelance work. The math is simple once you fix two numbers: your <strong>hours per week</strong>{" "}
        and the <strong>weeks you work per year</strong>.
      </p>

      <h2>The formula</h2>
      <p>
        <code>Annual salary = hourly rate × hours per week × weeks per year</code>
      </p>
      <p>
        For a standard full-time job — 40 hours a week, 52 weeks a year — that&apos;s{" "}
        <strong>hourly × 2,080</strong>. So $25/hour works out to roughly <strong>$52,000</strong> a year
        (25 × 2,080).
      </p>

      <h2>Going the other way</h2>
      <p>
        To convert a salary back to an hourly rate, divide by the same total hours:{" "}
        <code>hourly = annual ÷ (hours per week × weeks per year)</code>. A $60,000 salary at 40 hours ÷ 2,080 ≈
        <strong> $28.85/hour</strong>.
      </p>

      <h2>Do it instantly</h2>
      <p>
        Skip the arithmetic — our <Link href="/tools/salary-calculator">salary calculator</Link> converts any
        amount across hourly, daily, weekly, bi-weekly, monthly, and yearly at once. Just set your hours per week
        and weeks per year and every figure updates.
      </p>

      <h2>Watch the assumptions</h2>
      <ul>
        <li><strong>Part-time or overtime</strong> — change the hours per week and the annual figure shifts a lot.</li>
        <li><strong>Unpaid time off</strong> — if you don&apos;t work all 52 weeks, lower the weeks per year.</li>
        <li>
          <strong>Gross, not take-home</strong> — these are pre-tax figures. Your actual paycheck is lower after
          income tax and deductions, which vary by country.
        </li>
      </ul>

      <h2>FAQ</h2>
      <h3>Why 2,080 hours?</h3>
      <p>It&apos;s 40 hours × 52 weeks — the standard full-time year used for most salary conversions.</p>
      <h3>Does this include tax?</h3>
      <p>No — it&apos;s gross pay before tax. Deductions depend on where you live and your personal situation.</p>
      <h3>How do I convert a monthly salary to hourly?</h3>
      <p>Multiply the monthly amount by 12 to get the annual salary, then divide by your yearly hours.</p>
    </>
  );
}
