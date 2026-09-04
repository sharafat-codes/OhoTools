import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-a-cover-letter",
  title: "How to Write a Cover Letter (Structure + Example)",
  description:
    "A simple, proven cover-letter structure that gets read — what to put in each paragraph, a full example, common mistakes, and a free generator to draft yours fast.",
  keywords: [
    "how to write a cover letter",
    "cover letter example",
    "cover letter format",
    "cover letter generator",
    "cover letter structure",
    "what to include in a cover letter",
  ],
  date: "2026-09-04",
  readingMinutes: 6,
  tags: ["Career", "AI"],
  related: ["cover-letter-generator", "resume-summary-generator", "ats-resume-checker", "ai-email-writer"],
};

export function Body() {
  return (
    <>
      <p>
        A cover letter isn&apos;t a summary of your resume — it&apos;s the short pitch for why *you* fit
        *this* role. Recruiters skim it in seconds, so structure and specifics matter more than length.
        Here&apos;s a proven format, a full example, and a free tool to draft yours in minutes.
      </p>

      <h2>The 4-paragraph structure that works</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li><strong>Opening</strong> — the role you&apos;re applying for and a one-line hook on why you&apos;re a strong fit.</li>
        <li><strong>Why you</strong> — one or two achievements (with numbers) that match the job&apos;s top requirements.</li>
        <li><strong>Why them</strong> — a specific reason you want *this* company, showing you did your homework.</li>
        <li><strong>Close</strong> — a confident call to action and a thank-you.</li>
      </ol>
      <p>
        Paste the job details and your background into the{" "}
        <Link href="/tools/cover-letter-generator">Cover Letter Generator</Link> to get a tailored first
        draft in this structure, then edit it in your own voice.
      </p>

      <h2>A short example</h2>
      <p>
        &ldquo;I&apos;m applying for the Marketing Manager role at Acme. Over five years in B2B SaaS I&apos;ve
        grown organic traffic 140% and cut cost-per-lead by a third — the exact growth levers your job
        description highlights. I&apos;m drawn to Acme because your focus on product-led growth matches how I
        like to work: experiments over guesswork. I&apos;d love to talk about how I&apos;d approach your
        acquisition goals. Thank you for your time.&rdquo;
      </p>
      <p>Short, specific, and tailored — that&apos;s the whole game.</p>

      <h2>Tips that get it read</h2>
      <ul>
        <li><strong>Tailor every letter</strong> — mirror the language of the job description; never send a generic one.</li>
        <li><strong>Lead with results</strong> — numbers beat adjectives (&ldquo;grew X by 40%&rdquo;, not &ldquo;results-driven&rdquo;).</li>
        <li><strong>Keep it to half a page</strong> — 250–350 words is plenty.</li>
        <li><strong>Address a person</strong> if you can find the hiring manager&apos;s name.</li>
        <li><strong>Match your resume</strong> — same header, same story, no contradictions.</li>
      </ul>

      <h2>Mistakes to avoid</h2>
      <ul>
        <li><strong>Repeating your resume</strong> — add context and motivation, don&apos;t just restate bullets.</li>
        <li><strong>Making it about you only</strong> — connect your strengths to *their* needs.</li>
        <li><strong>Clichés</strong> — &ldquo;I&apos;m a hard-working team player&rdquo; says nothing.</li>
        <li><strong>Typos</strong> — proofread; one careless error can end it.</li>
      </ul>

      <h2>Finish the application</h2>
      <p>
        Pair your letter with a sharp{" "}
        <Link href="/tools/resume-summary-generator">resume summary</Link>, then run your resume through the{" "}
        <Link href="/tools/ats-resume-checker">ATS Resume Checker</Link> to make sure it parses cleanly. Need
        a follow-up email? The <Link href="/tools/ai-email-writer">AI Email Writer</Link> drafts one in seconds.
      </p>

      <h2>FAQ</h2>
      <h3>How long should a cover letter be?</h3>
      <p>Half a page — roughly 250–350 words across three or four short paragraphs.</p>
      <h3>Do I still need a cover letter?</h3>
      <p>When an application allows one, yes — it&apos;s a chance to stand out and explain fit that a resume can&apos;t.</p>
      <h3>Is the cover letter generator free?</h3>
      <p>You get a set number of free AI runs each day; go Pro for unlimited use.</p>
    </>
  );
}
