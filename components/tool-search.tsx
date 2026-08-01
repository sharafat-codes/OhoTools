"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Item = { slug: string; name: string; tagline: string; category: string; keywords: string[] };

// Module-level cache so the index is fetched at most once per session.
let cache: Item[] | null = null;

export function ToolSearch({
  className,
  // Where the dim starts, so it clears the sticky top bar (marketing = h-16,
  // dashboard topbar = h-14) and the navbar stays crisp instead of dimmed.
  topClass = "top-16",
}: {
  className?: string;
  topClass?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<Item[]>(cache ?? []);
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function openSearch() {
    setOpen(true);
    setQ("");
    setActive(0);
  }

  // ⌘K / Ctrl+K toggles the palette from anywhere.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQ("");
        setActive(0);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Load the index the first time the palette opens.
  React.useEffect(() => {
    if (!open || cache) return;
    let cancelled = false;
    fetch("/api/tools-index")
      .then((r) => r.json())
      .then((data: Item[]) => {
        cache = data;
        if (!cancelled) setItems(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Focus input + lock scroll while open (no state changes here).
  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, [open]);

  const query = q.trim().toLowerCase();
  const results = React.useMemo(() => {
    if (!query) return items.slice(0, 8);
    return items
      .filter((t) =>
        `${t.name} ${t.tagline} ${t.category} ${t.keywords.join(" ")}`.toLowerCase().includes(query),
      )
      .slice(0, 12);
  }, [items, query]);

  function go(slug: string) {
    setOpen(false);
    router.push(`/tools/${slug}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search tools"
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
          className,
        )}
      >
        <SearchIcon className="size-4" />
        <span className="hidden lg:inline">Search tools</span>
        <kbd className="hidden rounded border border-border px-1 font-sans text-[10px] leading-4 lg:inline">⌘K</kbd>
      </button>

      {open &&
        createPortal(
          <div
            className={cn(
              "fixed inset-x-0 bottom-0 z-40 flex items-start justify-center bg-black/40 p-4 pt-[6vh]",
              "animate-in fade-in-0 duration-150",
              topClass,
            )}
            onClick={() => setOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Search tools"
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center gap-2 border-b border-border px-3">
              <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                  else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    e.preventDefault();
                    go(results[active].slug);
                  }
                }}
                placeholder="Search tools…"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  {items.length === 0 ? "Loading…" : "No tools found."}
                </p>
              ) : (
                results.map((t, i) => (
                  <button
                    key={t.slug}
                    type="button"
                    onClick={() => go(t.slug)}
                    onMouseMove={() => setActive(i)}
                    className={cn(
                      "flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors",
                      i === active ? "bg-muted" : "hover:bg-muted/50",
                    )}
                  >
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{t.tagline}</span>
                  </button>
                ))
              )}
            </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
