"use client";

import * as React from "react";
import { DownloadIcon, ImageIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Size = { key: string; label: string; w: number; h: number }; // mm
const SIZES: Size[] = [
  { key: "us", label: "US — 2×2 in (51×51 mm)", w: 51, h: 51 },
  { key: "eu", label: "UK / EU / Schengen — 35×45 mm", w: 35, h: 45 },
  { key: "in", label: "India — 35×45 mm", w: 35, h: 45 },
  { key: "ca", label: "Canada — 50×70 mm", w: 50, h: 70 },
  { key: "cn", label: "China — 33×48 mm", w: 33, h: 48 },
];
const DPI = 300;
const PREVIEW_H = 320;
const mmToPx = (mm: number) => Math.round((mm / 25.4) * DPI);

export function PassportPhotoMaker() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [bitmap, setBitmap] = React.useState<ImageBitmap | null>(null);
  const [sizeKey, setSizeKey] = React.useState("us");
  const [zoom, setZoom] = React.useState(1);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const drag = React.useRef<{ x: number; y: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const size = SIZES.find((s) => s.key === sizeKey)!;
  const previewW = Math.round(PREVIEW_H * (size.w / size.h));

  const metrics = React.useCallback(
    (bmp: ImageBitmap, z: number) => {
      const base = Math.max(previewW / bmp.width, PREVIEW_H / bmp.height);
      const scale = base * z;
      return { drawW: bmp.width * scale, drawH: bmp.height * scale };
    },
    [previewW],
  );

  const clamp = React.useCallback(
    (p: { x: number; y: number }, drawW: number, drawH: number) => ({
      x: Math.min(0, Math.max(previewW - drawW, p.x)),
      y: Math.min(0, Math.max(PREVIEW_H - drawH, p.y)),
    }),
    [previewW],
  );

  // Draw the preview whenever inputs change (no state updates here).
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !bitmap) return;
    const { drawW, drawH } = metrics(bitmap, zoom);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, previewW, PREVIEW_H);
    ctx.drawImage(bitmap, pos.x, pos.y, drawW, drawH);
  }, [bitmap, zoom, pos, previewW, metrics]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    try {
      const bmp = await createImageBitmap(file);
      setBitmap(bmp);
      setZoom(1);
      const { drawW, drawH } = metrics(bmp, 1);
      setPos({ x: (previewW - drawW) / 2, y: (PREVIEW_H - drawH) / 2 });
    } catch {
      setError("Could not read that image. Try a different file.");
    }
  }

  function onZoom(z: number) {
    setZoom(z);
    if (bitmap) {
      const { drawW, drawH } = metrics(bitmap, z);
      setPos((p) => clamp(p, drawW, drawH));
    }
  }

  function onSize(key: string) {
    setSizeKey(key);
    // recentre for the new aspect on next paint
    if (bitmap) {
      const s = SIZES.find((x) => x.key === key)!;
      const pw = Math.round(PREVIEW_H * (s.w / s.h));
      const base = Math.max(pw / bitmap.width, PREVIEW_H / bitmap.height) * zoom;
      const drawW = bitmap.width * base;
      const drawH = bitmap.height * base;
      setPos({ x: (pw - drawW) / 2, y: (PREVIEW_H - drawH) / 2 });
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!bitmap) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }
  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drag.current || !bitmap) return;
    const { drawW, drawH } = metrics(bitmap, zoom);
    setPos(clamp({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y }, drawW, drawH));
  }
  function endDrag() {
    drag.current = null;
  }

  // Render the final photo at print resolution onto a fresh canvas.
  function renderFull(): HTMLCanvasElement | null {
    if (!bitmap) return null;
    const outW = mmToPx(size.w);
    const outH = mmToPx(size.h);
    const factor = outW / previewW;
    const { drawW, drawH } = metrics(bitmap, zoom);
    const c = document.createElement("canvas");
    c.width = outW;
    c.height = outH;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, pos.x * factor, pos.y * factor, drawW * factor, drawH * factor);
    return c;
  }

  function save(canvas: HTMLCanvasElement | null, name: string) {
    if (!canvas) return;
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);
      },
      "image/jpeg",
      0.95,
    );
  }

  function downloadSingle() {
    save(renderFull(), `passport-${size.key}.jpg`);
  }

  // Tile the photo across a 4×6 inch print sheet with thin cut guides.
  function downloadSheet() {
    const photo = renderFull();
    if (!photo) return;
    const sheetW = mmToPx(4 * 25.4); // 4 in
    const sheetH = mmToPx(6 * 25.4); // 6 in
    const gap = mmToPx(3);
    const margin = mmToPx(4);
    const c = document.createElement("canvas");
    c.width = sheetW;
    c.height = sheetH;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, sheetW, sheetH);
    const cols = Math.max(1, Math.floor((sheetW - 2 * margin + gap) / (photo.width + gap)));
    const rows = Math.max(1, Math.floor((sheetH - 2 * margin + gap) / (photo.height + gap)));
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const x = margin + col * (photo.width + gap);
        const y = margin + r * (photo.height + gap);
        ctx.drawImage(photo, x, y);
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, photo.width - 1, photo.height - 1);
      }
    }
    save(c, `passport-sheet-4x6-${size.key}.jpg`);
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={onFile}
        title="Drop a photo, or click to browse"
        hint="Crop to a standard passport size — runs in your browser."
      />

      {bitmap && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-2">
            <canvas
              ref={canvasRef}
              width={previewW}
              height={PREVIEW_H}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              className="cursor-grab touch-none rounded-lg border border-border active:cursor-grabbing"
              style={{ width: previewW, height: PREVIEW_H }}
            />
            <span className="text-xs text-muted-foreground">Drag to reposition</span>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pp-size">Photo size</Label>
              <select
                id="pp-size"
                value={sizeKey}
                onChange={(e) => onSize(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                {SIZES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="pp-zoom" className="text-sm">
                Zoom
              </Label>
              <input
                id="pp-zoom"
                type="range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(e) => onZoom(parseFloat(e.target.value))}
                className="flex-1 accent-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={downloadSingle}>
                <DownloadIcon />
                Download photo
              </Button>
              <Button variant="outline" onClick={downloadSheet}>
                <ImageIcon />
                Download 4×6 print sheet
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Output is {mmToPx(size.w)}×{mmToPx(size.h)} px at 300 DPI. Always check your country&apos;s official
              requirements (background, head size, expression) before printing.
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">Runs entirely in your browser — your photo is never uploaded.</p>
    </div>
  );
}
