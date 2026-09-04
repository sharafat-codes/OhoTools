import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-calculate-gpa",
  title: "How to Calculate Your GPA (Step by Step)",
  description:
    "How GPA works, the standard 4.0 grade-point scale, weighted vs. unweighted GPA, and a worked example — plus a free calculator to do it instantly.",
  keywords: [
    "how to calculate gpa",
    "gpa calculator",
    "gpa scale",
    "weighted gpa",
    "grade point average",
    "4.0 scale",
  ],
  date: "2026-09-04",
  readingMinutes: 4,
  tags: ["Education"],
  related: ["gpa-calculator", "final-grade-calculator", "percentage-calculator", "average-calculator"],
};

export function Body() {
  return (
    <>
      <p>
        GPA (Grade Point Average) turns your letter grades into a single number on a scale, usually up to 4.0.
        It&apos;s a credit-weighted average, so classes worth more credits count more. Here&apos;s how to work
        it out.
      </p>

      <h2>Do it instantly</h2>
      <p>
        Enter your courses, grades, and credit hours in the{" "}
        <Link href="/tools/gpa-calculator">GPA Calculator</Link> and it computes your GPA automatically — no
        manual math.
      </p>

      <h2>The standard 4.0 scale</h2>
      <ul>
        <li>A = 4.0 · A− = 3.7</li>
        <li>B+ = 3.3 · B = 3.0 · B− = 2.7</li>
        <li>C+ = 2.3 · C = 2.0 · C− = 1.7</li>
        <li>D+ = 1.3 · D = 1.0 · F = 0.0</li>
      </ul>
      <p>(Scales vary slightly by school — check yours if the points differ.)</p>

      <h2>The formula</h2>
      <p>
        <strong>GPA = (sum of grade points × credits) ÷ (total credits)</strong>. Multiply each course&apos;s
        grade point by its credit hours, add those up, then divide by the total credits.
      </p>

      <h2>Worked example</h2>
      <ul>
        <li>Math — A (4.0) × 3 credits = 12.0</li>
        <li>History — B (3.0) × 3 credits = 9.0</li>
        <li>Science — B+ (3.3) × 4 credits = 13.2</li>
      </ul>
      <p>Total points = 34.2; total credits = 10. GPA = 34.2 ÷ 10 = <strong>3.42</strong>.</p>

      <h2>Weighted vs. unweighted</h2>
      <ul>
        <li><strong>Unweighted</strong> — every class uses the standard 4.0 scale regardless of difficulty.</li>
        <li><strong>Weighted</strong> — honors/AP/IB classes get a bonus (often up to 5.0), rewarding harder courses.</li>
      </ul>

      <h2>Related tools</h2>
      <p>
        Need a specific score on a final? Use the{" "}
        <Link href="/tools/final-grade-calculator">Final Grade Calculator</Link>. For plain averages, the{" "}
        <Link href="/tools/average-calculator">Average Calculator</Link> and{" "}
        <Link href="/tools/percentage-calculator">Percentage Calculator</Link> help too.
      </p>

      <h2>FAQ</h2>
      <h3>What is a good GPA?</h3>
      <p>Generally, 3.5+ is strong, 3.0–3.5 is solid, and above 3.0 is often the bar for many programs — but it varies by school and goal.</p>
      <h3>How is GPA different from a percentage?</h3>
      <p>A percentage is your raw score in one class; GPA converts letter grades to points and averages them across courses, weighted by credits.</p>
      <h3>Is the GPA calculator free?</h3>
      <p>Yes — it runs entirely in your browser, free and with no sign-up.</p>
    </>
  );
}
