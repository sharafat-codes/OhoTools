"use client";

import * as React from "react";
import { ImageOffIcon } from "lucide-react";

import { renderHistoryItem } from "@/modules/history/render";
import type { HistoryItem } from "@/modules/history/types";
import { cn } from "@/lib/utils";

export function AssetThumb({
  item,
  className,
}: {
  item: HistoryItem;
  className?: string;
}) {
  const [url, setUrl] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await renderHistoryItem(item);
        if (!cancelled) setUrl(u);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [item]);

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-md border border-border bg-white",
        className,
      )}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="size-full object-contain p-2" />
      ) : failed ? (
        <ImageOffIcon className="size-5 text-muted-foreground" />
      ) : null}
    </div>
  );
}
