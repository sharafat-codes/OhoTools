import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-many-calories-should-i-eat",
  title: "How Many Calories Should I Eat a Day?",
  description:
    "How to work out your daily calorie needs from your BMR and activity level — for maintaining, losing, or gaining weight — plus a free calculator to do it for you.",
  keywords: [
    "how many calories should i eat",
    "daily calorie needs",
    "calorie calculator",
    "calories to lose weight",
    "maintenance calories",
    "tdee",
  ],
  date: "2026-09-04",
  readingMinutes: 5,
  tags: ["Health"],
  related: ["calorie-calculator", "bmr-calculator", "bmi-calculator", "ideal-weight-calculator"],
};

export function Body() {
  return (
    <>
      <p>
        Your daily calorie target depends on your body, your activity, and your goal. The quickest way is to
        start from your BMR, adjust for how active you are, then nudge up or down for your goal. Here&apos;s
        how it works — and a tool that does the math for you.
      </p>

      <h2>Get your number</h2>
      <p>
        Enter your age, sex, height, weight, and activity level in the{" "}
        <Link href="/tools/calorie-calculator">Calorie Calculator</Link> to get personalized targets for
        maintaining, losing, and gaining weight. Prefer just the baseline? The{" "}
        <Link href="/tools/bmr-calculator">BMR Calculator</Link> gives your resting burn.
      </p>

      <h2>The two numbers that matter</h2>
      <ul>
        <li><strong>BMR (Basal Metabolic Rate)</strong> — calories your body burns at complete rest, just to stay alive.</li>
        <li><strong>TDEE (Total Daily Energy Expenditure)</strong> — your BMR multiplied by an activity factor. This is your maintenance level.</li>
      </ul>

      <h2>Activity multipliers (applied to BMR)</h2>
      <ul>
        <li><strong>Sedentary</strong> (little exercise): × 1.2</li>
        <li><strong>Lightly active</strong> (1–3 days/week): × 1.375</li>
        <li><strong>Moderately active</strong> (3–5 days/week): × 1.55</li>
        <li><strong>Very active</strong> (6–7 days/week): × 1.725</li>
        <li><strong>Extra active</strong> (physical job or 2× training): × 1.9</li>
      </ul>

      <h2>Adjust for your goal</h2>
      <ul>
        <li><strong>Maintain weight:</strong> eat around your TDEE.</li>
        <li><strong>Lose weight:</strong> subtract about 500 calories/day for roughly 0.5 kg (1 lb) a week.</li>
        <li><strong>Gain weight:</strong> add about 300–500 calories/day, paired with strength training.</li>
      </ul>
      <p className="text-sm text-muted-foreground">
        These are estimates for general guidance, not medical or dietary advice. For a plan tailored to you,
        speak to a doctor or registered dietitian.
      </p>

      <h2>Related tools</h2>
      <p>
        Check your <Link href="/tools/bmi-calculator">BMI</Link> and{" "}
        <Link href="/tools/ideal-weight-calculator">ideal weight range</Link> to set a sensible goal alongside
        your calorie target.
      </p>

      <h2>FAQ</h2>
      <h3>How many calories to lose weight?</h3>
      <p>A deficit of about 500 calories a day below your maintenance (TDEE) leads to roughly half a kilo (one pound) of loss per week.</p>
      <h3>What&apos;s the difference between BMR and TDEE?</h3>
      <p>BMR is what you burn at rest; TDEE is BMR plus your daily activity — TDEE is your true maintenance level.</p>
      <h3>Is the calorie calculator free?</h3>
      <p>Yes — it runs in your browser, free and with no sign-up.</p>
    </>
  );
}
