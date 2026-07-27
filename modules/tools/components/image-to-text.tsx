"use client";

import * as React from "react";
import { UploadIcon, Loader2Icon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { CloudImport } from "@/modules/cloud/cloud-import";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

// Upscale small images (OCR likes larger text) and convert to grayscale.
// Returns a canvas Tesseract can read directly. Falls back to the file on error.
async function preprocess(file: File): Promise<HTMLCanvasElement | File> {
  try {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const longest = Math.max(img.width, img.height);
    const scale = Math.min(2, Math.max(1, 1500 / longest)); // upscale up to 2×, never shrink
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    const pixels = ctx.getImageData(0, 0, w, h);
    const d = pixels.data;
    for (let i = 0; i < d.length; i += 4) {
      const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = d[i + 1] = d[i + 2] = g;
    }
    ctx.putImageData(pixels, 0, 0);
    return canvas;
  } catch {
    return file;
  }
}

export function ImageToText() {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function onFile(f: File | undefined) {
    setError(null);
    setNotice(null);
    setText("");
    if (!f) return;
    if (f.size > MAX_BYTES) {
      setError("That image is larger than 15 MB. Try a smaller one.");
      return;
    }
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }

  async function recognize() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    setText("");
    setProgress(0);
    setStatus("Loading OCR engine…");
    try {
      // Preprocess: upscale small images and convert to grayscale — this
      // meaningfully improves accuracy on screenshots and low-res scans.
      const input = await preprocess(file);
      // Loaded on demand so the recognition engine isn't in the initial bundle.
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setStatus("Reading text…");
            setProgress(Math.round(m.progress * 100));
          } else {
            setStatus("Loading OCR engine…");
          }
        },
      });
      const { data } = await worker.recognize(input);
      await worker.terminate();
      const out = (data.text ?? "").trim();
      const confidence = Math.round((data as { confidence?: number }).confidence ?? 0);

      // Tesseract scores ~80-95 on clear text and drops well below 50 on
      // stylized art / logos / low-contrast images. Rather than dump
      // unreadable gibberish, tell the user the image isn't OCR-friendly.
      if (!out || confidence < 50) {
        setText("");
        setError(
          "We couldn't find clearly readable text in that image. OCR works best on clear photos, screenshots, or scans of real text — stylized graphics, logos, and low-contrast images can't be read reliably.",
        );
      } else {
        setText(out);
        if (confidence < 75) {
          setNotice(
            "Low confidence — the image may be blurry, low-contrast, or stylized, so some text below may be imperfect.",
          );
        }
      }
    } catch {
      setError("Something went wrong while reading the image. Please try again.");
    }
    setStatus("");
    setProgress(0);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors hover:bg-muted/50">
        <UploadIcon className="size-6 text-muted-foreground" />
        <span className="text-sm font-medium">Choose an image</span>
        <span className="text-xs text-muted-foreground">JPG, PNG, or a photo/scan of a document — up to 15 MB.</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      <CloudImport accept="image/*" onFile={(f) => onFile(f)} onError={setError} />

      <p className="text-xs text-muted-foreground">
        Best on clear screenshots, documents, and photos of real text. Stylized graphics, logos, and decorative fonts can&apos;t be read reliably.
      </p>

      {preview && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={preview} alt="Selected" className="max-h-48 w-fit max-w-full rounded-lg border border-border" />
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {notice && <p className="text-sm text-amber-600 dark:text-amber-500">{notice}</p>}

      <div className="flex items-center gap-3">
        <Button className="w-fit" onClick={recognize} disabled={busy || !file}>
          {busy ? <Loader2Icon className="animate-spin" /> : null}
          Extract text
        </Button>
        {busy && (
          <span className="text-sm text-muted-foreground">
            {status}
            {progress > 0 ? ` ${progress}%` : ""}
          </span>
        )}
      </div>

      {text && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="itt-out">Recognized text</Label>
            <CopyButton value={text} label="" />
          </div>
          <Textarea id="itt-out" readOnly value={text} className="min-h-48 text-sm" />
        </div>
      )}
    </div>
  );
}
