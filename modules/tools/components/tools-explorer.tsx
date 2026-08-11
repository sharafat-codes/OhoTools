"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchIcon, ArrowRightIcon, XIcon, WandSparklesIcon, StarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/components/favorites";

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
const LS_Q = "ohotool:tools:q";
const LS_CAT = "ohotool:tools:cat";

export function ToolsExplorer({
  groups,
  popular = [],
  initialQuery = "",
}: {
  groups: ToolGroup[];
  popular?: ToolItem[];
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);
  const [cat, setCat] = React.useState("all");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const activeRef = React.useRef<HTMLAnchorElement | null>(null);
  const restored = React.useRef(false);

  const { favorites, toggle, isFavorite } = useFavorites();

  const q = query.trim().toLowerCase();
  const tokens = React.useMemo(() => q.split(/\s+/).filter(Boolean), [q]);
  const all = React.useMemo(
    () => groups.flatMap((g) => g.tools.map((t) => ({ item: t, category: g.name }))),
    [groups],
  );

  const favItems = React.useMemo(() => {
    const bySlug = new Map(all.map((r) => [r.item.slug, r.item]));
    return favorites.map((s) => bySlug.get(s)).filter((x): x is ToolItem => Boolean(x));
  }, [favorites, all]);

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

  const activeIdx = Math.min(Math.max(activeIndex, 0), Math.max(results.length - 1, 0));

  // Restore the last search/category (unless the URL provided ?q=). Deferred so
  // it never runs during render/hydration.
  React.useEffect(() => {
    if (restored.current || initialQuery) return;
    restored.current = true;
    let sq: string | null = null;
    let sc: string | null = null;
    try {
      sq = localStorage.getItem(LS_Q);
      sc = localStorage.getItem(LS_CAT);
    } catch {
      /* storage unavailable */
    }
    const raf = requestAnimationFrame(() => {
      if (sq) setQuery(sq);
      if (sc && (sc === "all" || groups.some((g) => g.name === sc))) setCat(sc);
    });
    return () => cancelAnimationFrame(raf);
  }, [initialQuery, groups]);

  // Persist search/category across visits.
  React.useEffect(() => {
    try {
      localStorage.setItem(LS_Q, query);
      localStorage.setItem(LS_CAT, cat);
    } catch {
      /* storage unavailable */
    }
  }, [query, cat]);

  // "/" focuses search from anywhere on the page.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Keep the keyboard-highlighted result in view.
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, results]);

  function changeQuery(v: string) {
    setQuery(v);
    setActiveIndex(0);
  }
  function changeCat(name: string) {
    setCat(name);
    setActiveIndex(0);
  }
  function expand(name: string) {
    changeCat(name);
    requestAnimationFrame(() => rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      changeQuery("");
      return;
    }
    if (!filtering || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const t = results[activeIdx];
      if (t) router.push(`/tools/${t.slug}`);
    }
  }

  return (
    <div ref={rootRef} className="flex flex-col gap-6 scroll-mt-20">
      {/* Sticky search + category chips (sits below the 64px site header) */}
      <div className="sticky top-16 z-20 -mx-4 border-b border-transparent bg-background/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => changeQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder={`Search ${all.length} tools…`}
              aria-label="Search tools"
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-9 text-sm outline-none [&::-webkit-search-cancel-button]:hidden focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            {query ? (
              <button
                type="button"
                onClick={() => changeQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                /
              </kbd>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip active={cat === "all"} onClick={() => changeCat("all")}>
              All <Count>{all.length}</Count>
            </Chip>
            {groups.map((g) => (
              <Chip key={g.name} active={cat === g.name} onClick={() => changeCat(g.name)}>
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
              {results.map((t, idx) => (
                <ToolCard
                  key={t.slug}
                  tool={t}
                  active={idx === activeIdx}
                  cardRef={idx === activeIdx ? activeRef : undefined}
                  fav={isFavorite(t.slug)}
                  onToggleFav={() => toggle(t.slug)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-muted-foreground">No tools match “{query}”.</p>
            <Link
              href={`/request-tool?q=${encodeURIComponent(query)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <WandSparklesIcon className="size-4" />
              Request “{query.length > 30 ? query.slice(0, 30) + "…" : query}”
            </Link>
            <button
              type="button"
              onClick={() => {
                changeQuery("");
                setCat("all");
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Clear search
            </button>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-10">
          {favItems.length > 0 && (
            <section aria-label="Your favorites">
              <h2 className="mb-4 flex items-center gap-1.5 font-heading text-xl font-semibold tracking-tight">
                <StarIcon className="size-4 fill-amber-400 text-amber-400" />
                Your favorites
                <span className="ml-1 text-base font-normal text-muted-foreground">{favItems.length}</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {favItems.map((t) => (
                  <ToolCard key={t.slug} tool={t} fav onToggleFav={() => toggle(t.slug)} />
                ))}
              </div>
            </section>
          )}

          {popular.length > 0 && (
            <section aria-label="Popular tools">
              <h2 className="mb-3 font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Popular
              </h2>
              <div className="flex flex-wrap gap-2">
                {popular.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-[transform,border-color,background-color] duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted/40"
                  >
                    <span className="text-primary">{t.icon}</span>
                    {t.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

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
                    <ToolCard key={t.slug} tool={t} fav={isFavorite(t.slug)} onToggleFav={() => toggle(t.slug)} />
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

      {/* Missing-a-tool prompt — turns unmet demand into roadmap signal */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-4 text-sm text-muted-foreground">
        Missing a tool you need?
        <Link href="/request-tool" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
          Request it
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
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

function ToolCard({
  tool,
  active,
  cardRef,
  fav = false,
  onToggleFav,
}: {
  tool: ToolItem;
  active?: boolean;
  cardRef?: React.Ref<HTMLAnchorElement>;
  fav?: boolean;
  onToggleFav?: () => void;
}) {
  return (
    <Card
      className={cn(
        "group relative h-full transition-[transform,border-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm",
        active && "border-primary ring-2 ring-primary/40",
      )}
    >
      {/* Stretched link makes the whole card clickable; the star sits above it. */}
      <Link
        ref={cardRef}
        href={`/tools/${tool.slug}`}
        aria-label={`Open ${tool.name}`}
        className="absolute inset-0 rounded-[inherit]"
      />
      <CardContent className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          {tool.icon}
        </div>
        <div className="min-w-0 pr-7">
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
      {onToggleFav && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFav();
          }}
          aria-label={fav ? "Remove from favorites" : "Save to favorites"}
          aria-pressed={fav}
          className="absolute right-2 top-2 z-10 grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <StarIcon className={cn("size-4", fav && "fill-amber-400 text-amber-400")} />
        </button>
      )}
    </Card>
  );
}
