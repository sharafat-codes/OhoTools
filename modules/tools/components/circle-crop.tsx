"use client";

import * as React from "react";
import { RotateCcwIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dropzone } from "@/modules/tools/components/dropzone";
import { loadImageFromFile, blobFromCanvas, baseName, triggerDownload } from "@/modules/tools/components/image-lib";

export function CircleCrop() {
  const [file, setFile] = React.useState<File | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  async function pick(f: File | undefined) {
    setError(null);
    if (!f) return;
    try {
      const image = await loadImageFromFile(f);
      setFile(f);
      setImg(image);
    } catch {
      setError("Could not read that image.");
    }
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const size = Math.min(w, h);
    const sx = (w - size) / 2;
    const sy = (h - size) / 2;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
    ctx.restore();
  }, [img]);

  function reset() {
    setFile(null);
    setImg(null);
    setError(null);
  }

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    // PNG so the transparent corners are preserved.
    const blob = await blobFromCanvas(canvas, "image/png");
    triggerDownload(blob, `${baseName(file)}-circle.png`);
  }

  if (!file) {
    return (
      <Dropzone
        accept="image/*"
        onFile={(f) => pick(f)}
        title="Drag & drop an image, or click to browse"
        hint="Crop to a circle for avatars & profile pictures — in your browser, nothing uploaded."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcwIcon className="size-4" /> Change
          </Button>
        </div>
        <div
          className="flex justify-center rounded-lg p-4"
          style={{
            backgroundImage:
              "repeating-conic-gradient(var(--muted) 0% 25%, transparent 0% 50%)",
            backgroundSize: "20px 20px",
          }}
        >
          <canvas ref={canvasRef} className="max-h-80 w-auto max-w-full" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Cropped from the centre to a circle. The result is a PNG with a transparent background.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button className="w-fit" onClick={download}>
        <DownloadIcon className="size-4" /> Download PNG
      </Button>
    </div>
  );
}
