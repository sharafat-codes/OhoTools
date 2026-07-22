"use client";

import * as React from "react";
import Link from "next/link";
import { UploadIcon, DownloadIcon, XIcon, ArrowUpIcon, ArrowDownIcon, SparklesIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

const FREE_LIMIT = 3;
const A4 = { w: 595.28, h: 841.89 };
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type Item = { id: number; file: File };

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

async function toPngBytes(img: HTMLImageElement): Promise<Uint8Array> {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/png"));
  return new Uint8Array(await blob.arrayBuffer());
}

export function ImagesToPdf() {
  const { data } = useSession();
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const idRef = React.useRef(0);
  const [items, setItems] = React.useState<Item[]>([]);
  const [pageMode, setPageMode] = React.useState("fit");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ id: idRef.current++, file: f }));
    if (next.length) {
      setItems((prev) => [...prev, ...next]);
      setError(null);
    }
  }

  function move(id: number, dir: -1 | 1) {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      const targets = pro ? items : items.slice(0, FREE_LIMIT);
      for (const it of targets) {
        const img = await loadImage(it.file);
        const png = await pdf.embedPng(await toPngBytes(img));
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (pageMode === "a4") {
          const page = pdf.addPage([A4.w, A4.h]);
          const margin = 36;
          const maxW = A4.w - margin * 2;
          const maxH = A4.h - margin * 2;
          const scale = Math.min(maxW / iw, maxH / ih, 1);
          const w = iw * scale;
          const h = ih * scale;
          page.drawImage(png, { x: (A4.w - w) / 2, y: (A4.h - h) / 2, width: w, height: h });
        } else {
          const page = pdf.addPage([iw, ih]);
          page.drawImage(png, { x: 0, y: 0, width: iw, height: ih });
        }
      }
      const bytes = await pdf.save();
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "images.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not create the PDF. Try different images.");
    }
    setBusy(false);
  }

  const overLimit = !pro && items.length > FREE_LIMIT;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose images</span>
        <span className="text-xs text-muted-foreground">Combined into a PDF in your browser — nothing is uploaded.</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </label>

      {!pro && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-muted-foreground">
            Free combines up to {FREE_LIMIT} images.{" "}
            <span className="font-medium text-foreground">Go Pro for unlimited pages.</span>
          </span>
          <Link href="/pricing" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
            Go Pro
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="itp-page">Page size</Label>
            <select id="itp-page" value={pageMode} onChange={(e) => setPageMode(e.target.value)} className={`${selectClass} w-fit`}>
              <option value="fit">Fit to each image</option>
              <option value="a4">A4 (portrait)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item, i) => {
              const locked = !pro && i >= FREE_LIMIT;
              return (
                <Card key={item.id} className={locked ? "opacity-50" : undefined}>
                  <CardContent className="flex items-center gap-2 py-2.5">
                    <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-sm">{item.file.name}</span>
                    {locked && <span className="shrink-0 text-xs text-muted-foreground">Pro</span>}
                    <button type="button" onClick={() => move(item.id, -1)} disabled={i === 0} aria-label="Move up" className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ArrowUpIcon className="size-4" />
                    </button>
                    <button type="button" onClick={() => move(item.id, 1)} disabled={i === items.length - 1} aria-label="Move down" className="shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-30">
                      <ArrowDownIcon className="size-4" />
                    </button>
                    <button type="button" onClick={() => setItems((p) => p.filter((x) => x.id !== item.id))} aria-label="Remove" className="shrink-0 text-muted-foreground hover:text-foreground">
                      <XIcon className="size-4" />
                    </button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex flex-wrap gap-2">
            <Button onClick={create} disabled={busy}>
              {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
              Create PDF{overLimit ? ` (first ${FREE_LIMIT})` : ""}
            </Button>
            <Button variant="ghost" onClick={() => setItems([])}>Clear</Button>
          </div>
        </>
      )}
    </div>
  );
}
