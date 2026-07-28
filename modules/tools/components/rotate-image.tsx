"use client";

import * as React from "react";
import { RotateCcwIcon, RotateCwIcon, FlipHorizontal2Icon, FlipVertical2Icon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dropzone } from "@/modules/tools/components/dropzone";
import { loadImageFromFile, blobFromCanvas, pickOutput, baseName, triggerDownload } from "@/modules/tools/components/image-lib";

export function RotateImage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [quarter, setQuarter] = React.useState(0); // number of 90° clockwise turns
  const [flipH, setFlipH] = React.useState(false);
  const [flipV, setFlipV] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  async function pick(f: File | undefined) {
    setError(null);
    if (!f) return;
    try {
      const image = await loadImageFromFile(f);
      setFile(f);
      setImg(image);
      setQuarter(0);
      setFlipH(false);
      setFlipV(false);
    } catch {
      setError("Could not read that image.");
    }
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const rotated = quarter % 2 === 1;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    canvas.width = rotated ? h : w;
    canvas.height = rotated ? w : h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((quarter * 90 * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    ctx.restore();
  }, [img, quarter, flipH, flipV]);

  function reset() {
    setFile(null);
    setImg(null);
    setError(null);
  }

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const { type, ext } = pickOutput(file);
    const blob = await blobFromCanvas(canvas, type, type === "image/jpeg" ? 0.92 : undefined);
    triggerDownload(blob, `${baseName(file)}-rotated.${ext}`);
  }

  if (!file) {
    return (
      <Dropzone
        accept="image/*"
        onFile={(f) => pick(f)}
        title="Drag & drop an image, or click to browse"
        hint="Rotate or flip — in your browser, nothing uploaded."
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
        <div className="flex justify-center rounded-lg bg-muted/40 p-3">
          <canvas ref={canvasRef} className="max-h-80 w-auto max-w-full rounded" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setQuarter((q) => (q + 3) % 4)}>
          <RotateCcwIcon className="size-4" /> Rotate left
        </Button>
        <Button variant="outline" onClick={() => setQuarter((q) => (q + 1) % 4)}>
          <RotateCwIcon className="size-4" /> Rotate right
        </Button>
        <Button variant={flipH ? "default" : "outline"} onClick={() => setFlipH((v) => !v)}>
          <FlipHorizontal2Icon className="size-4" /> Flip horizontal
        </Button>
        <Button variant={flipV ? "default" : "outline"} onClick={() => setFlipV((v) => !v)}>
          <FlipVertical2Icon className="size-4" /> Flip vertical
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button className="w-fit" onClick={download}>
        <DownloadIcon className="size-4" /> Download
      </Button>
    </div>
  );
}
