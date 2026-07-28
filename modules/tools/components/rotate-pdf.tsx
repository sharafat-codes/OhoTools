"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { FileResult, formatBytes } from "@/modules/tools/components/tool-result";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CloudImport } from "@/modules/cloud/cloud-import";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type Result = { url: string; name: string; size: number };

export function RotatePdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [angle, setAngle] = React.useState(90);
  const [pageCount, setPageCount] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);

  function clearResult() {
    setResult((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return null;
    });
  }

  async function onFile(f: File | undefined) {
    if (!f) return;
    setError(null);
    clearResult();
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
      const blob = new Blob([new Uint8Array(await doc.save())], { type: "application/pdf" });
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url: URL.createObjectURL(blob), name: "rotated.pdf", size: blob.size };
      });
    } catch {
      setError("Could not rotate the PDF.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="application/pdf"
        onFile={(f) => onFile(f)}
        title="Drag & drop a PDF, or click to browse"
        hint="Rotated in your browser — nothing is uploaded."
      />

      <CloudImport accept="application/pdf" onFile={(f) => onFile(f)} onError={setError} />

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
              {busy ? <Loader2Icon className="animate-spin" /> : null}
              Rotate PDF
            </Button>
          </div>

          {result && <FileResult href={result.url} filename={result.name} meta={formatBytes(result.size)} />}
        </>
      )}
    </div>
  );
}
