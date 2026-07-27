"use client";

import * as React from "react";
import Link from "next/link";
import { UploadIcon, DownloadIcon, XIcon, ArrowUpIcon, ArrowDownIcon, SparklesIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";
import { CloudImport } from "@/modules/cloud/cloud-import";

const FREE_LIMIT = 2;

type Item = { id: number; file: File };

export function MergePdf() {
  const { data } = useSession();
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const idRef = React.useRef(0);
  const [items, setItems] = React.useState<Item[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))
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

  async function merge() {
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      const targets = pro ? items : items.slice(0, FREE_LIMIT);
      for (const it of targets) {
        const src = await PDFDocument.load(await it.file.arrayBuffer());
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      const bytes = await out.save();
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not merge those files. Make sure they're valid, unencrypted PDFs.");
    }
    setBusy(false);
  }

  const overLimit = !pro && items.length > FREE_LIMIT;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose PDF files</span>
        <span className="text-xs text-muted-foreground">Combined in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </label>

      <CloudImport accept="application/pdf" multiple onFileList={addFiles} onError={setError} />

      {!pro && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          <span className="flex-1 text-muted-foreground">
            Free merges up to {FREE_LIMIT} PDFs.{" "}
            <span className="font-medium text-foreground">Go Pro to merge as many as you like.</span>
          </span>
          <Link href="/pricing" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
            Go Pro
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <>
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
            <Button onClick={merge} disabled={busy || items.length < 2}>
              {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
              Merge {overLimit ? `first ${FREE_LIMIT}` : items.length} PDFs
            </Button>
            <Button variant="ghost" onClick={() => setItems([])}>Clear</Button>
          </div>
        </>
      )}
    </div>
  );
}
