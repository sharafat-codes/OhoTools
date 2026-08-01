"use client";

import * as React from "react";
import Link from "next/link";
import { SearchIcon, ArrowRightIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type ToolItem = {
  slug: string;
  name: string;
  tagline: string;
  pro: boolean;
  /** Lowercased name + tagline + keywords, precomputed on the server for matching. */
  search: string;
  icon: React.ReactNode;
};

export type ToolGroup = {
  name: string;
  blurb: string;
  slug: string | null;
  tools: ToolItem[];
};

// How many tools to show per category before "Show all" in the browse view.
const PREVIEW = 8;

export function ToolsExplorer({
  groups,
  initialQuery = "",
}: {
  groups: ToolGroup[];
  initialQuery?: string;
}) {
  const [query, setQuery] = React.useState(initialQuery);
  const [cat, setCat] = React.useState("all");
  const rootRef = React.useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const tokens = React.useMemo(() => q.split(/\s+/).filter(Boolean), [q]);
  const all = React.useMemo(
    () => groups.flatMap((g) => g.tools.map((t) => ({ item: t, category: g.name }))),
    [groups],
  );

  const filtering = q !== "" || cat !== "all";

  // AND across query tokens; when searching, rank name matches above the rest.
  const results = React.useMemo(() => {
    if (!filtering) return [];
    const matched = all.filter(
      (r) => (cat === "all" || r.category === cat) && tokens.every((t) => r.item.search.includes(t)),
    );
    if (!q) return matched.map((r) => r.item); // pure category filter → keep curated order
    const scored = matched.map((r) => {
      const name = r.item.name.toLowerCase();
      let score = 0;
      if (name.startsWith(q)) score += 1000;
      if (name.includes(q)) score += 200;
      for (const t of tokens) if (name.includes(t)) score += 20;
      return { item: r.item, score };
    });
    scored.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
    return scored.map((s) => s.item);
  }, [all, q, tokens, cat, filtering]);

  function expand(name: string) {
    setCat(name);
    // Results replace the browse view above the fold — bring them into view.
    requestAnimationFrame(() => rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-6 scroll-mt-20">
      {/* Sticky search + category chips (sits below the 64px site header) */}
      <div className="sticky top-16 z-20 -mx-4 border-b border-transparent bg-background/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${all.length} tools…`}
              aria-label="Search tools"
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={cat === "all"} onClick={() => setCat("all")}>
              All <Count>{all.length}</Count>
            </Chip>
            {groups.map((g) => (
              <Chip key={g.name} active={cat === g.name} onClick={() => setCat(g.name)}>
                {g.name} <Count>{g.tools.length}</Count>
              </Chip>
            ))}
          </div>
        </div>
      </div>

      {filtering ? (
        results.length > 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {results.length} tool{results.length === 1 ? "" : "s"}
              {cat !== "all" && <> in {cat}</>}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No tools match “{query}”.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCat("all");
              }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map((g) => {
            const shown = g.tools.slice(0, PREVIEW);
            const hidden = g.tools.length - shown.length;
            return (
              <section key={g.name} className="scroll-mt-32">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-xl font-semibold tracking-tight">
                      {g.slug ? (
                        <Link href={`/tools/${g.slug}`} className="hover:underline">
                          {g.name} tools
                        </Link>
                      ) : (
                        `${g.name} tools`
                      )}
                      <span className="ml-2 text-base font-normal text-muted-foreground">{g.tools.length}</span>
                    </h2>
                    <p className="text-sm text-muted-foreground">{g.blurb}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {shown.map((t) => (
                    <ToolCard key={t.slug} tool={t} />
                  ))}
                </div>
                {hidden > 0 && (
                  <button
                    type="button"
                    onClick={() => expand(g.name)}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Show all {g.tools.length} {g.name} tools
                    <ArrowRightIcon className="size-3.5" />
                  </button>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Count({ children }: { children: React.ReactNode }) {
  return <span className="opacity-60">{children}</span>;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border hover:border-primary/40 hover:bg-muted/40",
      )}
    >
      {children}
    </button>
  );
}

function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group">
      <Card className="h-full transition-colors hover:border-primary/40">
        <CardContent className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            {tool.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-heading font-medium">
              {tool.name}
              {tool.pro && (
                <Badge variant="secondary" className="border-primary/30 bg-primary/10 text-primary px-1.5 py-0 text-[10px]">
                  Pro
                </Badge>
              )}
              <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
