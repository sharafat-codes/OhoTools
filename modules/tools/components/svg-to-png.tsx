"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { ResultCard } from "@/modules/tools/components/tool-result";
import { rasterizeSvg } from "@/modules/tools/components/svg-lib";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Fmt = "image/png" | "image/jpeg" | "image/webp";
const EXT: Record<Fmt, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

type Result = { url: string; size: number; width: number; height: number };

export function SvgToPng() {
  const [svgText, setSvgText] = React.useState<string | null>(null);
  const [srcName, setSrcName] = React.useState("image");
  const [fmt, setFmt] = React.useState<Fmt>("image/png");
  const [scale, setScale] = React.useState(1);
  const [result, setResult] = React.useState<Result | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const run = React.useCallback((text: string, f: Fmt, s: number) => {
    rasterizeSvg(text, f, s)
      .then(({ blob, width, height }) => {
        setError(null);
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url: URL.createObjectURL(blob), size: blob.size, width, height };
        });
      })
      .catch((e: Error) => setError(e.message || "Could not convert that SVG."));
  }, []);

  function onFile(file: File | undefined) {
    if (!file) return;
    const isSvg = file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
    if (!isSvg) {
      setError("Please choose an SVG file.");
      return;
    }
    setSrcName(file.name.replace(/\.svg$/i, "") || "image");
    file
      .text()
      .then((t) => {
        setSvgText(t);
        run(t, fmt, scale);
      })
      .catch(() => setError("Could not read that file."));
  }

  function download() {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${srcName}.${EXT[fmt]}`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/svg+xml,.svg"
        onFile={onFile}
        title="Drag & drop an SVG, or click to browse"
        hint="Convert SVG to PNG, JPG, or WebP — in your browser."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {svgText && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="svg-fmt">Convert to</Label>
              <select
                id="svg-fmt"
                value={fmt}
                onChange={(e) => {
                  const f = e.target.value as Fmt;
                  setFmt(f);
                  run(svgText, f, scale);
                }}
                className={selectClass}
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="svg-scale">Scale</Label>
              <select
                id="svg-scale"
                value={scale}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  setScale(s);
                  run(svgText, fmt, s);
                }}
                className={selectClass}
              >
                <option value={1}>1× (original)</option>
                <option value={2}>2×</option>
                <option value={3}>3×</option>
                <option value={4}>4×</option>
              </select>
            </div>
          </div>

          {result && (
            <ResultCard title="Converted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="Converted preview"
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
        </>
      )}
    </div>
  );
}
