"use client";

import * as React from "react";
import Link from "next/link";
import { SearchIcon, ArrowRightIcon } from "lucide-react";

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

export function ToolsExplorer({ groups }: { groups: ToolGroup[] }) {
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState("all");

  const q = query.trim().toLowerCase();
  const all = React.useMemo(
    () => groups.flatMap((g) => g.tools.map((t) => ({ item: t, category: g.name }))),
    [groups],
  );

  const filtering = q !== "" || cat !== "all";
  const results = React.useMemo(() => {
    if (!filtering) return [];
    return all
      .filter((r) => (cat === "all" || r.category === cat) && (q === "" || r.item.search.includes(q)))
      .map((r) => r.item);
  }, [all, q, cat, filtering]);

  return (
    <div className="flex flex-col gap-6">
      {/* Search + category chips */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${all.length} tools…`}
            aria-label="Search tools"
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>
            All
          </Chip>
          {groups.map((g) => (
            <Chip key={g.name} active={cat === g.name} onClick={() => setCat(g.name)}>
              {g.name}
            </Chip>
          ))}
        </div>
      </div>

      {filtering ? (
        results.length > 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {results.length} tool{results.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No tools match your search. Try a different term.
          </p>
        )
      ) : (
        <div className="flex flex-col gap-10">
          {groups.map((g) => (
            <section key={g.name} className="scroll-mt-20">
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
                  </h2>
                  <p className="text-sm text-muted-foreground">{g.blurb}</p>
                </div>
                {g.slug && (
                  <Link
                    href={`/tools/${g.slug}`}
                    className="shrink-0 whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    View all →
                  </Link>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {g.tools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
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
          ? "border-foreground bg-foreground text-background"
          : "border-border hover:border-foreground/20 hover:bg-muted/40",
      )}
    >
      {children}
    </button>
  );
}

function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group">
      <Card className="h-full transition-colors hover:border-foreground/20">
        <CardContent className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
            {tool.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-heading font-medium">
              {tool.name}
              {tool.pro && (
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
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
