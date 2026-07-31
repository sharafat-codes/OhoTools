"use client";

import * as React from "react";
import { DownloadIcon, LoaderCircleIcon, WandSparklesIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Button } from "@/components/ui/button";

const checker = {
  backgroundImage: "repeating-conic-gradient(#d4d4d4 0% 25%, transparent 0% 50%)",
  backgroundSize: "16px 16px",
};

export function RemoveBackground() {
  const [srcUrl, setSrcUrl] = React.useState<string | null>(null);
  const [srcFile, setSrcFile] = React.useState<File | null>(null);
  const [srcName, setSrcName] = React.useState("image");
  const [resultUrl, setResultUrl] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [progress, setProgress] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setSrcFile(file);
    setSrcName(file.name.replace(/\.[^.]+$/, "") || "image");
    setSrcUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  async function run() {
    if (!srcFile) return;
    setBusy(true);
    setError(null);
    setProgress("Loading model…");
    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(srcFile, {
        progress: (key: string, current: number, total: number) => {
          if (key.startsWith("fetch")) {
            const pct = total ? Math.round((current / total) * 100) : 0;
            setProgress(`Downloading model… ${pct}%`);
          } else {
            setProgress("Removing background…");
          }
        },
        output: { format: "image/png" },
      });
      setResultUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch {
      setError("Could not remove the background. Try a different image.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  function download() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${srcName}-no-bg.png`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={onFile}
        title="Drag & drop an image, or click to browse"
        hint="Remove the background automatically — runs on your device."
      />

      {srcUrl && (
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Original</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcUrl} alt="Original" className="max-h-64 w-fit max-w-full rounded-lg border border-border" />
            </div>
            {resultUrl && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Background removed</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt="Background removed"
                  style={checker}
                  className="max-h-64 w-fit max-w-full rounded-lg border border-border"
                />
              </div>
            )}
          </div>

          {!resultUrl ? (
            <Button onClick={run} disabled={busy} className="w-fit">
              {busy ? <LoaderCircleIcon className="animate-spin" /> : <WandSparklesIcon />}
              {busy ? progress || "Working…" : "Remove background"}
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
        The first run downloads a one-time AI model (~a few MB). After that it runs entirely on your device — your image
        is never uploaded.
      </p>
    </div>
  );
}
