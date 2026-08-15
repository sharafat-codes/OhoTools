import type { Metadata } from "next";
import Link from "next/link";
import { FileTextIcon, TargetIcon, ListChecksIcon, MessagesSquareIcon, ScanLineIcon } from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { Card, CardContent } from "@/components/ui/card";
import { ResumeReviewApp } from "@/modules/resume/components/resume-review-app";
import { ShareButton } from "@/components/share-button";
import { ogImageUrl } from "@/modules/tools/registry";
import { SITE_URL as siteUrl, SITE_NAME } from "@/lib/site";

const title = "AI Resume Reviewer & ATS Checker — Free";
const description =
  "Free AI resume reviewer & ATS checker. Paste your resume (and a job) for a scored review — strengths, issues, keyword match, and stronger bullet rewrites.";

const ogImage = ogImageUrl({ eyebrow: "Career Prep", title: "AI Resume Reviewer", subtitle: "Scored review, ATS check & rewrites — free" });

export const metadata: Metadata = {
  title: "AI Resume Reviewer & ATS Checker",
  description,
  keywords: [
    "ai resume reviewer",
    "resume checker",
    "ats checker",
    "resume review",
    "ats resume checker",
    "free resume review",
    "resume score",
  ],
  alternates: { canonical: "/resume-review" },
  openGraph: { type: "website", title, description, url: `${siteUrl}/resume-review`, images: [{ url: ogImage, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

const steps = [
  { icon: FileTextIcon, title: "Paste your resume", body: "Drop in your resume text — and optionally the job you're targeting." },
  { icon: TargetIcon, title: "Get a scored review", body: "Overall + ATS score, a keyword match, strengths, and prioritized issues." },
  { icon: ListChecksIcon, title: "Fix and reapply", body: "Apply the specific fixes and stronger bullet rewrites, then go interview." },
];

const faqs = [
  { q: "Is the resume reviewer free?", a: "Yes — you get free AI resume reviews each day with a scored report. Pro unlocks the AI-written bullet rewrites and unlimited reviews." },
  { q: "What is an ATS score?", a: "ATS (applicant tracking systems) parse resumes before a human sees them. The ATS score estimates how cleanly your resume's structure and wording will be read by those systems." },
  { q: "Does adding a job description help?", a: "Yes. Paste the job description and the reviewer computes a match score and lists important keywords and skills the job wants that your resume is missing." },
  { q: "Is my resume stored?", a: "No. Your resume is sent securely for AI analysis and isn't saved. Everything happens in that one request." },
];

export default async function ResumeReviewPage() {
  const user = await getCurrentUser();
  const loggedIn = !!user;
  const pro = isPro((user as { plan?: string } | null)?.plan ?? "FREE");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "AI Resume Reviewer — OhoTool",
        description,
        url: `${siteUrl}/resume-review`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "AI Resume Reviewer", item: `${siteUrl}/resume-review` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <FileTextIcon className="size-3.5" />
          Career Prep
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">AI Resume Reviewer &amp; ATS Checker</h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Paste your resume and get an instant, scored review — ATS-friendliness, a keyword match to the job you want,
          the exact issues to fix, and stronger bullet rewrites.
        </p>
        <div className="mt-5 flex justify-center">
          <ShareButton title="Free AI Resume Reviewer & ATS Checker" url={`${siteUrl}/resume-review`} image={ogImage} />
        </div>
      </header>

      <Card className="mt-8">
        <CardContent className="p-5 sm:p-6">
          <ResumeReviewApp loggedIn={loggedIn} pro={pro} />
        </CardContent>
      </Card>

      {/* How it works */}
      <section className="mt-14">
        <h2 className="font-heading text-xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="rounded-xl border border-border bg-card p-4">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="mt-2 font-heading text-sm font-semibold">{s.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-link to the deterministic ATS format checker */}
      <Link
        href="/tools/ats-resume-checker"
        className="group mt-8 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <ScanLineIcon className="size-5" />
          </span>
          <div>
            <div className="font-heading font-semibold">Free ATS format check</div>
            <div className="text-sm text-muted-foreground">
              Upload your file to see if an ATS can actually parse it — instant, in your browser.
            </div>
          </div>
        </div>
      </Link>

      {/* Cross-link to interview */}
      <Link
        href="/interview"
        className="group mt-8 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 transition-colors hover:bg-primary/10"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <MessagesSquareIcon className="size-5" />
          </span>
          <div>
            <div className="font-heading font-semibold">Next: practice the interview</div>
            <div className="text-sm text-muted-foreground">Free AI mock interview with a scored feedback report.</div>
          </div>
        </div>
      </Link>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="mt-4 flex flex-col gap-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-border bg-card p-4 [&_summary]:cursor-pointer">
              <summary className="font-medium marker:content-none">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
