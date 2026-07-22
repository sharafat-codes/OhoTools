"use client";

import * as React from "react";
import Link from "next/link";
import JSZip from "jszip";
import { UploadIcon, DownloadIcon, SparklesIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

const FREE_LIMIT = 3;
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type Rendered = { page: number; url: string; blob: Blob };

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  return pdfjs;
}

export function PdfToImages() {
  const { data } = useSession();
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [format, setFormat] = React.useState<"image/jpeg" | "image/png">("image/jpeg");
  const [quality, setQuality] = React.useState(90);
  const [scale, setScale] = React.useState(2);
  const [results, setResults] = React.useState<Rendered[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setError(null);
    setFile(f);
    setResults((prev) => {
      prev.forEach((r) => URL.revokeObjectURL(r.url));
      return [];
    });
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
      setPageCount(doc.numPages);
    } catch {
      setError("Could not read that PDF. It may be encrypted or corrupted.");
      setFile(null);
      setPageCount(0);
    }
  }

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const max = pro ? doc.numPages : Math.min(doc.numPages, FREE_LIMIT);
      const out: Rendered[] = [];
      for (let n = 1; n <= max; n++) {
        const page = await doc.getPage(n);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        if (format === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), format, quality / 100));
        out.push({ page: n, url: URL.createObjectURL(blob), blob });
      }
      setResults((prev) => {
        prev.forEach((r) => URL.revokeObjectURL(r.url));
        return out;
      });
    } catch {
      setError("Could not convert this PDF to images. Try a different file.");
    }
    setBusy(false);
  }

  async function downloadZip() {
    const zip = new JSZip();
    const ext = format === "image/png" ? "png" : "jpg";
    results.forEach((r) => zip.file(`page-${r.page}.${ext}`, r.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pdf-images.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  const ext = format === "image/png" ? "png" : "jpg";
  const showQuality = format === "image/jpeg";

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose a PDF</span>
        <span className="text-xs text-muted-foreground">Converted to images in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {!pro && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-muted-foreground">
            Free converts the first {FREE_LIMIT} pages.{" "}
            <span className="font-medium text-foreground">Go Pro for all pages + a one-click ZIP.</span>
          </span>
          <Link href="/pricing" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
            Go Pro
          </Link>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && pageCount > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {file.name} · {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pti-fmt">Format</Label>
              <select id="pti-fmt" value={format} onChange={(e) => setFormat(e.target.value as "image/jpeg" | "image/png")} className={selectClass}>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pti-scale">Resolution</Label>
              <select id="pti-scale" value={scale} onChange={(e) => setScale(Number(e.target.value))} className={selectClass}>
                <option value={1}>Standard</option>
                <option value={1.5}>High</option>
                <option value={2}>Very high</option>
                <option value={3}>Maximum</option>
              </select>
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

          <div className="flex flex-wrap gap-2">
            <Button onClick={convert} disabled={busy}>
              {busy ? <Loader2Icon className="animate-spin" /> : null}
              Convert to {ext.toUpperCase()}
            </Button>
            {results.length > 0 &&
              (pro ? (
                <Button variant="outline" onClick={downloadZip}>
                  <DownloadIcon />
                  Download ZIP ({results.length})
                </Button>
              ) : (
                <Button variant="outline" render={<Link href="/pricing" />}>
                  <SparklesIcon />
                  ZIP is Pro
                </Button>
              ))}
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((r) => (
                <Card key={r.page}>
                  <CardContent className="flex flex-col items-center gap-2 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.url} alt={`Page ${r.page}`} className="max-h-40 w-full rounded border border-border object-contain" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = r.url;
                        a.download = `page-${r.page}.${ext}`;
                        a.click();
                      }}
                    >
                      <DownloadIcon />
                      Page {r.page}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
