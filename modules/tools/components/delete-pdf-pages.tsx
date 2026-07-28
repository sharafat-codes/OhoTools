"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { FileResult, formatBytes } from "@/modules/tools/components/tool-result";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CloudImport } from "@/modules/cloud/cloud-import";

function parsePages(input: string, max: number): number[] {
  const pages = new Set<number>();
  for (const part of input.split(",")) {
    const t = part.trim();
    if (!t) continue;
    const m = t.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) continue;
    let a = Number(m[1]);
    let b = m[2] ? Number(m[2]) : a;
    if (a > b) [a, b] = [b, a];
    for (let i = a; i <= b; i++) if (i >= 1 && i <= max) pages.add(i);
  }
  return [...pages];
}

type Result = { url: string; name: string; size: number };

export function DeletePdfPages() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [toDelete, setToDelete] = React.useState("");
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
    const remove = new Set(parsePages(toDelete, pageCount));
    if (remove.size === 0) {
      setError(`Enter which pages to delete (1–${pageCount}).`);
      return;
    }
    if (remove.size >= pageCount) {
      setError("That would delete every page — keep at least one.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const keep = [];
      for (let i = 0; i < pageCount; i++) if (!remove.has(i + 1)) keep.push(i);
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, keep);
      pages.forEach((p) => out.addPage(p));
      const blob = new Blob([new Uint8Array(await out.save())], { type: "application/pdf" });
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { url: URL.createObjectURL(blob), name: "edited.pdf", size: blob.size };
      });
    } catch {
      setError("Could not edit the PDF.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="application/pdf"
        onFile={(f) => onFile(f)}
        title="Drag & drop a PDF, or click to browse"
        hint="Edited in your browser — nothing is uploaded."
      />

      <CloudImport accept="application/pdf" onFile={(f) => onFile(f)} onError={setError} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && pageCount > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {file.name} · {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="del-pages">Pages to delete</Label>
            <div className="flex gap-2">
              <Input
                id="del-pages"
                value={toDelete}
                onChange={(e) => setToDelete(e.target.value)}
                placeholder={`e.g. 1, 4-6, ${pageCount}`}
                className="font-mono"
              />
              <Button onClick={run} disabled={busy}>
                {busy ? <Loader2Icon className="animate-spin" /> : null}
                Delete pages
              </Button>
            </div>
          </div>

          {result && <FileResult href={result.url} filename={result.name} meta={formatBytes(result.size)} />}
        </>
      )}
    </div>
  );
}
