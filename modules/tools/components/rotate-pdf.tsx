"use client";

import * as React from "react";
import { UploadIcon, DownloadIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

export function RotatePdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [angle, setAngle] = React.useState(90);
  const [pageCount, setPageCount] = React.useState(0);
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
      const { PDFDocument, degrees } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.getPages().forEach((p) => {
        const cur = p.getRotation().angle;
        p.setRotation(degrees((cur + angle) % 360));
      });
      downloadPdf(await doc.save(), "rotated.pdf");
    } catch {
      setError("Could not rotate the PDF.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose a PDF</span>
        <span className="text-xs text-muted-foreground">Rotated in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && pageCount > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {file.name} · {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rot-angle">Rotate all pages by</Label>
              <select id="rot-angle" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className={selectClass}>
                <option value={90}>90° clockwise</option>
                <option value={180}>180°</option>
                <option value={270}>90° counter-clockwise</option>
              </select>
            </div>
            <Button className="mb-0.5" onClick={run} disabled={busy}>
              {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
              Rotate &amp; download
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
