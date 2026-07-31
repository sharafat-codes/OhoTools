"use client";

import * as React from "react";
import { toast } from "sonner";
import { CopyIcon, DownloadIcon, LoaderCircleIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { ResultCard } from "@/modules/tools/components/tool-result";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type Detail = "low" | "medium" | "high";
const COLORS: Record<Detail, number> = { low: 8, medium: 16, high: 32 };

export function ImageToSvg() {
  const [imgData, setImgData] = React.useState<ImageData | null>(null);
  const [srcName, setSrcName] = React.useState("image");
  const [detail, setDetail] = React.useState<Detail>("medium");
  const [svg, setSvg] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const trace = React.useCallback(async (data: ImageData, d: Detail) => {
    setBusy(true);
    try {
      const mod = (await import("imagetracerjs")) as unknown as {
        default?: { imagedataToSVG: (d: ImageData, o: unknown) => string };
        imagedataToSVG?: (d: ImageData, o: unknown) => string;
      };
      const tracer = mod.default ?? mod;
      const out = tracer.imagedataToSVG!(data, { numberofcolors: COLORS[d] });
      setSvg(out);
      setError(null);
    } catch {
      setSvg("");
      setError("Could not vectorize that image. Try a smaller or simpler image.");
    } finally {
      setBusy(false);
    }
  }, []);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setSrcName(file.name.replace(/\.[^.]+$/, "") || "image");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Downscale large images before tracing — vectorizing is CPU-heavy.
      const MAX = 1000;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (Math.max(w, h) > MAX) {
        const s = MAX / Math.max(w, h);
        w = Math.round(w * s);
        h = Math.round(h * s);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h);
        setImgData(data);
        trace(data, detail);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError("Could not read that image.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function download() {
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${srcName}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function copy() {
    navigator.clipboard?.writeText(svg).then(() => toast.success("Copied SVG"), () => toast.error("Could not copy."));
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={onFile}
        title="Drag & drop an image (PNG/JPG), or click to browse"
        hint="Trace it into a scalable SVG — in your browser."
      />

      {imgData && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="i2s-detail">Detail</Label>
          <select
            id="i2s-detail"
            value={detail}
            onChange={(e) => {
              const d = e.target.value as Detail;
              setDetail(d);
              if (imgData) trace(imgData, d);
            }}
            className={selectClass}
          >
            <option value="low">Low — fewer colors, smaller file</option>
            <option value="medium">Medium</option>
            <option value="high">High — more detail</option>
          </select>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {busy && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircleIcon className="size-4 animate-spin" />
          Vectorizing…
        </p>
      )}

      {svg && !busy && (
        <ResultCard title="Vectorized SVG">
          <div
            className="max-h-72 overflow-auto rounded-lg border border-border bg-white p-2 [&>svg]:h-auto [&>svg]:max-w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">{(new Blob([svg]).size / 1024).toFixed(1)} KB SVG</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copy}>
                <CopyIcon className="size-3.5" />
                Copy
              </Button>
              <Button size="sm" onClick={download}>
                <DownloadIcon className="size-3.5" />
                Download SVG
              </Button>
            </div>
          </div>
        </ResultCard>
      )}
    </div>
  );
}
