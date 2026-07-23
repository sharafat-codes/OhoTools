"use client";

import * as React from "react";
import { DownloadIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const PAGES: Record<string, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export function TextToPdf() {
  const [input, setInput] = React.useState("");
  const [pageSize, setPageSize] = React.useState("a4");
  const [fontSize, setFontSize] = React.useState("12");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function generate() {
    if (!input.trim()) {
      setError("Enter some text first.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument, StandardFonts } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const size = Math.min(Math.max(parseInt(fontSize) || 12, 6), 36);
      const [pw, ph] = PAGES[pageSize];
      const margin = 50;
      const maxWidth = pw - margin * 2;
      const lineHeight = size * 1.45;

      let page = doc.addPage([pw, ph]);
      let y = ph - margin;

      const newPage = () => {
        page = doc.addPage([pw, ph]);
        y = ph - margin;
      };
      const drawLine = (text: string) => {
        if (y < margin) newPage();
        if (text) page.drawText(text, { x: margin, y, size, font });
        y -= lineHeight;
      };
      const fits = (t: string) => font.widthOfTextAtSize(t, size) <= maxWidth;

      for (const raw of input.split("\n")) {
        if (raw.trim() === "") {
          y -= lineHeight;
          if (y < margin) newPage();
          continue;
        }
        const words = raw.split(/(\s+)/); // keep spaces
        let line = "";
        for (const w of words) {
          if (fits(line + w)) {
            line += w;
          } else if (line) {
            drawLine(line.trimEnd());
            line = w.trimStart();
          } else {
            // single token longer than the line — hard-break by character
            let chunk = "";
            for (const ch of w) {
              if (fits(chunk + ch)) chunk += ch;
              else {
                drawLine(chunk);
                chunk = ch;
              }
            }
            line = chunk;
          }
        }
        drawLine(line.trimEnd());
      }

      const bytes = await doc.save();
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not create the PDF.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ttp-in">Text</Label>
        <Textarea
          id="ttp-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to turn into a PDF…"
          className="min-h-40"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ttp-page">Page size</Label>
          <select id="ttp-page" value={pageSize} onChange={(e) => setPageSize(e.target.value)} className={selectClass}>
            <option value="a4">A4</option>
            <option value="letter">Letter</option>
          </select>
        </div>
        <div className="flex w-28 flex-col gap-1.5">
          <Label htmlFor="ttp-size">Font size</Label>
          <select id="ttp-size" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className={selectClass}>
            {[10, 11, 12, 14, 16].map((s) => (
              <option key={s} value={s}>{s} pt</option>
            ))}
          </select>
        </div>
        <Button className="mb-0.5" onClick={generate} disabled={busy}>
          {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
          Create PDF
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">The text stays selectable in the PDF. Runs entirely in your browser.</p>
    </div>
  );
}
