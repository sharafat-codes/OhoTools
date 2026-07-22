"use client";

import * as React from "react";
import JSZip from "jszip";
import { DownloadIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const SIZES = [16, 32, 48, 64, 180, 192, 512];

type Generated = { size: number; url: string };

const SNIPPET = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />`;

function triggerDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}

export function FaviconGenerator() {
  const [generated, setGenerated] = React.useState<Generated[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, or SVG).");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const out: Generated[] = SIZES.map((size) => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const scale = Math.max(size / img.width, size / img.height);
          const dw = img.width * scale;
          const dh = img.height * scale;
          ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
        }
        return { size, url: canvas.toDataURL("image/png") };
      });
      setGenerated(out);
      setError(null);
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      setError("Could not read that image. Try a different file.");
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }

  async function downloadZip() {
    const zip = new JSZip();
    for (const g of generated) {
      zip.file(`favicon-${g.size}x${g.size}.png`, g.url.split(",")[1], { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "favicons.zip");
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose an image</span>
        <span className="text-xs text-muted-foreground">
          PNG, JPG, or SVG — a square image of 512×512 or larger works best.
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {generated.length > 0 && (
        <>
          <div className="flex flex-wrap items-end gap-4">
            {generated
              .filter((g) => [16, 32, 48, 180].includes(g.size))
              .map((g) => (
                <div key={g.size} className="flex flex-col items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.url}
                    alt={`${g.size}×${g.size} favicon preview`}
                    width={g.size}
                    height={g.size}
                    className="rounded border border-border"
                    style={{ imageRendering: g.size <= 48 ? "pixelated" : "auto" }}
                  />
                  <span className="text-xs text-muted-foreground">{g.size}px</span>
                </div>
              ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={downloadZip}>
              <DownloadIcon />
              Download all (ZIP)
            </Button>
            {generated.map((g) => (
              <Button
                key={g.size}
                variant="outline"
                size="sm"
                onClick={() => triggerDownload(g.url, `favicon-${g.size}x${g.size}.png`)}
              >
                {g.size}px
              </Button>
            ))}
          </div>

          <Card>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Add this to your &lt;head&gt;</span>
                <CopyButton value={SNIPPET} label="" />
              </div>
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                <code className="font-mono">{SNIPPET}</code>
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
