"use client";

import * as React from "react";
import { UploadIcon, DownloadIcon, Loader2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CloudImport } from "@/modules/cloud/cloud-import";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function downloadPdf(bytes: Uint8Array, name: string) {
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function PdfPageNumbers() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [position, setPosition] = React.useState("bottom-center");
  const [start, setStart] = React.useState("1");
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
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const size = 11;
      const from = parseInt(start) || 1;
      doc.getPages().forEach((page, i) => {
        const { width } = page.getSize();
        const label = String(from + i);
        const tw = font.widthOfTextAtSize(label, size);
        let x = width / 2 - tw / 2;
        if (position === "bottom-right") x = width - tw - 40;
        else if (position === "bottom-left") x = 40;
        page.drawText(label, { x, y: 24, size, font, color: rgb(0.4, 0.4, 0.4) });
      });
      downloadPdf(await doc.save(), "numbered.pdf");
    } catch {
      setError("Could not add page numbers.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose a PDF</span>
        <span className="text-xs text-muted-foreground">Numbered in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      <CloudImport accept="application/pdf" onFile={(f) => onFile(f)} onError={setError} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && pageCount > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {file.name} · {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pn-pos">Position</Label>
              <select id="pn-pos" value={position} onChange={(e) => setPosition(e.target.value)} className={selectClass}>
                <option value="bottom-center">Bottom center</option>
                <option value="bottom-right">Bottom right</option>
                <option value="bottom-left">Bottom left</option>
              </select>
            </div>
            <div className="flex w-28 flex-col gap-1.5">
              <Label htmlFor="pn-start">Start at</Label>
              <Input id="pn-start" type="number" min={0} value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <Button className="mb-0.5" onClick={run} disabled={busy}>
              {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
              Add numbers &amp; download
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
