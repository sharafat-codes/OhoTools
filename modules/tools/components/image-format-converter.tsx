"use client";

import * as React from "react";
import { DownloadIcon, LoaderCircleIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ImageFormatView } from "@/modules/tools/image-formats";

const checker = {
  backgroundImage: "repeating-conic-gradient(#d4d4d4 0% 25%, transparent 0% 50%)",
  backgroundSize: "16px 16px",
};

export function ImageFormatConverter({ view }: { view: ImageFormatView }) {
  const [srcUrl, setSrcUrl] = React.useState<string | null>(null);
  const [srcName, setSrcName] = React.useState("image");
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [resultSize, setResultSize] = React.useState<number | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setSrcName(file.name.replace(/\.[^.]+$/, "") || "image");
    setSrcUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    await convert(file);
  }

  async function convert(file: File) {
    setBusy(true);
    setError(null);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is unavailable.");
      // JPEG has no alpha channel — flatten transparency onto white.
      if (view.to.mime === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close?.();

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, view.to.mime, 0.92),
      );
      if (!blob) throw new Error("Encoding failed.");
      setResultSize(blob.size);
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch {
      setError(`Could not convert this image to ${view.to.name}. Try a different file.`);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${srcName}.${view.to.ext}`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={onFile}
        title={`Drop a ${view.from.name} image, or click to browse`}
        hint={`Converts to ${view.to.name} in your browser — nothing is uploaded.`}
      />

      {srcUrl && (
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">{view.from.name} (original)</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcUrl} alt="Original" className="max-h-64 w-fit max-w-full rounded-lg border border-border" />
            </div>

            {resultUrl ? (
              <div className="flex flex-col gap-1.5 animate-in fade-in-0 duration-300">
                <span className="text-xs text-muted-foreground">
                  {view.to.name}
                  {resultSize != null && <> · {(resultSize / 1024).toFixed(0)} KB</>}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt={`Converted to ${view.to.name}`}
                  style={checker}
                  className="max-h-64 w-fit max-w-full rounded-lg border border-border"
                />
              </div>
            ) : busy ? (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Converting to {view.to.name}…</span>
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            ) : null}
          </div>

          {resultUrl && (
            <Button onClick={download} className="w-fit">
              {busy ? <LoaderCircleIcon className="animate-spin" /> : <DownloadIcon />}
              Download {view.to.name}
            </Button>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">Runs entirely in your browser — your images are never uploaded.</p>
    </div>
  );
}
