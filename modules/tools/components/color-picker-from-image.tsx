"use client";

import * as React from "react";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Button } from "@/components/ui/button";

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

type Picked = { hex: string; rgb: string; hsl: string };

export function ColorPickerFromImage() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [picked, setPicked] = React.useState<Picked | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx?.drawImage(image, 0, 0);
      }
      setLoaded(true);
      setPicked(null);
      setError(null);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setError("Could not read that image.");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    setPicked({ hex: rgbToHex(r, g, b), rgb: `rgb(${r}, ${g}, ${b})`, hsl: rgbToHsl(r, g, b) });
  }

  function copy(value: string) {
    navigator.clipboard?.writeText(value).then(
      () => toast.success(`Copied ${value}`),
      () => toast.error("Could not copy."),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={onFile}
        title="Drag & drop an image, or click to browse"
        hint="Then click any pixel to grab its color — in your browser."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <canvas
        ref={canvasRef}
        onClick={onCanvasClick}
        className={loaded ? "max-h-96 w-auto max-w-full cursor-crosshair rounded-lg border border-border" : "hidden"}
      />
      {loaded && <p className="text-xs text-muted-foreground">Click anywhere on the image to pick a color.</p>}

      {picked && (
        <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <span className="size-12 shrink-0 rounded-lg border border-border" style={{ backgroundColor: picked.hex }} />
            <div className="font-heading text-lg font-semibold uppercase">{picked.hex}</div>
          </div>
          {([["HEX", picked.hex], ["RGB", picked.rgb], ["HSL", picked.hsl]] as const).map(([label, val]) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <span className="w-10 shrink-0 text-muted-foreground">{label}</span>
              <code className="min-w-0 flex-1 truncate font-mono">{val}</code>
              <Button variant="outline" size="sm" onClick={() => copy(val)}>
                <CopyIcon className="size-3.5" />
                Copy
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
