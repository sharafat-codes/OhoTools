"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

// Character ramp from darkest to lightest (denser glyph = darker pixel).
const RAMP = "@%#*+=-:. ";

export function AsciiArtGenerator() {
  const [bitmap, setBitmap] = React.useState<ImageBitmap | null>(null);
  const [cols, setCols] = React.useState(90);
  const [invert, setInvert] = React.useState(false);
  const [ascii, setAscii] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const render = React.useCallback(
    (bmp: ImageBitmap, columns: number, inv: boolean) => {
      // Characters are ~twice as tall as wide, so squash rows by ~0.5.
      const rows = Math.max(1, Math.round((columns * bmp.height) / bmp.width / 2));
      const canvas = document.createElement("canvas");
      canvas.width = columns;
      canvas.height = rows;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(bmp, 0, 0, columns, rows);
      const { data } = ctx.getImageData(0, 0, columns, rows);
      const ramp = inv ? [...RAMP].reverse().join("") : RAMP;
      const lines: string[] = [];
      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < columns; x++) {
          const i = (y * columns + x) * 4;
          const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          const idx = Math.min(ramp.length - 1, Math.round(lum * (ramp.length - 1)));
          line += ramp[idx];
        }
        lines.push(line);
      }
      setAscii(lines.join("\n"));
    },
    [],
  );

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    try {
      const bmp = await createImageBitmap(file);
      setBitmap(bmp);
      render(bmp, cols, invert);
    } catch {
      setError("Could not read that image. Try a different file.");
    }
  }

  // Re-render when settings change.
  React.useEffect(() => {
    if (bitmap) render(bitmap, cols, invert);
  }, [bitmap, cols, invert, render]);

  function download() {
    if (!ascii) return;
    const blob = new Blob([ascii], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ascii-art.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={onFile}
        title="Drop an image, or click to browse"
        hint="Turns your image into ASCII art — runs in your browser."
      />

      {ascii && (
        <>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="cols" className="text-sm">
                Width
              </Label>
              <input
                id="cols"
                type="range"
                min={40}
                max={200}
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
                className="accent-primary"
              />
              <span className="w-10 text-sm tabular-nums text-muted-foreground">{cols}</span>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} className="size-4 rounded border-input accent-primary" />
              Invert (for dark backgrounds)
            </label>
            <div className="ml-auto flex gap-2">
              <CopyButton value={ascii} label="Copy" />
              <Button variant="outline" size="sm" onClick={download}>
                <DownloadIcon className="size-3.5" />
                .txt
              </Button>
            </div>
          </div>

          <div className="overflow-auto rounded-lg border border-border bg-card p-3">
            <pre className="font-mono text-[6px] leading-[6px] sm:text-[8px] sm:leading-[8px]">{ascii}</pre>
          </div>
        </>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">Runs entirely in your browser — your image is never uploaded.</p>
    </div>
  );
}
