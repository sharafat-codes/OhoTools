import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "is-your-resume-ats-friendly",
  title: "Is Your Resume ATS-Friendly? How to Check It (Free)",
  description:
    "ATS software rejects resumes it can't read. Learn what makes a resume ATS-friendly, the formatting mistakes that get you filtered out, and how to check yours for free in seconds.",
  keywords: [
    "ats friendly resume",
    "is my resume ats friendly",
    "ats friendly resume format",
    "how to make resume ats friendly",
    "ats resume checker",
  ],
  date: "2026-08-15",
  readingMinutes: 5,
  tags: ["Career"],
  related: ["ats-resume-checker", "resume-summary-generator"],
};

export function Body() {
  return (
    <>
      <p>
        Before a recruiter ever sees your resume, software usually reads it first. That software — an{" "}
        <strong>Applicant Tracking System (ATS)</strong> — scans your file, pulls out your details, and sorts them
        into fields. If it can&apos;t read your resume cleanly, your application can be filtered out before a human
        looks at it. Here&apos;s what &quot;ATS-friendly&quot; really means, the mistakes that get resumes
        rejected, and how to check yours for free.
      </p>

      <h2>Check yours in seconds</h2>
      <p>
        The fastest way to know is to test the actual file. Upload it to the{" "}
        <Link href="/tools/ats-resume-checker">free ATS resume checker</Link> — it analyzes your PDF or Word file
        right in your browser (nothing is uploaded) and gives you a score plus the exact issues to fix.
      </p>

      <h2>What makes a resume ATS-friendly</h2>
      <ul>
        <li>
          <strong>Selectable text, not an image.</strong> If your resume is a scan, screenshot, or exported image,
          the ATS reads it as blank. You should be able to highlight the text with your cursor.
        </li>
        <li>
          <strong>A single-column layout.</strong> Many ATS read straight across the page, so two-column and
          sidebar designs get scrambled together.
        </li>
        <li>
          <strong>No images, icons, or logos.</strong> An ATS can&apos;t read text inside graphics, and a profile
          photo can break parsing entirely.
        </li>
        <li>
          <strong>No tables or text boxes.</strong> Content inside tables often comes out in the wrong order — or
          not at all.
        </li>
        <li>
          <strong>Standard section headings.</strong> Use plain labels like <em>Experience</em>,{" "}
          <em>Education</em>, and <em>Skills</em> so the ATS can categorize each section.
        </li>
        <li>
          <strong>Contact details in the body.</strong> Put your name, email, and phone in the main text — not in
          the header/footer, which some systems ignore.
        </li>
        <li>
          <strong>Standard fonts.</strong> Arial, Calibri, or Times. Decorative fonts can garble on parsing.
        </li>
      </ul>

      <h2>The mistakes that get resumes filtered out</h2>
      <ul>
        <li>Designing in a graphics tool and exporting as an image-based PDF.</li>
        <li>Fancy multi-column templates with a colored sidebar.</li>
        <li>Icons next to contact details (they replace the text an ATS needs).</li>
        <li>Putting your name and contact info only in the document header.</li>
        <li>Skills shown as rating bars or graphics instead of words.</li>
      </ul>

      <h2>How to fix an ATS-unfriendly resume</h2>
      <ol>
        <li>Start from a simple, single-column layout in Word or Google Docs.</li>
        <li>Write everything as text — no images, icons, tables, or text boxes.</li>
        <li>Use clear headings (Summary, Experience, Education, Skills).</li>
        <li>Keep your contact details as plain text at the top of the body.</li>
        <li>
          Export a <strong>real (text) PDF</strong>, then re-check it with the{" "}
          <Link href="/tools/ats-resume-checker">ATS resume checker</Link> to confirm the text is selectable.
        </li>
      </ol>

      <h2>ATS-friendly ≠ keyword-matched</h2>
      <p>
        Passing the parser is step one. Step two is making sure your resume actually contains the skills and
        keywords the job asks for. For that, paste your resume and the job description into the{" "}
        <Link href="/resume-review">AI Resume Reviewer</Link> — it scores your keyword match and shows what&apos;s
        missing. And if your summary needs work, the{" "}
        <Link href="/tools/resume-summary-generator">resume summary generator</Link> can help.
      </p>

      <h2>FAQ</h2>
      <h3>Is a PDF ATS-friendly?</h3>
      <p>
        Yes — as long as it&apos;s a real text PDF (you can select the text), not a scan or an image export. Most
        modern ATS handle text PDFs and Word (.docx) equally well.
      </p>
      <h3>Do ATS really reject resumes automatically?</h3>
      <p>
        They rank and filter. A resume the ATS can&apos;t parse ends up with missing or jumbled data, which pushes
        it down or out — so it often never reaches a recruiter.
      </p>
      <h3>How do I know if my resume is ATS-friendly?</h3>
      <p>
        Test the actual file with the <Link href="/tools/ats-resume-checker">ATS resume checker</Link>. It flags
        non-selectable text, columns, images, tables, and missing sections in seconds.
      </p>
    </>
  );
}
