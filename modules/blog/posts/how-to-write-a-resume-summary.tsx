import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-a-resume-summary",
  title: "How to Write a Resume Summary (With Examples)",
  description:
    "The resume summary is the first thing a recruiter reads. Here's a simple formula, before-and-after examples for different careers, and a free generator to draft yours in seconds.",
  keywords: [
    "how to write a resume summary",
    "resume summary examples",
    "resume summary generator",
    "professional summary",
    "resume profile",
    "cv summary",
  ],
  date: "2026-09-04",
  readingMinutes: 5,
  tags: ["Career", "AI"],
  related: ["resume-summary-generator", "cover-letter-generator", "ai-paraphraser", "ai-humanizer"],
};

export function Body() {
  return (
    <>
      <p>
        A resume summary is the two-to-three-line paragraph at the top of your resume. Recruiters read it
        first and spend seconds deciding whether to keep going — so it has to land fast. Here&apos;s a simple
        formula, examples for different careers, and a free tool to draft yours.
      </p>

      <h2>The formula</h2>
      <p>A strong summary answers three things in one breath:</p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li><strong>Who you are</strong> — your role and years of experience.</li>
        <li><strong>What you&apos;re great at</strong> — one or two core strengths relevant to the job.</li>
        <li><strong>Proof</strong> — a concrete result, ideally with a number.</li>
      </ol>
      <p>
        Paste your experience into the{" "}
        <Link href="/tools/resume-summary-generator">Resume Summary Generator</Link>, add the job title
        you&apos;re targeting, and it drafts a tailored summary you can polish — a faster start than a blank
        page.
      </p>

      <h2>Before and after</h2>
      <p><strong>Weak:</strong> &ldquo;Hard-working professional looking for a new opportunity to grow.&rdquo;</p>
      <p>
        <strong>Strong:</strong> &ldquo;Digital marketer with 5 years&apos; experience in SEO and paid
        social. Grew organic traffic 140% in a year and cut cost-per-lead by a third. Looking to scale
        acquisition at a growth-stage SaaS.&rdquo;
      </p>
      <p>The difference is specifics: a role, real numbers, and a clear target.</p>

      <h2>Examples by career stage</h2>
      <ul>
        <li>
          <strong>Entry-level:</strong> lead with skills and education, not years. &ldquo;Recent CS graduate
          with internship experience in React and Node. Shipped a full-stack booking app used by 300+
          students.&rdquo;
        </li>
        <li>
          <strong>Mid-career:</strong> lead with impact. &ldquo;Operations manager with 7 years streamlining
          logistics. Reduced fulfillment time 25% across three warehouses.&rdquo;
        </li>
        <li>
          <strong>Career changer:</strong> connect the dots. &ldquo;Former teacher moving into UX, with a
          certificate in interaction design and two shipped case studies. Strong at research and turning
          feedback into clear designs.&rdquo;
        </li>
      </ul>

      <h2>Tips that make it work</h2>
      <ul>
        <li><strong>Tailor it to each job</strong> — mirror the language of the job description.</li>
        <li><strong>Use numbers</strong> — percentages, dollars, and counts are more persuasive than adjectives.</li>
        <li><strong>Keep it to 2–3 lines</strong> — it&apos;s a hook, not your life story.</li>
        <li><strong>Skip the pronoun</strong> — write &ldquo;Marketer with…&rdquo; not &ldquo;I am a marketer…&rdquo;</li>
        <li><strong>Cut the clichés</strong> — &ldquo;hard-working team player&rdquo; adds nothing.</li>
      </ul>

      <h2>Make it sound human</h2>
      <p>
        If a draft reads stiff, run it through the{" "}
        <Link href="/tools/ai-paraphraser">Paraphraser</Link> or{" "}
        <Link href="/tools/ai-humanizer">Humanizer</Link> to loosen it up, then write a matching{" "}
        <Link href="/tools/cover-letter-generator">cover letter</Link>. Explore everything in the{" "}
        <Link href="/tools/ai">AI tools</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Resume summary or objective?</h3>
      <p>
        Use a summary in almost all cases — it highlights what you offer. An objective (what you want) only
        makes sense with no experience at all.
      </p>
      <h3>How long should it be?</h3>
      <p>Two to three lines, or about 30–60 words. Any longer and recruiters skim past it.</p>
      <h3>Is the resume summary generator free?</h3>
      <p>You get a set number of free AI runs each day; go Pro for unlimited use.</p>
    </>
  );
}
