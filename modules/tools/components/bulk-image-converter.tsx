"use client";

import * as React from "react";
import Link from "next/link";
import JSZip from "jszip";
import { DownloadIcon, XIcon, SparklesIcon, Loader2Icon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";
import { CloudImport } from "@/modules/cloud/cloud-import";

const FREE_LIMIT = 3;
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type Fmt = "original" | "image/png" | "image/jpeg" | "image/webp";
const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

type Item = {
  id: number;
  file: File;
  name: string;
  result?: { blob: Blob; url: string; size: number; outName: string };
};

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

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export function BulkImageConverter() {
  const { data } = useSession();
  const plan = (data?.user as { plan?: string } | undefined)?.plan ?? "FREE";
  const pro = isPro(plan);

  const idRef = React.useRef(0);
  const [items, setItems] = React.useState<Item[]>([]);
  const [fmt, setFmt] = React.useState<Fmt>("image/jpeg");
  const [quality, setQuality] = React.useState(85);
  const [maxSize, setMaxSize] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const limit = pro ? Infinity : FREE_LIMIT;
  const overLimit = items.length > limit;

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ id: idRef.current++, file: f, name: f.name }));
    setItems((prev) => [...prev, ...next]);
  }

  function removeItem(id: number) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.result) URL.revokeObjectURL(target.result.url);
      return prev.filter((i) => i.id !== id);
    });
  }

  function clearAll() {
    items.forEach((i) => i.result && URL.revokeObjectURL(i.result.url));
    setItems([]);
  }

  async function convertAll() {
    setBusy(true);
    const targets = items.slice(0, limit === Infinity ? items.length : limit);
    const updated = [...items];
    for (const item of targets) {
      try {
        const img = await loadImage(item.file);
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        const m = parseInt(maxSize);
        if (Number.isFinite(m) && m > 0 && (w > m || h > m)) {
          const s = Math.min(m / w, m / h);
          w = Math.round(w * s);
          h = Math.round(h * s);
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        const type = fmt === "original" ? item.file.type || "image/png" : fmt;
        if (type === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
        }
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);
        const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, type, quality / 100));
        if (!blob) continue;
        const base = item.name.replace(/\.[^.]+$/, "") || "image";
        const outName = `${base}.${EXT[type] ?? "png"}`;
        const idx = updated.findIndex((u) => u.id === item.id);
        if (updated[idx]?.result) URL.revokeObjectURL(updated[idx].result!.url);
        updated[idx] = { ...item, result: { blob, url: URL.createObjectURL(blob), size: blob.size, outName } };
      } catch {
        /* skip unreadable */
      }
    }
    setItems(updated);
    setBusy(false);
  }

  async function downloadZip() {
    const zip = new JSZip();
    items.forEach((i) => {
      if (i.result) zip.file(i.result.outName, i.result.blob);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "images.zip");
    URL.revokeObjectURL(url);
  }

  const converted = items.filter((i) => i.result);
  const showQuality = fmt !== "image/png";

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        multiple
        onFiles={addFiles}
        title="Drag & drop images, or click to browse"
        hint="Select multiple images — converted in your browser, never uploaded."
      />

      <CloudImport accept="image/*" multiple onFileList={addFiles} />

      {!pro && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-muted-foreground">
            Free converts up to {FREE_LIMIT} images per batch.{" "}
            <span className="font-medium text-foreground">Go Pro for unlimited images + one-click ZIP.</span>
          </span>
          <Link href="/pricing" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
            Go Pro
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bic-fmt">Format</Label>
              <select id="bic-fmt" value={fmt} onChange={(e) => setFmt(e.target.value as Fmt)} className={selectClass}>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
                <option value="original">Keep original</option>
              </select>
            </div>
            <div className="flex w-32 flex-col gap-1.5">
              <Label htmlFor="bic-max">Max size (px)</Label>
              <Input id="bic-max" type="number" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} placeholder="none" />
            </div>
            {showQuality && (
              <div className="flex min-w-40 flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label>Quality</Label>
                  <span className="text-sm text-muted-foreground">{quality}%</span>
                </div>
                <Slider value={[quality]} min={10} max={100} onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={convertAll} disabled={busy}>
              {busy ? <Loader2Icon className="animate-spin" /> : null}
              Convert {overLimit ? `first ${FREE_LIMIT}` : "all"}
            </Button>
            {converted.length > 0 &&
              (pro ? (
                <Button variant="outline" onClick={downloadZip}>
                  <DownloadIcon />
                  Download ZIP ({converted.length})
                </Button>
              ) : (
                <Button variant="outline" render={<Link href="/pricing" />}>
                  <SparklesIcon />
                  ZIP download is Pro
                </Button>
              ))}
            <Button variant="ghost" onClick={clearAll}>Clear</Button>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item, i) => {
              const locked = !pro && i >= FREE_LIMIT;
              return (
                <Card key={item.id} className={locked ? "opacity-50" : undefined}>
                  <CardContent className="flex items-center gap-3 py-3">
                    <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
                    {locked ? (
                      <span className="shrink-0 text-xs text-muted-foreground">Pro</span>
                    ) : item.result ? (
                      <>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatBytes(item.file.size)} → {formatBytes(item.result.size)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => item.result && triggerDownload(item.result.url, item.result.outName)}
                        >
                          <DownloadIcon />
                        </Button>
                      </>
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(item.file.size)}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove"
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
