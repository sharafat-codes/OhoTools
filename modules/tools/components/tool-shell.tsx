import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { getTool, getToolCategory, categoryPathForTool, ogImageUrl, TOOL_GUIDES, type DevTool } from "@/modules/tools/registry";
import { posts } from "@/modules/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProNudge } from "@/components/pro-nudge";
import { RecentToolTracker } from "@/modules/tools/components/recent-tools";
import { ShareButton } from "@/components/share-button";
import { FavoriteButton } from "@/components/favorites";
import { getUserFavorites } from "@/lib/favorites";
import { EmbedDialog } from "@/modules/tools/components/embed-dialog";
import { isEmbeddable } from "@/modules/tools/embed";
import { AdUnit } from "@/components/ad-unit";
import { SITE_URL as siteUrl } from "@/lib/site";

export async function ToolShell({
  tool,
  children,
}: {
  tool: DevTool;
  children: React.ReactNode;
}) {
  const Icon = tool.icon;
  const favorited = (await getUserFavorites()).includes(tool.slug);
  const related = tool.related
    .map(getTool)
    .filter((t): t is DevTool => Boolean(t));

  const category = getToolCategory(tool.slug);
  const categoryPath = categoryPathForTool(tool.slug);

  // Companion how-to guide (consolidates topical authority; the guide links back).
  const guideSlug = TOOL_GUIDES[tool.slug];
  const guide = guideSlug ? posts.find((p) => p.slug === guideSlug) : undefined;
  const crumbs = [
    { name: "Home", item: `${siteUrl}/` },
    { name: "Tools", item: `${siteUrl}/tools` },
    ...(category
      ? [{ name: category.name, item: `${siteUrl}${categoryPath}` }]
      : []),
    { name: tool.name, item: `${siteUrl}/tools/${tool.slug}` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${tool.name} — OhoTool`,
        description: tool.description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript. Runs in any modern browser.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecentToolTracker slug={tool.slug} name={tool.name} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        {category && (
          <>
            <span aria-hidden>/</span>
            <Link href={categoryPath} className="hover:text-foreground">
              {category.name}
            </Link>
          </>
        )}
        <span aria-hidden>/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">{tool.name}</h1>
            {tool.pro && <Badge variant="secondary" className="border-primary/30 bg-primary/10 text-primary">Pro</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <FavoriteButton slug={tool.slug} initialFavorited={favorited} />
          <ShareButton
            align="end"
            title={`${tool.name} — free online tool by OhoTool`}
            url={`${siteUrl}/tools/${tool.slug}`}
            image={ogImageUrl({
              eyebrow: category ? `${category.name} tool` : "Online tool",
              title: tool.name,
              subtitle: tool.tagline,
            })}
          />
        </div>
      </div>
      <p className="mb-8 text-pretty text-muted-foreground">{tool.intro}</p>

      {/* The tool */}
      {children}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        {tool.serverSide
          ? "Your file is processed securely on our server for conversion, then deleted."
          : "Runs entirely in your browser — nothing is uploaded."}
      </p>

      {isEmbeddable(tool.slug) && (
        <div className="mt-6 flex justify-center">
          <EmbedDialog slug={tool.slug} name={tool.name} />
        </div>
      )}

      {/* How to use */}
      <section className="mt-14">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          How to use the {tool.name.toLowerCase()}
        </h2>
        <ol className="mt-4 flex flex-col gap-3">
          {tool.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium tabular-nums">
                {i + 1}
              </span>
              <span className="pt-0.5 text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Ad — content pages only; not on the card makers (app-like experience) */}
      {category?.name !== "Cards & Invitations" && <AdUnit />}

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {tool.faqs.map((f) => (
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

      {/* Companion guide */}
      {guide && (
        <section className="mt-12">
          <Link
            href={`/blog/${guide.slug}`}
            className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Read the guide</div>
              <div className="mt-0.5 font-heading font-medium">{guide.title}</div>
            </div>
            <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      )}

      {/* Related tools */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Related tools
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((r) => {
              const RIcon = r.icon;
              return (
                <Link key={r.slug} href={`/tools/${r.slug}`} className="group">
                  <Card className="h-full transition-colors hover:border-primary/40">
                    <CardContent className="flex items-center gap-2.5">
                      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <RIcon className="size-4" />
                      </div>
                      <span className="text-sm font-medium">{r.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <ProNudge />
    </div>
  );
}
