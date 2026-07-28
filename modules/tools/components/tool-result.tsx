"use client";

import * as React from "react";
import { CheckCircle2Icon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Branded success container used for tool results across the app.
 * Matches the polished video-tool result card for a consistent, modern feel.
 */
export function ResultCard({
  title = "Your file is ready",
  children,
  className,
}: {
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4", className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <CheckCircle2Icon className="size-4 shrink-0 text-primary" />
        {title}
      </div>
      {children}
    </div>
  );
}

/**
 * Success card for a single generated file: an optional preview (children),
 * the file name + size, and a prominent Download button.
 */
export function FileResult({
  href,
  filename,
  meta,
  title,
  children,
}: {
  href: string;
  filename: string;
  meta?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <ResultCard title={title}>
      {children}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{filename}</p>
          {meta && <p className="text-xs text-muted-foreground">{meta}</p>}
        </div>
        <Button render={<a href={href} download={filename} />}>
          <DownloadIcon className="size-4" />
          Download
        </Button>
      </div>
    </ResultCard>
  );
}
