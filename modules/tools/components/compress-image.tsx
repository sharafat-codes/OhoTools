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
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

function encode(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((res) => canvas.toBlob((b) => res(b!), type, quality));
}

export function CompressImage() {
  const { data } = useSession();
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const idRef = React.useRef(0);
  const [items, setItems] = React.useState<Item[]>([]);
  const [mode, setMode] = React.useState("quality");
  const [quality, setQuality] = React.useState(70);
  const [targetKb, setTargetKb] = React.useState("200");
  const [busy, setBusy] = React.useState(false);

  const limit = pro ? Infinity : FREE_LIMIT;

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ id: idRef.current++, file: f, name: f.name }));
    setItems((prev) => [...prev, ...next]);
  }

  async function compressOne(item: Item): Promise<Item["result"]> {
    const img = await loadImage(item.file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    // PNG has no quality knob and rarely shrinks; compress to JPEG/WebP.
    const type = item.file.type === "image/webp" ? "image/webp" : "image/jpeg";
    const ext = type === "image/webp" ? "webp" : "jpg";
    if (type === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    let blob: Blob;
    if (mode === "target") {
      const target = (parseFloat(targetKb) || 200) * 1024;
      let lo = 0.05;
      let hi = 0.95;
      blob = await encode(canvas, type, hi);
      // Binary search for the highest quality under the target size.
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const candidate = await encode(canvas, type, mid);
        if (candidate.size > target) hi = mid;
        else {
          lo = mid;
          blob = candidate;
        }
      }
    } else {
      blob = await encode(canvas, type, quality / 100);
    }
    const base = item.name.replace(/\.[^.]+$/, "") || "image";
    return { blob, url: URL.createObjectURL(blob), size: blob.size, outName: `${base}-compressed.${ext}` };
  }

  async function run() {
    setBusy(true);
    const targets = items.slice(0, limit === Infinity ? items.length : limit);
    const updated = [...items];
    for (const item of targets) {
      try {
        const result = await compressOne(item);
        const idx = updated.findIndex((u) => u.id === item.id);
        if (updated[idx]?.result) URL.revokeObjectURL(updated[idx].result!.url);
        updated[idx] = { ...item, result };
      } catch {
        /* skip */
      }
    }
    setItems(updated);
    setBusy(false);
  }

  async function downloadZip() {
    const zip = new JSZip();
    items.forEach((i) => i.result && zip.file(i.result.outName, i.result.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "compressed-images.zip");
    URL.revokeObjectURL(url);
  }

  const converted = items.filter((i) => i.result);
  const overLimit = !pro && items.length > FREE_LIMIT;

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        multiple
        onFiles={addFiles}
        title="Drag & drop images, or click to browse"
        hint="Compressed in your browser — never uploaded."
      />

      <CloudImport accept="image/*" multiple onFileList={addFiles} />

      {!pro && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-muted-foreground">
            Free compresses up to {FREE_LIMIT} images.{" "}
            <span className="font-medium text-foreground">Go Pro for unlimited + one-click ZIP.</span>
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
              <Label htmlFor="ci-mode">Compress by</Label>
              <select id="ci-mode" value={mode} onChange={(e) => setMode(e.target.value)} className={selectClass}>
                <option value="quality">Quality</option>
                <option value="target">Target size</option>
              </select>
            </div>
            {mode === "target" ? (
              <div className="flex w-32 flex-col gap-1.5">
                <Label htmlFor="ci-kb">Target (KB)</Label>
                <Input id="ci-kb" type="number" value={targetKb} onChange={(e) => setTargetKb(e.target.value)} />
              </div>
            ) : (
              <div className="flex min-w-40 flex-1 flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label>Quality</Label>
                  <span className="text-sm text-muted-foreground">{quality}%</span>
                </div>
                <Slider value={[quality]} min={10} max={95} onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={run} disabled={busy}>
              {busy ? <Loader2Icon className="animate-spin" /> : null}
              Compress {overLimit ? `first ${FREE_LIMIT}` : "all"}
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
                  ZIP is Pro
                </Button>
              ))}
            <Button variant="ghost" onClick={() => setItems([])}>Clear</Button>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item, i) => {
              const locked = !pro && i >= FREE_LIMIT;
              const saved = item.result ? Math.round((1 - item.result.size / item.file.size) * 100) : 0;
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
                          {saved > 0 && <span className="text-emerald-500"> (−{saved}%)</span>}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => item.result && triggerDownload(item.result.url, item.result.outName)}>
                          <DownloadIcon />
                        </Button>
                      </>
                    ) : (
                      <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(item.file.size)}</span>
                    )}
                    <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== item.id))} aria-label="Remove" className="shrink-0 text-muted-foreground hover:text-foreground">
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
