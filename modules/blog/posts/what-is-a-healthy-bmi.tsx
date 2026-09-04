import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "what-is-a-healthy-bmi",
  title: "What Is a Healthy BMI? (Chart + How to Read It)",
  description:
    "What BMI means, the standard weight categories, a quick reference chart, and the limits of BMI — plus a free calculator to find yours instantly.",
  keywords: [
    "what is a healthy bmi",
    "bmi chart",
    "normal bmi range",
    "bmi calculator",
    "healthy weight",
    "bmi categories",
  ],
  date: "2026-09-04",
  readingMinutes: 4,
  tags: ["Health"],
  related: ["bmi-calculator", "calorie-calculator", "ideal-weight-calculator", "bmr-calculator"],
};

export function Body() {
  return (
    <>
      <p>
        BMI (Body Mass Index) is a quick screening number that compares your weight to your height. It
        won&apos;t tell the whole story, but it&apos;s a useful starting point. Here&apos;s what the numbers
        mean and how to read yours.
      </p>

      <h2>Find your number first</h2>
      <p>
        Enter your height and weight in the <Link href="/tools/bmi-calculator">BMI Calculator</Link> (metric
        or imperial) to get your BMI instantly, then match it to the categories below.
      </p>

      <h2>The standard BMI categories (adults)</h2>
      <ul>
        <li><strong>Under 18.5</strong> — underweight</li>
        <li><strong>18.5 – 24.9</strong> — healthy weight</li>
        <li><strong>25.0 – 29.9</strong> — overweight</li>
        <li><strong>30.0 and above</strong> — obesity</li>
      </ul>
      <p>So a &ldquo;healthy&rdquo; BMI for most adults falls between <strong>18.5 and 24.9</strong>.</p>

      <h2>How BMI is calculated</h2>
      <p>
        BMI = weight (kg) ÷ height (m)². In imperial units it&apos;s 703 × weight (lb) ÷ height (in)². The
        calculator handles both for you — no math needed.
      </p>

      <h2>Where BMI falls short</h2>
      <p>BMI is a rough screen, not a diagnosis. It doesn&apos;t account for:</p>
      <ul>
        <li><strong>Muscle vs. fat</strong> — athletes can read &ldquo;overweight&rdquo; despite low body fat.</li>
        <li><strong>Fat distribution</strong> — where you carry weight matters for health risk.</li>
        <li><strong>Age, sex, and ethnicity</strong> — healthy ranges can differ.</li>
        <li><strong>Children and teens</strong> — they use age- and sex-specific percentiles, not adult ranges.</li>
      </ul>
      <p className="text-sm text-muted-foreground">
        This is general information, not medical advice. For guidance about your weight and health, talk to a
        doctor.
      </p>

      <h2>Related tools</h2>
      <p>
        See your <Link href="/tools/ideal-weight-calculator">ideal weight range</Link>, estimate your{" "}
        <Link href="/tools/bmr-calculator">daily calorie needs (BMR)</Link>, or plan intake with the{" "}
        <Link href="/tools/calorie-calculator">Calorie Calculator</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>What is a healthy BMI?</h3>
      <p>For most adults, a BMI between 18.5 and 24.9 is considered healthy.</p>
      <h3>Is BMI accurate?</h3>
      <p>It&apos;s a useful screening tool but imperfect — it can misjudge very muscular people and doesn&apos;t measure body fat directly.</p>
      <h3>Does BMI work for children?</h3>
      <p>No — children and teens are assessed with age- and sex-specific percentile charts, not the adult ranges.</p>
    </>
  );
}
