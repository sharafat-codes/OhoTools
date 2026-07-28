"use client";

import * as React from "react";
import { RotateCcwIcon, DownloadIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dropzone } from "@/modules/tools/components/dropzone";
import { loadImageFromFile, blobFromCanvas, pickOutput, baseName, triggerDownload } from "@/modules/tools/components/image-lib";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function AddTextToImage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [text, setText] = React.useState("Your text");
  const [sizePct, setSizePct] = React.useState(8);
  const [color, setColor] = React.useState("#ffffff");
  const [position, setPosition] = React.useState("bottom");
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
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
    if (text.trim()) {
      const fontPx = Math.max(8, Math.round((sizePct / 100) * h));
      ctx.font = `bold ${fontPx}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const x = w / 2;
      let y = h / 2;
      const pad = fontPx * 0.9;
      if (position === "top") y = pad;
      else if (position === "bottom") y = h - pad;
      ctx.lineJoin = "round";
      ctx.lineWidth = Math.max(2, fontPx / 8);
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.strokeText(text, x, y);
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
    }
  }, [img, text, sizePct, color, position]);

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
    triggerDownload(blob, `${baseName(file)}-text.${ext}`);
  }

  if (!file) {
    return (
      <Dropzone
        accept="image/*"
        onFile={(f) => pick(f)}
        title="Drag & drop an image, or click to browse"
        hint="Add a caption or watermark — in your browser, nothing uploaded."
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="att-text">Text</Label>
        <Input id="att-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Your text" />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="att-pos">Position</Label>
          <select id="att-pos" value={position} onChange={(e) => setPosition(e.target.value)} className={selectClass}>
            <option value="top">Top</option>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="att-color">Color</Label>
          <input
            id="att-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-14 cursor-pointer rounded-lg border border-input bg-transparent p-1"
          />
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Text size</Label>
            <span className="text-sm text-muted-foreground">{sizePct}%</span>
          </div>
          <Slider value={[sizePct]} min={3} max={20} onValueChange={(v) => setSizePct(Array.isArray(v) ? v[0] : v)} />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button className="w-fit" onClick={download}>
        <DownloadIcon className="size-4" /> Download
      </Button>
    </div>
  );
}
