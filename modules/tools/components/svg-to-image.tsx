"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { ResultCard } from "@/modules/tools/components/tool-result";
import { rasterizeSvg } from "@/modules/tools/components/svg-lib";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Fmt = "image/png" | "image/jpeg" | "image/webp";
const EXT: Record<Fmt, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const SAMPLE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <rect width="120" height="120" rx="24" fill="#6d28d9"/>
  <circle cx="60" cy="60" r="30" fill="none" stroke="#ffffff" stroke-width="10"/>
</svg>`;

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

type Result = { url: string; size: number; width: number; height: number };

export function SvgToImage() {
  const [code, setCode] = React.useState("");
  const [fmt, setFmt] = React.useState<Fmt>("image/png");
  const [scale, setScale] = React.useState(2);
  const [result, setResult] = React.useState<Result | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback((text: string, f: Fmt, s: number) => {
    if (!text.trim()) {
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return null;
      });
      setError(null);
      return;
    }
    rasterizeSvg(text, f, s)
      .then(({ blob, width, height }) => {
        setError(null);
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url: URL.createObjectURL(blob), size: blob.size, width, height };
        });
      })
      .catch((e: Error) => {
        setResult(null);
        setError(e.message || "Could not render that SVG.");
      });
  }, []);

  // Re-render (debounced) whenever the code or options change.
  React.useEffect(() => {
    const id = setTimeout(() => run(code, fmt, scale), 300);
    return () => clearTimeout(id);
  }, [code, fmt, scale, run]);

  function download() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `svg-image.${EXT[fmt]}`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="svg-code">SVG code</Label>
          <button
            type="button"
            onClick={() => setCode(SAMPLE)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Paste sample
          </button>
        </div>
        <textarea
          id="svg-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={8}
          placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">…</svg>'}
          className="w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-xs leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="svgc-fmt">Export as</Label>
          <select
            id="svgc-fmt"
            value={fmt}
            onChange={(e) => setFmt(e.target.value as Fmt)}
            className={selectClass}
          >
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/webp">WebP</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="svgc-scale">Scale</Label>
          <select
            id="svgc-scale"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className={selectClass}
          >
            <option value={1}>1× (original)</option>
            <option value={2}>2×</option>
            <option value={3}>3×</option>
            <option value={4}>4×</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <ResultCard title="Preview & export">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.url}
            alt="SVG preview"
            className="max-h-64 w-fit max-w-full rounded-lg border border-border"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {result.width}×{result.height}px · {formatBytes(result.size)}
            </span>
            <Button onClick={download}>
              <DownloadIcon />
              Download {EXT[fmt].toUpperCase()}
            </Button>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
