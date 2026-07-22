"use client";

import * as React from "react";
import Link from "next/link";
import JSZip from "jszip";
import { UploadIcon, DownloadIcon, SparklesIcon, Loader2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

function parseRanges(input: string, max: number): number[] {
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
  return [...pages].sort((x, y) => x - y);
}

function downloadBytes(bytes: Uint8Array, name: string) {
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function SplitPdf() {
  const { data } = useSession();
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [ranges, setRanges] = React.useState("");
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

  async function extract() {
    if (!file) return;
    const pages = parseRanges(ranges, pageCount);
    if (pages.length === 0) {
      setError(`Enter a valid page range between 1 and ${pageCount}.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      downloadBytes(await out.save(), "extracted.pdf");
    } catch {
      setError("Could not extract those pages.");
    }
    setBusy(false);
  }

  async function burst() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const zip = new JSZip();
      const base = file.name.replace(/\.pdf$/i, "") || "page";
      for (let i = 0; i < src.getPageCount(); i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        zip.file(`${base}-${i + 1}.pdf`, await out.save());
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${base}-pages.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not split the PDF.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose a PDF</span>
        <span className="text-xs text-muted-foreground">Split in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && pageCount > 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            {file.name} · {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sp-range">Pages to extract</Label>
            <div className="flex gap-2">
              <Input
                id="sp-range"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder={`e.g. 1-3, 5, 8-${pageCount}`}
                className="font-mono"
              />
              <Button onClick={extract} disabled={busy}>
                {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
                Extract
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  Split into individual pages
                  {!pro && <SparklesIcon className="size-3.5 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">Every page as its own PDF, downloaded as a ZIP.</p>
              </div>
              {pro ? (
                <Button variant="outline" onClick={burst} disabled={busy}>
                  {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
                  Split all ({pageCount})
                </Button>
              ) : (
                <Button variant="outline" render={<Link href="/pricing" />}>
                  <SparklesIcon />
                  Pro
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
