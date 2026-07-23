"use client";

import * as React from "react";
import { UploadIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  return pdfjs;
}

export function PdfToText() {
  const [text, setText] = React.useState("");
  const [name, setName] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setBusy(true);
    setError(null);
    setText("");
    setName(f.name);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
      let out = "";
      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        const content = await page.getTextContent();
        const line = content.items.map((it) => ("str" in it ? it.str : "")).join(" ");
        out += line.replace(/\s+/g, " ").trim() + "\n\n";
      }
      const result = out.trim();
      setText(result);
      if (!result) setError("No selectable text found — this looks like a scanned (image-only) PDF.");
    } catch {
      setError("Could not read that PDF. It may be encrypted or corrupted.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose a PDF</span>
        <span className="text-xs text-muted-foreground">Text is extracted in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      {busy && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" /> Extracting text…
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {text && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="ptt-out">Extracted text {name && <span className="text-muted-foreground">· {name}</span>}</Label>
            <CopyButton value={text} label="" />
          </div>
          <Textarea id="ptt-out" readOnly value={text} className="min-h-64 text-sm" />
        </div>
      )}
    </div>
  );
}
