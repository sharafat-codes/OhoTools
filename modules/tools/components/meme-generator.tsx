"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { ResultCard } from "@/modules/tools/components/tool-result";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MemeGenerator() {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [top, setTop] = React.useState("");
  const [bottom, setBottom] = React.useState("");
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const draw = React.useCallback((image: HTMLImageElement, t: string, b: string) => {
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    const w = image.naturalWidth || 600;
    const h = image.naturalHeight || 600;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(image, 0, 0, w, h);

    const fontSize = Math.round(h * 0.09);
    ctx.font = `bold ${fontSize}px Impact, "Arial Black", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = Math.max(2, Math.round(fontSize / 12));
    ctx.lineJoin = "round";

    const maxWidth = w * 0.92;
    const wrap = (text: string) => {
      const words = text.toUpperCase().split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    const paint = (text: string, pos: "top" | "bottom") => {
      if (!text.trim()) return;
      const lines = wrap(text);
      const lh = fontSize * 1.1;
      lines.forEach((ln, i) => {
        const y =
          pos === "top"
            ? fontSize + i * lh + h * 0.02
            : h - (lines.length - 1 - i) * lh - h * 0.03;
        ctx.strokeText(ln, w / 2, y);
        ctx.fillText(ln, w / 2, y);
      });
    };

    paint(t, "top");
    paint(b, "bottom");

    canvas.toBlob((blob) => {
      if (!blob) return;
      setUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    }, "image/png");
  }, []);

  React.useEffect(() => {
    if (img) draw(img, top, bottom);
  }, [img, top, bottom, draw]);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setError(null);
      setImg(image);
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      setError("Could not read that image.");
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  }

  function download() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "meme.png";
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={onFile}
        title="Drag & drop an image, or click to browse"
        hint="Add captions and download your meme — in your browser."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {img && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meme-top">Top text</Label>
              <Input id="meme-top" value={top} onChange={(e) => setTop(e.target.value)} placeholder="TOP TEXT" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meme-bottom">Bottom text</Label>
              <Input id="meme-bottom" value={bottom} onChange={(e) => setBottom(e.target.value)} placeholder="BOTTOM TEXT" />
            </div>
          </div>

          {url && (
            <ResultCard title="Your meme">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Meme preview" className="max-h-96 w-fit max-w-full rounded-lg border border-border" />
              <div className="flex justify-end">
                <Button onClick={download}>
                  <DownloadIcon />
                  Download PNG
                </Button>
              </div>
            </ResultCard>
          )}
        </>
      )}
    </div>
  );
}
