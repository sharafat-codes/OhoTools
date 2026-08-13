import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-calculate-your-due-date",
  title: "How to Calculate Your Due Date",
  description:
    "How to calculate your pregnancy due date from your last period, conception, or IVF transfer — plus how gestational age and trimesters work.",
  keywords: [
    "how to calculate due date",
    "due date calculator",
    "pregnancy due date",
    "how far along am i",
    "gestational age",
  ],
  date: "2026-08-13",
  readingMinutes: 5,
  tags: ["Health", "Calculators"],
  related: ["due-date-calculator", "age-calculator", "date-difference"],
};

export function Body() {
  return (
    <>
      <p>
        Your estimated due date (EDD) is the day your baby is expected to arrive — about{" "}
        <strong>40 weeks</strong> from the first day of your last period. Only about 1 in 20 babies actually
        arrives on the exact date, so treat it as a helpful estimate rather than a deadline.
      </p>

      <h2>Method 1: From your last period (Naegele&apos;s rule)</h2>
      <p>
        The classic method adds <strong>280 days (40 weeks)</strong> to the first day of your{" "}
        <strong>last menstrual period (LMP)</strong>. A common shortcut is: take the first day of your last
        period, subtract three months, and add seven days.
      </p>
      <p>
        This assumes a 28-day cycle with ovulation on day 14. If your cycle is longer or shorter, ovulation
        shifts, so the due date should be adjusted by the difference — a good calculator does this for you.
      </p>

      <h2>Method 2: From conception date</h2>
      <p>
        If you know your conception (or ovulation) date, the due date is about <strong>266 days</strong> later,
        since that skips the roughly two weeks between your last period and ovulation.
      </p>

      <h2>Method 3: From an IVF transfer</h2>
      <p>
        With IVF the timing is precise. For a day-5 (blastocyst) transfer the due date is about{" "}
        <strong>261 days</strong> after transfer; for a day-3 embryo it&apos;s about <strong>263 days</strong>.
      </p>

      <h2>Calculate it instantly</h2>
      <p>
        Rather than counting on a calendar, use our{" "}
        <Link href="/tools/due-date-calculator">due date calculator</Link>. Pick your method, enter the date
        (and your cycle length if using your last period), and it shows your estimated due date, how far along
        you are in weeks and days, your trimester, and your conception date — all worked out privately in your
        browser.
      </p>

      <h2>How gestational age and trimesters work</h2>
      <ul>
        <li><strong>Gestational age</strong> is counted from your last period, not conception, so you&apos;re considered &quot;2 weeks pregnant&quot; at the moment of conception.</li>
        <li><strong>First trimester:</strong> weeks 1–13.</li>
        <li><strong>Second trimester:</strong> weeks 14–27.</li>
        <li><strong>Third trimester:</strong> weeks 28–40+.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>How accurate is a due date?</h3>
      <p>
        It&apos;s an estimate. An early ultrasound (dating scan) is the most accurate way to confirm or adjust
        it, and your provider&apos;s date takes precedence.
      </p>
      <h3>What if I don&apos;t know my last period date?</h3>
      <p>Use the conception or IVF method, or ask your provider for a dating ultrasound.</p>
      <h3>Is this medical advice?</h3>
      <p>No — it&apos;s general information to estimate your due date. Always follow your healthcare provider&apos;s guidance.</p>
    </>
  );
}
