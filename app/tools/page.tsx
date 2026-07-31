import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, SendIcon } from "lucide-react";

import { getTool, toolCategories, devTools, categorySlugForName, TOOL_COUNT_LABEL } from "@/modules/tools/registry";
import { ToolsExplorer, type ToolGroup } from "@/modules/tools/components/tools-explorer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Free Online Tools",
  description: `${TOOL_COUNT_LABEL} free online tools — PDF & document converters (Word, Excel, PowerPoint), AI writing tools, image, audio & video tools, calculators, developer tools, and QR codes. Fast, private, browser-based. No sign-up.`,
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
  const groups: ToolGroup[] = toolCategories.map((cat) => ({
    name: cat.name,
    blurb: cat.blurb,
    slug: categorySlugForName(cat.name) ?? null,
    tools: cat.slugs
      .map((slug) => {
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
      })
      .filter((t): t is NonNullable<typeof t> => Boolean(t)),
  }));

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
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
        <ToolsExplorer groups={groups} initialQuery={q ?? ""} />
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
