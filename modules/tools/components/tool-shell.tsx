import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import type { DevTool } from "@/modules/tools/registry";

export function ToolShell({
  tool,
  children,
}: {
  tool: DevTool;
  children: React.ReactNode;
}) {
  const Icon = tool.icon;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — OhoTool`,
    description: tool.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        All tools
      </Link>
      <div className="mb-8 flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-muted text-foreground">
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {tool.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>
        </div>
      </div>
      {children}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Runs entirely in your browser — nothing is uploaded.
      </p>
    </div>
  );
}
