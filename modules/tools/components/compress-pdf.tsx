"use client";

import * as React from "react";
import Link from "next/link";
import JSZip from "jszip";
import { UploadIcon, DownloadIcon, XIcon, SparklesIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";
import { CloudImport } from "@/modules/cloud/cloud-import";

const FREE_LIMIT = 1;
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

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  return pdfjs;
}

export function CompressPdf() {
  const { data } = useSession();
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const idRef = React.useRef(0);
  const [items, setItems] = React.useState<Item[]>([]);
  const [quality, setQuality] = React.useState(60);
  const [scale, setScale] = React.useState(1.5);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const limit = pro ? Infinity : FREE_LIMIT;

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))
      .map((f) => ({ id: idRef.current++, file: f, name: f.name }));
    if (next.length) {
      setItems((prev) => [...prev, ...next]);
      setError(null);
    }
  }

  async function compressOne(item: Item, pdfjs: Awaited<ReturnType<typeof getPdfjs>>): Promise<Item["result"]> {
    const { PDFDocument } = await import("pdf-lib");
    const doc = await pdfjs.getDocument({ data: await item.file.arrayBuffer() }).promise;
    const out = await PDFDocument.create();
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(vp.width);
      canvas.height = Math.ceil(vp.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport: vp }).promise;
      const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", quality / 100));
      const jpg = await out.embedJpg(new Uint8Array(await blob.arrayBuffer()));
      const p = out.addPage([base.width, base.height]);
      p.drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
    }
    const bytes = await out.save();
    const outBlob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
    const outName = `${item.name.replace(/\.pdf$/i, "") || "document"}-compressed.pdf`;
    return { blob: outBlob, url: URL.createObjectURL(outBlob), size: outBlob.size, outName };
  }

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const pdfjs = await getPdfjs();
      const targets = items.slice(0, limit === Infinity ? items.length : limit);
      const updated = [...items];
      for (const item of targets) {
        try {
          const result = await compressOne(item, pdfjs);
          const idx = updated.findIndex((u) => u.id === item.id);
          if (updated[idx]?.result) URL.revokeObjectURL(updated[idx].result!.url);
          updated[idx] = { ...item, result };
        } catch {
          /* skip file */
        }
      }
      setItems(updated);
    } catch {
      setError("Could not compress. Make sure the files are valid, unencrypted PDFs.");
    }
    setBusy(false);
  }

  async function downloadZip() {
    const zip = new JSZip();
    items.forEach((i) => i.result && zip.file(i.result.outName, i.result.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "compressed-pdfs.zip");
    URL.revokeObjectURL(url);
  }

  const converted = items.filter((i) => i.result);
  const overLimit = !pro && items.length > FREE_LIMIT;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose PDF files</span>
        <span className="text-xs text-muted-foreground">Compressed in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </label>

      <CloudImport accept="application/pdf" multiple onFileList={addFiles} onError={setError} />

      {!pro && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-muted-foreground">
            Free compresses 1 PDF at a time.{" "}
            <span className="font-medium text-foreground">Go Pro for batch compression + ZIP.</span>
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
              <Label htmlFor="cp-scale">Resolution</Label>
              <select id="cp-scale" value={scale} onChange={(e) => setScale(Number(e.target.value))} className={selectClass}>
                <option value={1}>Low (smallest)</option>
                <option value={1.5}>Medium</option>
                <option value={2}>High</option>
              </select>
            </div>
            <div className="flex min-w-40 flex-1 flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Quality</Label>
                <span className="text-sm text-muted-foreground">{quality}%</span>
              </div>
              <Slider value={[quality]} min={20} max={90} onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button onClick={run} disabled={busy}>
              {busy ? <Loader2Icon className="animate-spin" /> : null}
              Compress {overLimit ? "1 (free)" : items.length}
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
                  Batch + ZIP is Pro
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

          <p className="text-xs text-muted-foreground">
            Tip: this compresses by re-rendering pages as images — best for scanned or image-heavy PDFs.
            Selectable text becomes part of the image.
          </p>
        </>
      )}
    </div>
  );
}
