import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { getConversionView } from "@/modules/tools/conversions";
import { embeddableSlugs, isEmbedConversion } from "@/modules/tools/embed";
import { Converter } from "@/modules/tools/components/converter";
import { EmbedTool } from "@/modules/tools/components/embed-tool";
import { EmbedResizer } from "@/modules/tools/components/embed-resizer";
import { SITE_URL as siteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return embeddableSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  return {
    title: tool ? `${tool.name} — OhoTool` : "OhoTool",
    robots: { index: false, follow: true },
  };
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  let content: React.ReactNode;
  if (isEmbedConversion(slug)) {
    const view = getConversionView(slug);
    if (!view) notFound();
    content = <Converter view={view} />;
  } else {
    content = <EmbedTool slug={slug} />;
  }

  const Icon = tool.icon;
  const toolUrl = `${siteUrl}/tools/${slug}?utm_source=embed&utm_medium=referral&utm_campaign=widget`;
  const homeUrl = `${siteUrl}/?utm_source=embed&utm_medium=referral&utm_campaign=widget`;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-5">
      <EmbedResizer slug={slug} />

      {/* Compact, self-describing header */}
      <a
        href={toolUrl}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-2.5 no-underline"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-heading font-semibold leading-tight text-foreground">{tool.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{tool.tagline}</span>
        </span>
      </a>

      {content}

      {/* Attribution — the referral surface inside the frame */}
      <div className="mt-1 flex items-center justify-center gap-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span>Powered by</span>
        <a href={homeUrl} target="_blank" rel="noopener" className="font-medium text-foreground hover:text-primary">
          OhoTool
        </a>
        <span aria-hidden>·</span>
        <a href={toolUrl} target="_blank" rel="noopener" className="hover:text-primary">
          Open full tool
        </a>
      </div>
    </div>
  );
}
