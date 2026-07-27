"use client";

import * as React from "react";
import { UploadIcon, DownloadIcon, Loader2Icon, PenLineIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloudImport } from "@/modules/cloud/cloud-import";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const POSITIONS = [
  { value: "bottom-right", label: "Bottom right" },
  { value: "bottom-left", label: "Bottom left" },
  { value: "bottom-center", label: "Bottom center" },
  { value: "top-right", label: "Top right" },
  { value: "top-left", label: "Top left" },
];
const SIZES = [
  { value: "150", label: "Small" },
  { value: "200", label: "Medium" },
  { value: "260", label: "Large" },
];

async function toPngBytes(dataUrl: string): Promise<Uint8Array> {
  const res = await fetch(dataUrl);
  return new Uint8Array(await res.arrayBuffer());
}

function fileToPngDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

export function SignPdf() {
  const [file, setFile] = React.useState<File | null>(null);
  const [pageCount, setPageCount] = React.useState(0);
  const [mode, setMode] = React.useState<"draw" | "upload">("draw");
  const [uploaded, setUploaded] = React.useState<string | null>(null);
  const [pageNum, setPageNum] = React.useState("1");
  const [position, setPosition] = React.useState("bottom-right");
  const [size, setSize] = React.useState("200");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawing = React.useRef(false);
  const hasDrawn = React.useRef(false);

  async function onPdf(f: File | undefined) {
    if (!f) return;
    setError(null);
    setFile(f);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer());
      setPageCount(doc.getPageCount());
      setPageNum("1");
    } catch {
      setError("Could not read that PDF. It may be encrypted or corrupted.");
      setFile(null);
      setPageCount(0);
    }
  }

  function pointerPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }
  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pointerPos(e);
    drawing.current = true;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0a0a0a";
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function moveDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pointerPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasDrawn.current = true;
  }
  function endDraw() {
    drawing.current = false;
  }
  function clearPad() {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
  }

  async function onSignatureUpload(f: File | undefined) {
    if (!f || !f.type.startsWith("image/")) return;
    try {
      setUploaded(await fileToPngDataUrl(f));
      setError(null);
    } catch {
      setError("Could not read that image.");
    }
  }

  async function apply() {
    if (!file) return;
    let sigDataUrl: string | null = null;
    if (mode === "draw") {
      if (!hasDrawn.current) {
        setError("Draw your signature first.");
        return;
      }
      sigDataUrl = canvasRef.current!.toDataURL("image/png");
    } else {
      if (!uploaded) {
        setError("Upload a signature image first.");
        return;
      }
      sigDataUrl = uploaded;
    }

    setBusy(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      const png = await doc.embedPng(await toPngBytes(sigDataUrl));
      const idx = Math.min(Math.max(parseInt(pageNum) || 1, 1), doc.getPageCount()) - 1;
      const page = doc.getPage(idx);
      const { width, height } = page.getSize();
      const sigW = parseInt(size);
      const sigH = sigW * (png.height / png.width);
      const margin = 36;
      let x = width - sigW - margin;
      let y = margin;
      if (position.endsWith("left")) x = margin;
      else if (position.endsWith("center")) x = (width - sigW) / 2;
      if (position.startsWith("top")) y = height - sigH - margin;
      page.drawImage(png, { x, y, width: sigW, height: sigH });
      const bytes = await doc.save();
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "signed.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not sign the PDF.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose a PDF</span>
        <span className="text-xs text-muted-foreground">Signed in your browser — nothing is uploaded.</span>
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onPdf(e.target.files?.[0])} />
      </label>

      <CloudImport accept="application/pdf" onFile={(f) => onPdf(f)} onError={setError} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {file && pageCount > 0 && (
        <>
          <div className="inline-flex w-fit rounded-lg bg-muted p-0.5">
            {(["draw", "upload"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors",
                  mode === m ? "bg-background shadow-sm" : "text-muted-foreground",
                )}
              >
                {m === "draw" ? "Draw" : "Upload image"}
              </button>
            ))}
          </div>

          {mode === "draw" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5">
                  <PenLineIcon className="size-4" /> Draw your signature
                </Label>
                <button type="button" onClick={clearPad} className="text-xs text-primary hover:underline">
                  Clear
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={500}
                height={180}
                onPointerDown={startDraw}
                onPointerMove={moveDraw}
                onPointerUp={endDraw}
                onPointerLeave={endDraw}
                className="w-full touch-none rounded-xl border border-border bg-white"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Signature image (PNG with transparent background works best)</Label>
              <input type="file" accept="image/*" onChange={(e) => onSignatureUpload(e.target.files?.[0])} className="text-sm" />
              {uploaded && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={uploaded} alt="Signature preview" className="h-20 w-fit rounded border border-border bg-white p-1" />
              )}
            </div>
          )}

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex w-24 flex-col gap-1.5">
              <Label htmlFor="sp-page">Page</Label>
              <select id="sp-page" value={pageNum} onChange={(e) => setPageNum(e.target.value)} className={selectClass}>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sp-pos">Position</Label>
              <select id="sp-pos" value={position} onChange={(e) => setPosition(e.target.value)} className={selectClass}>
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sp-size">Size</Label>
              <select id="sp-size" value={size} onChange={(e) => setSize(e.target.value)} className={selectClass}>
                {SIZES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <Button className="mb-0.5" onClick={apply} disabled={busy}>
              {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />}
              Sign &amp; download
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
