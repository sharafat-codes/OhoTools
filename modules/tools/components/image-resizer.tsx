"use client";

import * as React from "react";
import { UploadIcon, DownloadIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudImport } from "@/modules/cloud/cloud-import";

function triggerDownload(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}

export function ImageResizer() {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [srcName, setSrcName] = React.useState("image");
  const [natural, setNatural] = React.useState({ w: 0, h: 0 });
  const [width, setWidth] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [lock, setLock] = React.useState(true);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setSrcName(file.name.replace(/\.[^.]+$/, "") || "image");
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setNatural({ w: image.naturalWidth, h: image.naturalHeight });
      setWidth(String(image.naturalWidth));
      setHeight(String(image.naturalHeight));
      setResult(null);
      setError(null);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setError("Could not read that image.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  function onWidth(v: string) {
    setWidth(v);
    if (lock && natural.w > 0) {
      const w = parseInt(v);
      if (Number.isFinite(w)) setHeight(String(Math.round((w / natural.w) * natural.h)));
    }
  }
  function onHeight(v: string) {
    setHeight(v);
    if (lock && natural.h > 0) {
      const h = parseInt(v);
      if (Number.isFinite(h)) setWidth(String(Math.round((h / natural.h) * natural.w)));
    }
  }

  function resize() {
    if (!img) return;
    const w = parseInt(width);
    const h = parseInt(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1) {
      setError("Enter a valid width and height.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    setResult(canvas.toDataURL("image/png"));
    setError(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose an image</span>
        <span className="text-xs text-muted-foreground">Resize any image to exact dimensions — in your browser.</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      <CloudImport accept="image/*" onFile={(f) => onFile(f)} onError={setError} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {img && (
        <>
          <p className="text-sm text-muted-foreground">
            Original: {natural.w} × {natural.h} px
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex w-28 flex-col gap-1.5">
              <Label htmlFor="ir-w">Width (px)</Label>
              <Input id="ir-w" type="number" value={width} onChange={(e) => onWidth(e.target.value)} />
            </div>
            <div className="flex w-28 flex-col gap-1.5">
              <Label htmlFor="ir-h">Height (px)</Label>
              <Input id="ir-h" type="number" value={height} onChange={(e) => onHeight(e.target.value)} />
            </div>
            <label className="flex h-9 cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="size-4 rounded border-input" />
              Lock ratio
            </label>
            <Button className="mb-0.5" onClick={resize}>Resize</Button>
          </div>

          {result && (
            <Card>
              <CardContent className="flex flex-col gap-3 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result} alt="Resized preview" className="max-h-64 w-fit max-w-full rounded-lg border border-border" />
                <Button className="w-fit" onClick={() => triggerDownload(result, `${srcName}-${width}x${height}.png`)}>
                  <DownloadIcon />
                  Download PNG
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
