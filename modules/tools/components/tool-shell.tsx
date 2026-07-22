import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { getTool, type DevTool } from "@/modules/tools/registry";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProNudge } from "@/components/pro-nudge";

const siteUrl = process.env.BETTER_AUTH_URL || "https://ohotool.com";

export function ToolShell({
  tool,
  children,
}: {
  tool: DevTool;
  children: React.ReactNode;
}) {
  const Icon = tool.icon;
  const related = tool.related
    .map(getTool)
    .filter((t): t is DevTool => Boolean(t));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${tool.name} — OhoTool`,
        description: tool.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Tools", item: `${siteUrl}/tools` },
          {
            "@type": "ListItem",
            position: 2,
            name: tool.name,
            item: `${siteUrl}/tools/${tool.slug}`,
          },
        ],
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

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span aria-hidden>/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-foreground">
          <Icon className="size-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">{tool.name}</h1>
            {tool.pro && <Badge variant="secondary">Pro</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>
        </div>
      </div>
      <p className="mb-8 text-pretty text-muted-foreground">{tool.intro}</p>

      {/* The tool */}
      {children}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Runs entirely in your browser — nothing is uploaded.
      </p>

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
                  <Card className="h-full transition-colors hover:border-foreground/20">
                    <CardContent className="flex items-center gap-2.5">
                      <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
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
