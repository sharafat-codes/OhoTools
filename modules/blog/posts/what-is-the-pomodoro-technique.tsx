import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "what-is-the-pomodoro-technique",
  title: "What Is the Pomodoro Technique?",
  description:
    "The Pomodoro Technique explained — how the 25/5 focus method works, why it helps you concentrate, and a free online timer to run it. Plus tips that actually stick.",
  keywords: [
    "pomodoro technique",
    "what is the pomodoro technique",
    "pomodoro timer",
    "25 minute focus",
    "how to focus",
  ],
  date: "2026-07-29",
  readingMinutes: 4,
  tags: ["Productivity"],
  related: ["pomodoro-timer", "countdown-timer", "stopwatch", "online-notepad"],
};

export function Body() {
  return (
    <>
      <p>
        The Pomodoro Technique is a simple time-management method: work in a focused sprint, take a short
        break, and repeat. It works because a ticking timer creates a little urgency, and the breaks keep you
        from burning out. Here&apos;s how to run it — and a free timer that handles the cycle for you.
      </p>

      <h2>How it works</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Pick one task.</li>
        <li>Work for <strong>25 minutes</strong> — no switching, no checking your phone.</li>
        <li>Take a <strong>5-minute break</strong>.</li>
        <li>Repeat. After four sprints, take a longer 15–30 minute break.</li>
      </ol>
      <p>
        The <Link href="/tools/pomodoro-timer">Pomodoro Timer</Link> runs this automatically — it chimes
        between phases and counts your rounds, and you can adjust the focus and break lengths.
      </p>

      <h2>Why it helps</h2>
      <ul>
        <li><strong>Beats procrastination</strong> — &ldquo;just 25 minutes&rdquo; is easy to start.</li>
        <li><strong>Protects focus</strong> — one task per sprint means fewer context switches.</li>
        <li><strong>Prevents burnout</strong> — regular breaks keep your energy up over a long session.</li>
        <li><strong>Makes work visible</strong> — counting sprints shows how long things actually take.</li>
      </ul>

      <h2>Tips that make it stick</h2>
      <ul>
        <li><strong>Write the task down first</strong> — keep a quick list in the <Link href="/tools/online-notepad">notepad</Link> so you know exactly what each sprint is for.</li>
        <li><strong>Park distractions</strong> — jot down anything that pops into your head and deal with it on the break.</li>
        <li><strong>Adjust the lengths</strong> — 25/5 is the classic, but 50/10 suits deep work for some people.</li>
        <li><strong>Actually take the break</strong> — stand up, look away from the screen.</li>
      </ul>

      <h2>Related timers</h2>
      <p>
        Just need a plain timer? Use the <Link href="/tools/countdown-timer">Countdown Timer</Link>. Timing
        something instead? The <Link href="/tools/stopwatch">Stopwatch</Link> has laps.
      </p>

      <h2>FAQ</h2>
      <h3>Why 25 minutes?</h3>
      <p>It&apos;s long enough to make progress but short enough to stay fully focused. Adjust it if a different length works better for you.</p>
      <h3>Is the Pomodoro timer free?</h3>
      <p>Yes — it runs entirely in your browser, no sign-up, with a chime between phases.</p>
    </>
  );
}
