import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-add-and-subtract-time",
  title: "How to Add and Subtract Time (Free Hours Calculator)",
  description:
    "Add or subtract hours, minutes, and seconds, or find the duration between two times — free and instant. Perfect for timesheets, cooking, and scheduling.",
  keywords: [
    "add time calculator",
    "hours calculator",
    "subtract time",
    "time duration calculator",
    "add hours and minutes",
  ],
  date: "2026-07-31",
  readingMinutes: 3,
  tags: ["Calculators"],
  related: ["time-calculator", "date-difference", "age-calculator", "timestamp-converter"],
};

export function Body() {
  return (
    <>
      <p>
        Time math is fiddly because it&apos;s base-60, not base-10 — 90 minutes isn&apos;t 1.9 hours, it&apos;s
        1 hour 30 minutes. Whether you&apos;re totaling a timesheet, working out a cooking schedule, or
        figuring out how long a shift ran, a calculator that speaks hours-minutes-seconds saves the mental
        gymnastics. Here&apos;s how to add and subtract time for free.
      </p>

      <h2>Add or subtract a duration</h2>
      <p>
        Open the <Link href="/tools/time-calculator">Time Calculator</Link> and use the{" "}
        <strong>Add / Subtract</strong> tab:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Enter the first time as hours, minutes, and seconds.</li>
        <li>Choose <strong>+</strong> or <strong>−</strong>.</li>
        <li>Enter the second time — the result updates instantly (and can exceed 24 hours for timesheets).</li>
      </ol>

      <h2>Find the duration between two times</h2>
      <p>
        Switch to the <strong>Duration</strong> tab, enter a start and end time, and you&apos;ll get the gap
        between them. If the end is earlier than the start, it&apos;s treated as the next day — handy for
        overnight shifts.
      </p>

      <h2>Common uses</h2>
      <ul>
        <li><strong>Timesheets</strong> — add up hours worked across a week.</li>
        <li><strong>Cooking</strong> — work out when to start so everything&apos;s ready together.</li>
        <li><strong>Scheduling</strong> — how long between two events, or when something ends.</li>
      </ul>

      <h2>Working with dates instead?</h2>
      <p>
        If you need days rather than hours, the <Link href="/tools/date-difference">Date Difference</Link>{" "}
        calculator counts days between two dates, and the <Link href="/tools/age-calculator">Age Calculator</Link>{" "}
        gives an exact age. Browse all the <Link href="/tools/calculators">calculators</Link> in one place.
      </p>

      <h2>FAQ</h2>
      <h3>Can it total more than 24 hours?</h3>
      <p>Yes — results can exceed 24 hours, which is what you want for weekly timesheets.</p>
      <h3>Does it handle overnight (across midnight)?</h3>
      <p>Yes — in Duration mode, an end time earlier than the start is treated as the next day.</p>
      <h3>Is it free?</h3>
      <p>Yes, free and instant, with no sign-up.</p>
    </>
  );
}
