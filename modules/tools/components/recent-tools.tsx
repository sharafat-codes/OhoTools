"use client";

import * as React from "react";
import Link from "next/link";
import { HistoryIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KEY = "oho-recent-tools";
const MAX = 8;

type Recent = { slug: string; name: string };

function read(): Recent[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Recent[]) : [];
    return Array.isArray(list) ? list.filter((t) => t && t.slug && t.name) : [];
  } catch {
    return [];
  }
}

/** Records the current tool as recently used (client-side, this browser only). */
export function RecentToolTracker({ slug, name }: { slug: string; name: string }) {
  React.useEffect(() => {
    try {
      const next = [{ slug, name }, ...read().filter((t) => t.slug !== slug)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    // Anonymous usage beacon for the admin analytics dashboard (fire-and-forget).
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {});
  }, [slug, name]);
  return null;
}

/** Dashboard widget — shows the tools used most recently in this browser. */
export function RecentTools() {
  const [items, setItems] = React.useState<Recent[] | null>(null);

  React.useEffect(() => {
    const list = read();
    Promise.resolve().then(() => setItems(list));
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HistoryIcon className="size-4 text-primary" /> Recently used
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
