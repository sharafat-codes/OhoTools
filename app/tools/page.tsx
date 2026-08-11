import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, SendIcon } from "lucide-react";

import {
  getTool,
  toolCategories,
  devTools,
  categorySlugForName,
  TOOL_COUNT_LABEL,
  POPULAR_SLUGS,
} from "@/modules/tools/registry";
import { ToolsExplorer, type ToolGroup, type ToolItem } from "@/modules/tools/components/tools-explorer";
import { getUserFavorites } from "@/lib/favorites";
import { Button } from "@/components/ui/button";
import { SITE_URL as siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Online Tools",
  description: `${TOOL_COUNT_LABEL} free online tools — PDF & document converters, AI writing, image, audio & video tools, calculators, and developer tools. Fast, private, no sign-up.`,
  keywords: [
    "free online tools",
    "online tools",
    "pdf tools",
    "image tools",
    "text tools",
    "developer tools",
    "converters",
    "calculators",
  ],
  alternates: { canonical: "/tools" },
};

export default async function ToolsHub({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const initialFavorites = await getUserFavorites();

  const toItem = (slug: string): ToolItem | null => {
    const tool = getTool(slug);
    if (!tool) return null;
    const Icon = tool.icon;
    return {
      slug,
      name: tool.name,
      tagline: tool.tagline,
      pro: !!tool.pro,
      search: `${tool.name} ${tool.tagline} ${tool.keywords.join(" ")}`.toLowerCase(),
      icon: <Icon className="size-5" />,
    };
  };

  const popular: ToolItem[] = POPULAR_SLUGS.map(toItem).filter((t): t is ToolItem => Boolean(t));

  const groups: ToolGroup[] = toolCategories.map((cat) => ({
    name: cat.name,
    blurb: cat.blurb,
    slug: categorySlugForName(cat.name) ?? null,
    tools: cat.slugs.map(toItem).filter((t): t is ToolItem => Boolean(t)),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Free Online Tools — OhoTool",
        description: `${devTools.length} free, browser-based tools for PDF, images, text, code, and more.`,
        url: `${siteUrl}/tools`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Tools", item: `${siteUrl}/tools` },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: devTools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.name,
          url: `${siteUrl}/tools/${t.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Free online tools
        </h1>
        <p className="mt-4 text-muted-foreground">
          {devTools.length} fast, private, browser-based tools for PDF, images,
          text, code, and more. No sign-up, nothing uploaded.
        </p>
      </div>

      <div className="mt-12">
        <ToolsExplorer groups={groups} popular={popular} initialQuery={q ?? ""} initialFavorites={initialFavorites} />
      </div>

      <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <SendIcon className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold">Send a file, securely</h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Share any file with a private, encrypted link — free, no sign-up, with an optional password.
            </p>
          </div>
        </div>
        <Button variant="outline" className="shrink-0" render={<Link href="/send" />}>
          Send a file
          <ArrowRightIcon />
        </Button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/30 px-6 py-10 text-center">
        <h2 className="font-heading text-xl font-semibold">Need QR codes &amp; barcodes too?</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Create branded QR codes, track scans, and save everything to the cloud
          with a free OhoTool account.
        </p>
        <Button render={<Link href="/signup" />}>
          Get started free
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
