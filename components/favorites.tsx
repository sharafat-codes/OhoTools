"use client";

import * as React from "react";
import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { getFavorites, toggleFavorite, mergeFavorites } from "@/modules/tools/favorites-actions";

// Favorites are stored in the account (DB) for signed-in users — persistent and
// cross-device — and in localStorage for anonymous users (no sign-up needed).
// On sign-in, any local favorites are merged into the account.
const KEY = "oho-favorites";
const EVT = "oho-favorites-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(EVT));
}

export function useFavorites() {
  const { data: session, isPending } = useSession();
  const loggedIn = !!session?.user;
  const [favorites, setFavorites] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (isPending) return; // wait for the session to resolve
    let cancelled = false;

    (async () => {
      const local = read();
      if (loggedIn) {
        // Merge any local favorites into the account, then load the account set.
        if (local.length) await mergeFavorites(local).catch(() => {});
        let server: string[] = [];
        try {
          server = await getFavorites();
        } catch {
          server = local;
        }
        if (cancelled) return;
        setFavorites(server);
        try {
          localStorage.removeItem(KEY); // account is now the source of truth
        } catch {
          /* ignore */
        }
      } else if (!cancelled) {
        setFavorites(local);
      }
    })();

    // Keep anonymous favorites in sync across components/tabs.
    const onChange = () => {
      if (!loggedIn) setFavorites(read());
    };
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      cancelled = true;
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [isPending, loggedIn]);

  const toggle = React.useCallback(
    (slug: string) => {
      // Compute from current state and run side effects ONCE, outside the state
      // updater (updaters must be pure — Strict Mode calls them twice, which
      // would double-fire the DB toggle and cancel itself out).
      const has = favorites.includes(slug);
      const next = has ? favorites.filter((s) => s !== slug) : [slug, ...favorites];
      setFavorites(next);
      if (loggedIn) {
        toggleFavorite(slug).catch(() => {}); // optimistic; DB write is best-effort
      } else {
        write(next);
      }
    },
    [favorites, loggedIn],
  );

  const isFavorite = React.useCallback((slug: string) => favorites.includes(slug), [favorites]);

  return { favorites, toggle, isFavorite };
}

/** Save/unsave button for a tool page. */
export function FavoriteButton({ slug, className }: { slug: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(slug);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toggle(slug)}
      aria-pressed={fav}
      className={className}
      title={fav ? "Remove from favorites" : "Save to favorites"}
    >
      <StarIcon className={cn("size-4", fav && "fill-amber-400 text-amber-400")} />
      {fav ? "Saved" : "Save"}
    </Button>
  );
}
