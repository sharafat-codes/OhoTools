import type { Metadata } from "next";
import Link from "next/link";
import { MessagesSquareIcon, ClipboardCheckIcon, SlidersHorizontalIcon, ArrowRightIcon, FileTextIcon } from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { Card, CardContent } from "@/components/ui/card";
import { InterviewApp } from "@/modules/interview/components/interview-app";
import { ROLES } from "@/modules/interview/config";
import { QUESTION_BANKS } from "@/modules/interview/questions";
import { ogImageUrl } from "@/modules/tools/registry";
import { ShareButton } from "@/components/share-button";
import { SITE_URL as siteUrl, SITE_NAME } from "@/lib/site";

const title = "AI Mock Interview — Practice Tech & Behavioral Interviews";
const description =
  "Free AI mock interview for developers: adaptive technical & behavioral questions, then a scored feedback report with strengths, gaps, and what to study.";

const ogImage = ogImageUrl({
  eyebrow: "AI Interview Coach",
  title: "AI Mock Interview",
  subtitle: "Adaptive questions + a scored feedback report — free",
});

export const metadata: Metadata = {
  title: "AI Mock Interview",
  description,
  keywords: [
    "ai mock interview",
    "mock interview practice",
    "interview preparation",
    "behavioral interview practice",
    "technical interview questions",
    "coding interview prep",
    "interview simulator",
  ],
  alternates: { canonical: "/interview" },
  openGraph: {
    type: "website",
    title,
    description,
    url: `${siteUrl}/interview`,
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
};

const steps = [
  { icon: SlidersHorizontalIcon, title: "Pick your setup", body: "Choose a role, level, and whether you want technical, behavioral, or a mix." },
  { icon: MessagesSquareIcon, title: "Get interviewed", body: "The AI asks one question at a time and follows up on your answers — like a real interviewer." },
  { icon: ClipboardCheckIcon, title: "Get a scored report", body: "See your score, strengths, gaps, what to study, and model answers." },
];

const faqs = [
  {
    q: "Is the AI mock interview free?",
    a: "Yes — you get one full mock interview per day for free, with a scored feedback report. Pro unlocks longer interviews, more per day, model answers, and tailoring to a specific job description or resume.",
  },
  {
    q: "Which roles and levels does it cover?",
    a: "Frontend, Backend, Full-Stack, Data / ML, DevOps / SRE, and Mobile — at junior, mid-level, and senior difficulty. You can pick a technical, behavioral, or mixed interview.",
  },
  {
    q: "Does it include live coding questions?",
    a: "Right now it focuses on technical concept questions (explained in words) and behavioral questions. In-browser live-coding questions are planned for a later update.",
  },
  {
    q: "Are my answers saved?",
    a: "No. The interview runs in your browser session and your answers aren't stored. Saving and revisiting past interviews is a planned Pro feature.",
  },
];

export default async function InterviewPage() {
  const user = await getCurrentUser();
  const loggedIn = !!user;
  const pro = isPro((user as { plan?: string } | null)?.plan ?? "FREE");
  const verified = Boolean((user as { emailVerified?: boolean } | null)?.emailVerified);
  const email = (user as { email?: string } | null)?.email ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "AI Mock Interview — OhoTool",
        description,
        url: `${siteUrl}/interview`,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "AI Mock Interview", item: `${siteUrl}/interview` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <MessagesSquareIcon className="size-3.5" />
          AI Interview Coach
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">AI Mock Interview</h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          Practice a realistic interview with an AI that asks one question at a time, follows up on your answers, and ends
          with a scored report — strengths, gaps, and what to study next.
        </p>
        <div className="mt-5 flex justify-center">
          <ShareButton title="AI Mock Interview — practice tech & behavioral interviews free" url={`${siteUrl}/interview`} image={ogImage} />
        </div>
      </header>

      {/* The app */}
      <Card className="mt-8">
        <CardContent className="p-5 sm:p-6">
          <InterviewApp loggedIn={loggedIn} pro={pro} verified={verified} email={email} />
        </CardContent>
      </Card>

      {/* Career-prep cross-link */}
      <Link
        href="/resume-review"
        className="group mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <FileTextIcon className="size-4.5" />
          </span>
          <div>
            <div className="font-heading text-sm font-semibold">First, check your resume</div>
            <div className="text-xs text-muted-foreground">Free AI resume reviewer &amp; ATS checker — scored, with rewrites.</div>
          </div>
        </div>
        <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>

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

      {/* Who it's for */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Built for developer interviews</h2>
        <p className="mt-3 text-muted-foreground">
          Prepping for a software role? Run a mock for your exact track and level, and rehearse both the technical
          questions and the behavioral “tell me about a time…” ones that trip people up. Covered roles:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <span key={r.id} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-sm">
              {r.label}
            </span>
          ))}
        </div>
      </section>

      {/* Prepare by topic — links to the indexable question banks */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Prepare by topic</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          Browse common questions with answers, then practice them live.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {QUESTION_BANKS.map((b) => (
            <Link
              key={b.slug}
              href={`/interview/${b.slug}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="font-medium">{b.topic} interview questions</span>
              <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

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
