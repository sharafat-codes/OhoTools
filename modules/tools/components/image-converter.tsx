"use client";

import * as React from "react";
import { UploadIcon, DownloadIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

type Fmt = "image/png" | "image/jpeg" | "image/webp";
const EXT: Record<Fmt, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function triggerDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}

export function ImageConverter() {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [srcName, setSrcName] = React.useState("image");
  const [origSize, setOrigSize] = React.useState(0);
  const [fmt, setFmt] = React.useState<Fmt>("image/jpeg");
  const [quality, setQuality] = React.useState(90);
  const [result, setResult] = React.useState<{ url: string; size: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function generate(image: HTMLImageElement, f: Fmt, q: number) {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (f === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        setResult((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url: URL.createObjectURL(blob), size: blob.size };
        });
      },
      f,
      q / 100,
    );
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setSrcName(file.name.replace(/\.[^.]+$/, "") || "image");
    setOrigSize(file.size);
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setError(null);
      generate(image, fmt, quality);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setError("Could not read that image.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  const showQuality = fmt !== "image/png";

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose an image</span>
        <span className="text-xs text-muted-foreground">Convert between PNG, JPG, and WebP — in your browser.</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {img && (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ic-fmt">Convert to</Label>
              <select
                id="ic-fmt"
                value={fmt}
                onChange={(e) => {
                  const f = e.target.value as Fmt;
                  setFmt(f);
                  generate(img, f, quality);
                }}
                className={selectClass}
              >
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
            {showQuality && (
              <div className="flex min-w-48 flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label>Quality</Label>
                  <span className="text-sm text-muted-foreground">{quality}%</span>
                </div>
                <Slider
                  value={[quality]}
                  min={10}
                  max={100}
                  onValueChange={(v) => {
                    const q = Array.isArray(v) ? v[0] : v;
                    setQuality(q);
                    generate(img, fmt, q);
                  }}
                />
              </div>
            )}
          </div>

          {result && (
            <Card>
              <CardContent className="flex flex-col gap-3 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.url} alt="Converted preview" className="max-h-64 w-fit max-w-full rounded-lg border border-border" />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {formatBytes(origSize)} → {formatBytes(result.size)}
                    {origSize > 0 && (
                      <span className={result.size < origSize ? "text-emerald-500" : "text-muted-foreground"}>
                        {" "}
                        ({result.size < origSize ? "−" : "+"}
                        {Math.abs(Math.round((1 - result.size / origSize) * 100))}%)
                      </span>
                    )}
                  </span>
                  <Button onClick={() => triggerDownload(result.url, `${srcName}.${EXT[fmt]}`)}>
                    <DownloadIcon />
                    Download {EXT[fmt].toUpperCase()}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
