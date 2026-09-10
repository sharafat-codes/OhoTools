import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "mean-median-mode-explained",
  title: "Mean, Median & Mode Explained (With Examples)",
  description:
    "What mean, median, mode, and range are, how to calculate each with worked examples, when to use which — plus a free calculator that does them all at once.",
  keywords: [
    "mean median mode",
    "how to calculate average",
    "how to find the median",
    "what is the mode",
    "average calculator",
    "mean median mode range",
  ],
  date: "2026-09-10",
  readingMinutes: 4,
  tags: ["Education"],
  related: ["average-calculator", "percentage-calculator", "gpa-calculator"],
};

export function Body() {
  return (
    <>
      <p>
        &ldquo;Average&rdquo; can mean three different things — mean, median, or mode. Each tells you
        something different about a set of numbers. Here&apos;s what they are and how to calculate them.
      </p>

      <h2>Calculate them all at once</h2>
      <p>
        Paste your numbers into the <Link href="/tools/average-calculator">Average Calculator</Link> to get
        the mean, median, mode, range, sum, and count instantly — no manual math.
      </p>

      <p>We&apos;ll use this example set: <strong>10, 15, 15, 20, 40</strong>.</p>

      <h2>Mean (the everyday average)</h2>
      <p>Add all the numbers, then divide by how many there are.</p>
      <p>(10 + 15 + 15 + 20 + 40) ÷ 5 = 100 ÷ 5 = <strong>20</strong>.</p>

      <h2>Median (the middle value)</h2>
      <p>Sort the numbers and take the middle one. With an even count, average the two middle values.</p>
      <p>Sorted: 10, 15, <strong>15</strong>, 20, 40 → the median is <strong>15</strong>.</p>

      <h2>Mode (the most common value)</h2>
      <p>The value that appears most often. 15 appears twice, everything else once → the mode is <strong>15</strong>. If nothing repeats, there is no mode.</p>

      <h2>Range (the spread)</h2>
      <p>The largest value minus the smallest: 40 − 10 = <strong>30</strong>.</p>

      <h2>When to use which</h2>
      <ul>
        <li><strong>Mean</strong> — good for evenly spread data, but a single outlier can skew it.</li>
        <li><strong>Median</strong> — better when there are outliers (e.g. income or house prices), since it isn&apos;t pulled by extremes.</li>
        <li><strong>Mode</strong> — useful for categories or finding the most common value.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Can there be more than one mode?</h3>
      <p>Yes — if several values tie for most frequent, all of them are modes.</p>
      <h3>What&apos;s the difference between mean and average?</h3>
      <p>&ldquo;Average&rdquo; usually means the mean, but median and mode are also types of average.</p>
    </>
  );
}
