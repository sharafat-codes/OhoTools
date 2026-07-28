"use client";

import * as React from "react";
import { RotateCcwIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dropzone } from "@/modules/tools/components/dropzone";
import { loadImageFromFile, blobFromCanvas, pickOutput, baseName, triggerDownload } from "@/modules/tools/components/image-lib";

type Rect = { x: number; y: number; w: number; h: number }; // normalized 0..1
type Mode = "move" | "nw" | "ne" | "sw" | "se" | "";

const MIN = 0.05;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const ASPECTS: { label: string; value: number | null }[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
];

export function CropImage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [srcUrl, setSrcUrl] = React.useState<string | null>(null);
  const [nat, setNat] = React.useState({ w: 0, h: 0 });
  const [rect, setRect] = React.useState<Rect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [error, setError] = React.useState<string | null>(null);

  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const drag = React.useRef<{ mode: Mode; sx: number; sy: number; orig: Rect } | null>(null);

  async function pick(f: File | undefined) {
    setError(null);
    if (!f) return;
    try {
      const image = await loadImageFromFile(f);
      setNat({ w: image.naturalWidth, h: image.naturalHeight });
      setRect({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
      setFile(f);
      setSrcUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(f);
      });
    } catch {
      setError("Could not read that image.");
    }
  }

  function reset() {
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setFile(null);
    setSrcUrl(null);
    setError(null);
  }

  function setAspect(r: number | null) {
    if (!r || nat.w === 0) {
      setRect({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
      return;
    }
    // Choose the largest centered box with pixel ratio r that fits in 0..1.
    let h = 0.9;
    let w = (h * r * nat.h) / nat.w;
    if (w > 0.9) {
      w = 0.9;
      h = (w * nat.w) / (r * nat.h);
    }
    setRect({ x: (1 - w) / 2, y: (1 - h) / 2, w, h });
  }

  function hitTest(px: number, py: number, box: DOMRect): Mode {
    const bx = rect.x * box.width;
    const by = rect.y * box.height;
    const bw = rect.w * box.width;
    const bh = rect.h * box.height;
    const t = 16;
    const left = Math.abs(px - bx) <= t;
    const right = Math.abs(px - (bx + bw)) <= t;
    const top = Math.abs(py - by) <= t;
    const bottom = Math.abs(py - (by + bh)) <= t;
    if (top && left) return "nw";
    if (top && right) return "ne";
    if (bottom && left) return "sw";
    if (bottom && right) return "se";
    if (px >= bx && px <= bx + bw && py >= by && py <= by + bh) return "move";
    return "";
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - box.left;
    const py = e.clientY - box.top;
    const mode = hitTest(px, py, box);
    if (!mode) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { mode, sx: e.clientX, sy: e.clientY, orig: rect };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const box = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - d.sx) / box.width;
    const dy = (e.clientY - d.sy) / box.height;
    const o = d.orig;
    let { x, y, w, h } = o;
    if (d.mode === "move") {
      x = clamp(o.x + dx, 0, 1 - o.w);
      y = clamp(o.y + dy, 0, 1 - o.h);
    } else {
      if (d.mode.includes("w")) {
        const nx = clamp(o.x + dx, 0, o.x + o.w - MIN);
        w = o.x + o.w - nx;
        x = nx;
      }
      if (d.mode.includes("e")) w = clamp(o.w + dx, MIN, 1 - o.x);
      if (d.mode.includes("n")) {
        const ny = clamp(o.y + dy, 0, o.y + o.h - MIN);
        h = o.y + o.h - ny;
        y = ny;
      }
      if (d.mode.includes("s")) h = clamp(o.h + dy, MIN, 1 - o.y);
    }
    setRect({ x, y, w, h });
  }

  function onPointerUp() {
    drag.current = null;
  }

  async function download() {
    if (!file || nat.w === 0) return;
    const sx = Math.round(rect.x * nat.w);
    const sy = Math.round(rect.y * nat.h);
    const sw = Math.max(1, Math.round(rect.w * nat.w));
    const sh = Math.max(1, Math.round(rect.h * nat.h));
    const image = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    const { type, ext } = pickOutput(file);
    const blob = await blobFromCanvas(canvas, type, type === "image/jpeg" ? 0.92 : undefined);
    triggerDownload(blob, `${baseName(file)}-cropped.${ext}`);
  }

  if (!file) {
    return (
      <Dropzone
        accept="image/*"
        onFile={(f) => pick(f)}
        title="Drag & drop an image, or click to browse"
        hint="Drag the box to crop — in your browser, nothing uploaded."
      />
    );
  }

  const cropW = Math.round(rect.w * nat.w);
  const cropH = Math.round(rect.h * nat.h);
  const handle =
    "absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-background bg-primary";

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcwIcon className="size-4" /> Change
          </Button>
        </div>
        <div className="flex justify-center rounded-lg bg-muted/40 p-3">
          <div className="relative inline-block max-w-full select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={srcUrl ?? undefined} alt="Crop source" draggable={false} className="block max-h-[70vh] max-w-full rounded" />
            <div
              ref={overlayRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="absolute inset-0 touch-none overflow-hidden rounded"
              style={{ cursor: "crosshair" }}
            >
              <div
                className="absolute border-2 border-primary"
                style={{
                  left: `${rect.x * 100}%`,
                  top: `${rect.y * 100}%`,
                  width: `${rect.w * 100}%`,
                  height: `${rect.h * 100}%`,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
                  cursor: "move",
                }}
              >
                <span className={handle} style={{ left: 0, top: 0 }} />
                <span className={handle} style={{ left: "100%", top: 0 }} />
                <span className={handle} style={{ left: 0, top: "100%" }} />
                <span className={handle} style={{ left: "100%", top: "100%" }} />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Selection: {cropW} × {cropH} px
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Aspect:</span>
        {ASPECTS.map((a) => (
          <Button key={a.label} variant="outline" size="sm" onClick={() => setAspect(a.value)}>
            {a.label}
          </Button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button className="w-fit" onClick={download}>
        <DownloadIcon className="size-4" /> Crop &amp; download
      </Button>
    </div>
  );
}
