"use client";

import * as React from "react";
import { DownloadIcon, LoaderCircleIcon, SparklesIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const checker = {
  backgroundImage: "repeating-conic-gradient(#d4d4d4 0% 25%, transparent 0% 50%)",
  backgroundSize: "16px 16px",
};

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode failed"));
    img.src = url;
  });
}

export function ImageUpscaler() {
  const [srcUrl, setSrcUrl] = React.useState<string | null>(null);
  const [srcName, setSrcName] = React.useState("image");
  const [srcDims, setSrcDims] = React.useState<{ w: number; h: number } | null>(null);
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setResultUrl(null);
    setSrcName(file.name.replace(/\.[^.]+$/, "") || "image");
    const url = URL.createObjectURL(file);
    setSrcUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    loadImage(url)
      .then((img) => setSrcDims({ w: img.naturalWidth, h: img.naturalHeight }))
      .catch(() => setSrcDims(null));
  }

  async function run() {
    if (!srcUrl || busy) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    setStatus("Loading the upscaling model…");
    try {
      const { default: Upscaler } = await import("upscaler");
      const { default: model } = await import("@upscalerjs/default-model");

      const img = await loadImage(srcUrl);
      const upscaler = new Upscaler({ model });
      setStatus("Upscaling…");
      const output = await upscaler.upscale(img, {
        output: "base64",
        patchSize: 64,
        padding: 6,
        progress: (rate: number) => setProgress(Math.round(rate * 100)),
      });
      setResultUrl(typeof output === "string" ? output : null);
      upscaler.dispose?.();
    } catch {
      setError("Couldn't upscale this image. Try a smaller image, or a different one.");
    } finally {
      setBusy(false);
      setStatus("");
    }
  }

  function download() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${srcName}-upscaled.png`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={onFile}
        title="Drag & drop an image, or click to browse"
        hint="Upscale 2× with AI — runs on your device."
      />

      {srcUrl && (
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">
                Original{srcDims && <> · {srcDims.w}×{srcDims.h}</>}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcUrl} alt="Original" style={checker} className="max-h-64 w-fit max-w-full rounded-lg border border-border" />
            </div>

            {resultUrl ? (
              <div className="flex flex-col gap-1.5 animate-in fade-in-0 duration-300">
                <span className="text-xs text-muted-foreground">
                  Upscaled 2×{srcDims && <> · {srcDims.w * 2}×{srcDims.h * 2}</>}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Upscaled" style={checker} className="max-h-64 w-fit max-w-full rounded-lg border border-border" />
              </div>
            ) : busy ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">{status || "Working…"} {progress ? `${progress}%` : ""}</span>
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            ) : null}
          </div>

          {!resultUrl ? (
            <Button onClick={run} disabled={busy} className="w-fit">
              {busy ? <LoaderCircleIcon className="animate-spin" /> : <SparklesIcon className="size-4" />}
              {busy ? `${status || "Working"}${progress ? ` ${progress}%` : ""}` : "Upscale 2×"}
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button onClick={download}>
                <DownloadIcon />
                Download PNG
              </Button>
              <Button variant="outline" onClick={run} disabled={busy}>
                Run again
              </Button>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        The first run downloads a one-time AI model (a few MB). After that it runs entirely on your device — your image
        is never uploaded. Large images take longer and use more memory.
      </p>
    </div>
  );
}
