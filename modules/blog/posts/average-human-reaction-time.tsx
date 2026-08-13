import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "average-human-reaction-time",
  title: "What Is the Average Human Reaction Time?",
  description:
    "The average human reaction time is about 250 ms to a visual cue. What's a fast reaction time, what affects it, and how to test and improve yours.",
  keywords: [
    "average human reaction time",
    "average reaction time",
    "reaction time",
    "fast reaction time",
    "how fast is human reaction",
  ],
  date: "2026-08-13",
  readingMinutes: 4,
  tags: ["Games", "Science"],
  related: ["reaction-time-test", "cps-test", "keyboard-tester"],
};

export function Body() {
  return (
    <>
      <p>
        The average human <strong>reaction time to a visual stimulus is about 250 milliseconds</strong> (a
        quarter of a second). Reactions to sound are a little faster (~170 ms) and to touch faster still, because
        those signals reach the brain more quickly.
      </p>

      <h2>What counts as fast?</h2>
      <ul>
        <li><strong>Under 200 ms</strong> — excellent; typical of trained gamers and athletes.</li>
        <li><strong>200–250 ms</strong> — above average.</li>
        <li><strong>250–300 ms</strong> — average range for most adults.</li>
        <li><strong>Over 300 ms</strong> — slower; often just tiredness or distraction on the day.</li>
      </ul>

      <h2>Test your reaction time</h2>
      <p>
        Try our <Link href="/tools/reaction-time-test">reaction time test</Link>: wait for the box to turn green,
        then click as fast as you can. It measures your time in milliseconds with a high-resolution timer and
        averages your last few attempts — the fairest way to see your true number.
      </p>

      <h2>What affects your reaction time?</h2>
      <ul>
        <li><strong>Sleep and fatigue</strong> — being tired slows you down more than almost anything else.</li>
        <li><strong>Age</strong> — reaction time is fastest in your late teens to late twenties, then gradually rises.</li>
        <li><strong>Caffeine and focus</strong> — moderate caffeine and full attention both help.</li>
        <li><strong>Hardware</strong> — monitor refresh rate and input lag add real milliseconds, so gaming gear genuinely matters.</li>
      </ul>

      <h2>How to improve it</h2>
      <p>
        You can shave off some time with practice, good sleep, and reducing input lag (a higher-refresh monitor,
        wired mouse). Warm up first, and test several times — a single try is noisy. For a different challenge,
        measure your click speed with the <Link href="/tools/cps-test">CPS test</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Why did the test say I clicked too soon?</h3>
      <p>
        Clicking before the box turns green is a false start — it means you anticipated rather than reacted, so
        the test resets to keep your score honest.
      </p>
      <h3>What is a pro gamer&apos;s reaction time?</h3>
      <p>Top competitive players often land in the 150–200 ms range, helped by practice and low-latency setups.</p>
      <h3>Is reaction time the same as reflexes?</h3>
      <p>Closely related — a true reflex is involuntary, while reaction time includes the tiny decision to act.</p>
    </>
  );
}
