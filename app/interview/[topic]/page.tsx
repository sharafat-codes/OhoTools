import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, MessagesSquareIcon, SparklesIcon } from "lucide-react";

import { getQuestionBank, questionBankSlugs, QUESTION_BANKS } from "@/modules/interview/questions";
import { ogImageUrl } from "@/modules/tools/registry";
import { SITE_URL as siteUrl, SITE_NAME } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return questionBankSlugs.map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const bank = getQuestionBank(topic);
  if (!bank) return {};
  const title = `${bank.title} (with Answers)`;
  const image = ogImageUrl({ eyebrow: "Interview Prep", title: bank.title, subtitle: `${bank.questions.length} questions with answers` });
  return {
    title: bank.title,
    description: bank.description,
    alternates: { canonical: `/interview/${bank.slug}` },
    openGraph: { type: "article", title, description: bank.description, url: `${siteUrl}/interview/${bank.slug}`, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description: bank.description, images: [image] },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const bank = getQuestionBank(topic);
  if (!bank) notFound();

  const others = QUESTION_BANKS.filter((b) => b.slug !== bank.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: bank.questions.map((qa) => ({
          "@type": "Question",
          name: qa.q,
          acceptedAnswer: { "@type": "Answer", text: qa.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "AI Mock Interview", item: `${siteUrl}/interview` },
          { "@type": "ListItem", position: 3, name: bank.topic, item: `${siteUrl}/interview/${bank.slug}` },
        ],
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: siteUrl,
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/interview" className="hover:text-foreground">Mock Interview</Link>
        <span aria-hidden>/</span>
        <span className="text-foreground">{bank.topic}</span>
      </nav>

      <header>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {bank.topic} Interview Questions
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">{bank.intro}</p>
      </header>

      {/* Live-mock CTA */}
      <Link
        href="/interview"
        className="group mt-6 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 transition-colors hover:bg-primary/10"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <MessagesSquareIcon className="size-5" />
          </span>
          <div>
            <div className="font-heading font-semibold">Practice these live with an AI interviewer</div>
            <div className="text-sm text-muted-foreground">Get asked questions one at a time and a scored feedback report — free.</div>
          </div>
        </div>
        <SparklesIcon className="size-5 shrink-0 text-primary transition-transform group-hover:scale-110" />
      </Link>

      {/* Questions */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          {bank.questions.length} common {bank.topic} questions
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {bank.questions.map((qa, i) => (
            <details
              key={i}
              className="group rounded-xl border border-border bg-card p-4 [&_summary]:cursor-pointer"
              open={i < 3}
            >
              <summary className="flex items-center justify-between gap-3 font-medium marker:content-none">
                <span>{qa.q}</span>
                <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{qa.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Second CTA */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-center">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Ready to practice out loud?</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Reading answers is one thing — saying them under pressure is another. Run a free AI mock interview and get scored feedback.
        </p>
        <Link
          href="/interview"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Start a mock interview
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      {/* Other topics */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">More interview questions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {others.map((b) => (
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
    </div>
  );
}
