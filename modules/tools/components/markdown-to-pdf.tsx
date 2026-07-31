"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SAMPLE = `# Project Brief

Thank you for your **business**! Here's the summary.

## Deliverables

- Landing page redesign
- Blog setup
- SEO pass

> Payment due within 30 days.

### Notes

Install with:

\`\`\`
npm install ohotool
\`\`\`
`;

// Strip inline markdown/HTML down to plain text for the PDF text layer.
function stripInline(t: string): string {
  return t
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

async function generatePdf(md: string) {
  const [{ marked }, jspdf] = await Promise.all([import("marked"), import("jspdf")]);
  const doc = new jspdf.jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxW = pageW - margin * 2;
  const lineFactor = 1.35;
  let y = margin;

  const ensure = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (
    text: string,
    size: number,
    opts: { bold?: boolean; mono?: boolean; color?: [number, number, number]; indent?: number; gapAfter?: number } = {},
  ) => {
    const indent = opts.indent ?? 0;
    doc.setFont(opts.mono ? "courier" : "helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    const c = opts.color ?? [17, 17, 17];
    doc.setTextColor(c[0], c[1], c[2]);
    const lineH = size * lineFactor;
    for (const line of doc.splitTextToSize(text || " ", maxW - indent) as string[]) {
      ensure(lineH);
      doc.text(line, margin + indent, y);
      y += lineH;
    }
    y += opts.gapAfter ?? size * 0.5;
  };

  const headingSize: Record<number, number> = { 1: 22, 2: 18, 3: 15, 4: 13, 5: 12, 6: 11 };

  for (const tok of marked.lexer(md) as Array<Record<string, unknown>>) {
    switch (tok.type) {
      case "heading": {
        y += 6;
        write(stripInline(String(tok.text)), headingSize[Number(tok.depth)] ?? 13, { bold: true, gapAfter: 6 });
        break;
      }
      case "paragraph":
        write(stripInline(String(tok.text)), 11, { gapAfter: 8 });
        break;
      case "list": {
        const items = (tok.items as Array<{ text: string }>) ?? [];
        const start = Number(tok.start) || 1;
        items.forEach((item, i) => {
          const bullet = tok.ordered ? `${start + i}. ` : "•  ";
          write(bullet + stripInline(item.text), 11, { indent: 16, gapAfter: 3 });
        });
        y += 5;
        break;
      }
      case "code":
        write(String(tok.text), 9.5, { mono: true, color: [70, 70, 70], gapAfter: 8 });
        break;
      case "blockquote":
        write(stripInline(String(tok.text)), 11, { indent: 16, color: [90, 90, 90], gapAfter: 8 });
        break;
      case "hr":
        ensure(14);
        doc.setDrawColor(210);
        doc.line(margin, y, pageW - margin, y);
        y += 14;
        break;
      case "space":
        y += 6;
        break;
      default:
        if (typeof tok.text === "string" && tok.text.trim()) write(stripInline(tok.text), 11, { gapAfter: 6 });
    }
  }

  doc.save("document.pdf");
}

export function MarkdownToPdf() {
  const [md, setMd] = React.useState("");
  const [html, setHtml] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const id = setTimeout(async () => {
      if (!md.trim()) {
        setHtml("");
        return;
      }
      const { marked } = await import("marked");
      const out = String(marked.parse(md, { async: false }));
      if (!cancelled) setHtml(out);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [md]);

  async function download() {
    if (!md.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await generatePdf(md);
    } catch (e) {
      setError((e as Error).message || "Could not generate the PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="md-in">Markdown</Label>
          <button type="button" onClick={() => setMd(SAMPLE)} className="text-xs font-medium text-primary hover:underline">
            Paste sample
          </button>
        </div>
        <textarea
          id="md-in"
          value={md}
          onChange={(e) => setMd(e.target.value)}
          spellCheck={false}
          rows={10}
          placeholder="# Write some markdown…"
          className="w-full resize-y rounded-lg border border-input bg-transparent p-3 font-mono text-xs leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Live preview</span>
        <Button onClick={download} disabled={busy || !md.trim()}>
          <DownloadIcon />
          {busy ? "Generating…" : "Download PDF"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div
        className="min-h-32 rounded-xl border border-border bg-card p-5 text-sm [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:mb-2 [&_h1]:font-heading [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-1.5 [&_h2]:mt-3 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-2 [&_h3]:font-medium [&_li]:ml-6 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
        dangerouslySetInnerHTML={{
          __html: html || "<p class=\"text-muted-foreground\">Your rendered markdown will appear here.</p>",
        }}
      />
    </div>
  );
}
