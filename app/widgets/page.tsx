import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, MousePointerClickIcon, ClipboardIcon, Code2Icon } from "lucide-react";

import { getTool, type DevTool } from "@/modules/tools/registry";
import { conversionSlugs } from "@/modules/tools/conversions";
import { EMBED_DEDICATED_SLUGS, embeddableSlugs } from "@/modules/tools/embed";
import { EmbedDialog } from "@/modules/tools/components/embed-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_URL as siteUrl, SITE_NAME } from "@/lib/site";

const title = "Embeddable Widgets — Free Calculators & Converters for Your Site";
const description =
  "Add free OhoTool calculators, converters, and generators to your website or blog with one line of HTML. No sign-up, always free, and they resize to fit.";

export const metadata: Metadata = {
  title: "Embeddable Widgets",
  description,
  keywords: [
    "embeddable calculator",
    "free calculator widget",
    "embed calculator on website",
    "embeddable unit converter",
    "website widgets",
    "free tools for your site",
  ],
  alternates: { canonical: "/widgets" },
  openGraph: {
    type: "website",
    title,
    description,
    url: `${siteUrl}/widgets`,
  },
};

const calculators = EMBED_DEDICATED_SLUGS.filter((s) => s.endsWith("-calculator"));
const utilities = EMBED_DEDICATED_SLUGS.filter((s) => !s.endsWith("-calculator"));

function toTools(slugs: readonly string[]): DevTool[] {
  return slugs.map(getTool).filter((t): t is DevTool => Boolean(t));
}

const steps = [
  { icon: MousePointerClickIcon, title: "Pick a tool", body: "Choose any widget below and hit “Embed this tool.”" },
  { icon: ClipboardIcon, title: "Copy the code", body: "Grab the one-line snippet from the dialog." },
  { icon: Code2Icon, title: "Paste it in", body: "Drop it into your page’s HTML. It resizes to fit — done." },
];

function WidgetGrid({ tools }: { tools: DevTool[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Card key={tool.slug} className="h-full">
            <CardContent className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-start gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4.5" />
                </span>
                <div className="min-w-0">
                  <div className="font-heading text-sm font-semibold leading-tight">{tool.name}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{tool.tagline}</div>
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                <EmbedDialog slug={tool.slug} name={tool.name} />
                <Link
                  href={`/tools/${tool.slug}`}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Open
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function WidgetsPage() {
  const calcTools = toTools(calculators);
  const utilTools = toTools(utilities);
  const convTools = toTools(conversionSlugs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: title,
        description,
        url: `${siteUrl}/widgets`,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: siteUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Widgets", item: `${siteUrl}/widgets` },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: embeddableSlugs.map((slug, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}/tools/${slug}`,
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Code2Icon className="size-3.5" />
          Free to embed
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Put OhoTool widgets on your site
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          Add a live calculator, converter, or generator to your website or blog with one line of HTML. They run in your
          visitor&rsquo;s browser, resize to fit, and stay free &mdash; no sign-up, no API key.
        </p>
      </header>

      {/* How it works */}
      <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
              </div>
              <div className="mt-2 font-heading text-sm font-semibold">{s.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          );
        })}
      </div>

      {/* Calculators */}
      <section className="mt-14">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Calculators</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">Health, finance, and everyday math — great for niche blogs.</p>
        <WidgetGrid tools={calcTools} />
      </section>

      {/* Generators & utilities */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Generators &amp; utilities</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">QR codes, passwords, colors, text tools, and more.</p>
        <WidgetGrid tools={utilTools} />
      </section>

      {/* Unit converters */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Unit converters</h2>
        <p className="mt-1 mb-5 text-sm text-muted-foreground">
          Length, weight, temperature, and more — the classic embeddable widget.
        </p>
        <WidgetGrid tools={convTools} />
      </section>

      {/* Footer CTA */}
      <div className="mt-14 rounded-2xl border border-border bg-card p-6 text-center">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Want a tool that isn&rsquo;t here?</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Tell us what you&rsquo;d embed and we&rsquo;ll consider building it — most requests ship fast.
        </p>
        <Link
          href="/request-tool"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Request a tool
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </div>
  );
}
