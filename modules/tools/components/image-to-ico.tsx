"use client";

import * as React from "react";
import { RotateCcwIcon, DownloadIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dropzone } from "@/modules/tools/components/dropzone";
import { loadImageFromFile, blobFromCanvas, baseName, triggerDownload } from "@/modules/tools/components/image-lib";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const SIZE_SETS: Record<string, number[]> = {
  standard: [16, 32, 48],
  all: [16, 32, 48, 64, 128, 256],
};

/** Pack PNG-encoded icon images into a single .ico blob. */
function encodeIco(pngs: { size: number; data: Uint8Array }[]): Blob {
  const header = 6;
  const dir = new Uint8Array(header + 16 * pngs.length);
  const dv = new DataView(dir.buffer);
  dv.setUint16(0, 0, true); // reserved
  dv.setUint16(2, 1, true); // type: icon
  dv.setUint16(4, pngs.length, true); // count
  let offset = dir.length;
  pngs.forEach((p, i) => {
    const base = header + i * 16;
    dir[base] = p.size >= 256 ? 0 : p.size; // width (0 = 256)
    dir[base + 1] = p.size >= 256 ? 0 : p.size; // height
    dir[base + 2] = 0; // palette
    dir[base + 3] = 0; // reserved
    dv.setUint16(base + 4, 1, true); // color planes
    dv.setUint16(base + 6, 32, true); // bits per pixel
    dv.setUint32(base + 8, p.data.length, true); // bytes of image data
    dv.setUint32(base + 12, offset, true); // offset from start of file
    offset += p.data.length;
  });
  return new Blob([new Uint8Array(dir), ...pngs.map((p) => new Uint8Array(p.data))], { type: "image/x-icon" });
}

export function ImageToIco() {
  const [file, setFile] = React.useState<File | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [srcUrl, setSrcUrl] = React.useState<string | null>(null);
  const [set, setSet] = React.useState("standard");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function pick(f: File | undefined) {
    setError(null);
    if (!f) return;
    try {
      const image = await loadImageFromFile(f);
      setFile(f);
      setImg(image);
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
    setImg(null);
    setSrcUrl(null);
    setError(null);
  }

  async function create() {
    if (!img || !file) return;
    setBusy(true);
    setError(null);
    try {
      const sizes = SIZE_SETS[set];
      const pngs: { size: number; data: Uint8Array }[] = [];
      for (const size of sizes) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        // Fit the source into a square, centered (contain).
        const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
        const blob = await blobFromCanvas(canvas, "image/png");
        pngs.push({ size, data: new Uint8Array(await blob.arrayBuffer()) });
      }
      if (!pngs.length) throw new Error("no sizes");
      triggerDownload(encodeIco(pngs), `${baseName(file)}.ico`);
    } catch {
      setError("Could not create the ICO file. Try a different image.");
    }
    setBusy(false);
  }

  if (!file) {
    return (
      <Dropzone
        accept="image/*"
        onFile={(f) => pick(f)}
        title="Drag & drop an image, or click to browse"
        hint="A square PNG works best. Converted to .ico in your browser, nothing uploaded."
      />
    );
  }

  const preview = SIZE_SETS[set];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcwIcon className="size-4" /> Change
          </Button>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          {preview.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={srcUrl ?? undefined}
                alt={`${s}px preview`}
                width={Math.min(s, 64)}
                height={Math.min(s, 64)}
                className="rounded border border-border object-contain"
                style={{ imageRendering: s <= 48 ? "pixelated" : "auto" }}
              />
              <span className="text-xs text-muted-foreground">{s}px</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ico-set">Sizes included</Label>
        <select id="ico-set" value={set} onChange={(e) => setSet(e.target.value)} className={`${selectClass} w-fit`}>
          <option value="standard">Standard (16, 32, 48)</option>
          <option value="all">All sizes (16 → 256)</option>
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button className="w-fit" onClick={create} disabled={busy}>
        {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon className="size-4" />}
        Create ICO
      </Button>
    </div>
  );
}
