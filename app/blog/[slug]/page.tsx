import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { getPost, posts } from "@/modules/blog";
import { getTool, ogImageUrl, TOOL_GUIDES } from "@/modules/tools/registry";
import { isEmbeddable, isEmbedConversion } from "@/modules/tools/embed";
import { getConversionView } from "@/modules/tools/conversions";
import { EmbedTool } from "@/modules/tools/components/embed-tool";
import { Converter } from "@/modules/tools/components/converter";
import { ShareButton } from "@/components/share-button";
import { AdUnit } from "@/components/ad-unit";
import { SITE_URL as siteUrl } from "@/lib/site";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

const prose =
  "mt-8 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold [&_li]:mb-1.5 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted-foreground";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const { meta } = post;
  const image = ogImageUrl({
    eyebrow: meta.tags[0] ? `${meta.tags[0]} · Guide` : "Guide",
    title: meta.title,
    subtitle: meta.description,
  });
  const images = [{ url: image, width: 1200, height: 630 }];
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/blog/${meta.slug}` },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: `${siteUrl}/blog/${meta.slug}`,
      publishedTime: meta.date,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { meta, Body } = post;
  const related = meta.related
    .map((s) => getTool(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  // If this post is the companion guide for an embeddable tool, render that
  // tool inline so the guide is interactive ("Try it") — no per-post edits.
  const companionEntry = Object.entries(TOOL_GUIDES).find(([, guide]) => guide === slug);
  const companionSlug = companionEntry && isEmbeddable(companionEntry[0]) ? companionEntry[0] : undefined;
  const companion = companionSlug ? getTool(companionSlug) : undefined;
  let tryContent: React.ReactNode = null;
  if (companionSlug) {
    if (isEmbedConversion(companionSlug)) {
      const view = getConversionView(companionSlug);
      if (view) tryContent = <Converter view={view} />;
    } else {
      tryContent = <EmbedTool slug={companionSlug} />;
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: meta.title,
        description: meta.description,
        datePublished: meta.date,
        dateModified: meta.date,
        author: { "@type": "Organization", name: "OhoTool" },
        publisher: { "@type": "Organization", name: "OhoTool" },
        mainEntityOfPage: `${siteUrl}/blog/${meta.slug}`,
        keywords: meta.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
          { "@type": "ListItem", position: 3, name: meta.title, item: `${siteUrl}/blog/${meta.slug}` },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" />
        All articles
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {meta.tags.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2.5 py-1 font-medium">{t}</span>
          ))}
          <span>
            {formatDate(meta.date)} · {meta.readingMinutes} min read
          </span>
        </div>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {meta.title}
        </h1>
        <div className="mt-4">
          <ShareButton
            title={meta.title}
            url={`${siteUrl}/blog/${meta.slug}`}
            image={ogImageUrl({ eyebrow: meta.tags[0] ? `${meta.tags[0]} · Guide` : "Guide", title: meta.title, subtitle: meta.description })}
          />
        </div>
      </header>

      <div className={prose}>
        <Body />
      </div>

      <AdUnit />

      {companion && tryContent && (
        <section className="mt-12 border-t border-border/60 pt-8">
          <h2 className="font-heading text-xl font-semibold tracking-tight">Try the {companion.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{companion.tagline}</p>
          <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-6">{tryContent}</div>
          <div className="mt-3">
            <Link href={`/tools/${companion.slug}`} className="text-sm text-primary underline underline-offset-2">
              Open the full {companion.name} →
            </Link>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <div className="mt-12 border-t border-border/60 pt-8">
          <h2 className="font-heading text-lg font-semibold tracking-tight">Tools mentioned</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{tool.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{tool.tagline}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
