"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BARCODE_FORMATS } from "@/modules/barcode/constants";
import { barcodeToDataUrl, barcodeToSvgString } from "@/modules/barcode/render";

export function BarcodeGenerator() {
  const [format, setFormat] = React.useState("code128");
  const [data, setData] = React.useState("OHOTOOL-12345");
  const [scale, setScale] = React.useState(3);
  const [height, setHeight] = React.useState(60);
  const [includeText, setIncludeText] = React.useState(true);

  const result = React.useMemo(() => {
    if (!data.trim()) return { url: "", error: "" };
    try {
      return { url: barcodeToDataUrl({ data, format, scale, height, includeText }), error: "" };
    } catch (e) {
      return { url: "", error: e instanceof Error ? e.message : "That value isn't valid for this barcode format." };
    }
  }, [data, format, scale, height, includeText]);

  function pickFormat(f: string) {
    setFormat(f);
    const def = BARCODE_FORMATS.find((x) => x.value === f);
    if (def) setData(def.example);
  }

  function downloadPng() {
    if (!result.url) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `barcode-${format}.png`;
    a.click();
  }
  function downloadSvg() {
    try {
      const svg = barcodeToSvgString({ data, format, scale, height, includeText });
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `barcode-${format}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* invalid — button is effectively disabled via the error state below */
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Format</span>
          <select
            value={format}
            onChange={(e) => pickFormat(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
          >
            {BARCODE_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Value to encode</span>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder={BARCODE_FORMATS.find((f) => f.value === format)?.example}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex justify-between font-medium">Size <span className="text-muted-foreground">{scale}×</span></span>
          <input type="range" min={1} max={8} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="flex justify-between font-medium">Height <span className="text-muted-foreground">{height}px</span></span>
          <input type="range" min={10} max={120} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="accent-primary" />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={includeText} onChange={(e) => setIncludeText(e.target.checked)} className="accent-primary" />
          <span className="font-medium">Show the value under the barcode</span>
        </label>
      </div>

      {/* Preview */}
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-border bg-white p-6">
        {result.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={result.url} alt={`${format} barcode for ${data}`} className="max-w-full" />
        ) : (
          <span className="text-sm text-red-500">{result.error || "Enter a value to generate a barcode."}</span>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={downloadPng} disabled={!result.url}>
          <DownloadIcon className="size-4" /> Download PNG
        </Button>
        <Button variant="outline" onClick={downloadSvg} disabled={!result.url}>
          <DownloadIcon className="size-4" /> Download SVG
        </Button>
      </div>
    </div>
  );
}
