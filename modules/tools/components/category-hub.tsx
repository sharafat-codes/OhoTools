import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import {
  getTool,
  getCategoryPage,
  categoryPageToolSlugs,
  categoryPages,
  type DevTool,
} from "@/modules/tools/registry";
import { SITE_URL as siteUrl } from "@/lib/site";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CategoryHub({ slug }: { slug: string }) {
  const cat = getCategoryPage(slug);
  if (!cat) return null;

  const tools = categoryPageToolSlugs(cat)
    .map(getTool)
    .filter((t): t is DevTool => Boolean(t));

  const others = categoryPages.filter((c) => c.slug !== cat.slug);

  const crumbs = [
    { name: "Home", item: `${siteUrl}/` },
    { name: "Tools", item: `${siteUrl}/tools` },
    { name: cat.seoTitle, item: `${siteUrl}/tools/${cat.slug}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${cat.seoTitle} — OhoTool`,
        description: cat.seoDescription,
        url: `${siteUrl}/tools/${cat.slug}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: c.item,
        })),
      },
      {
        "@type": "ItemList",
        itemListElement: tools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: `${siteUrl}/tools/${t.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: cat.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span aria-hidden>/</span>
        <span className="text-foreground">{cat.seoTitle}</span>
      </nav>

      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {cat.h1}
        </h1>
        <p className="mt-4 text-pretty text-muted-foreground">{cat.intro}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {tools.length} {tools.length === 1 ? "tool" : "tools"} · free · no sign-up
        </p>
      </div>

      {/* Tools */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="group">
              <Card className="h-full transition-colors hover:border-foreground/20">
                <CardContent className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-heading font-medium">
                      {t.name}
                      {t.pro && (
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">Pro</Badge>
                      )}
                      <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* FAQ */}
      {cat.faqs.length > 0 && (
        <section className="mt-14">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {cat.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border bg-card p-4 [&_summary]:cursor-pointer"
              >
                <summary className="flex items-center justify-between font-medium marker:content-none">
                  {f.q}
                  <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Other categories */}
      <section className="mt-14">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Explore other categories
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/tools/${c.slug}`}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              {c.seoTitle}
            </Link>
          ))}
          <Link
            href="/tools"
            className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            All tools
          </Link>
        </div>
      </section>
    </div>
  );
}
