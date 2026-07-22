"use client";

import * as React from "react";
import { UploadIcon, DownloadIcon, Loader2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

function downloadPdf(bytes: Uint8Array, name: string) {
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function WatermarkPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [text, setText] = React.useState("CONFIDENTIAL");
  const [opacity, setOpacity] = React.useState(20);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setError(null);
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
    } catch {
      setError("Could not read that PDF. It may be encrypted or corrupted.");
      setFile(null);
      setPageCount(0);
    }
  }

  async function run() {
    if (!file || !text.trim()) {
      setError("Enter watermark text.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument, StandardFonts, degrees, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const wPer = font.widthOfTextAtSize(text, 1);
      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const diag = Math.sqrt(width * width + height * height);
        const size = Math.min((diag * 0.7) / wPer, 140);
        const tw = wPer * size;
        const rad = Math.PI / 4;
        page.drawText(text, {
          x: width / 2 - (Math.cos(rad) * tw) / 2,
          y: height / 2 - (Math.sin(rad) * tw) / 2,
          size,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity / 100,
          rotate: degrees(45),
        });
      }
      downloadPdf(await doc.save(), "watermarked.pdf");
    } catch {
      setError("Could not add the watermark.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose a PDF</span>
        <span className="text-xs text-muted-foreground">Watermarked in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && pageCount > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {file.name} · {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wm-text">Watermark text</Label>
            <Input id="wm-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="CONFIDENTIAL" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Opacity</Label>
              <span className="text-sm text-muted-foreground">{opacity}%</span>
            </div>
            <Slider value={[opacity]} min={5} max={60} onValueChange={(v) => setOpacity(Array.isArray(v) ? v[0] : v)} />
          </div>
          <Button className="w-fit" onClick={run} disabled={busy}>
            {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
            Add watermark &amp; download
          </Button>
        </>
      )}
    </div>
  );
}
