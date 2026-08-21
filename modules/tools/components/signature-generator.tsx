"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const COLORS = ["#111827", "#1d4ed8", "#dc2626", "#047857"];

export function SignatureGenerator() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const drawing = React.useRef(false);
  const [color, setColor] = React.useState(COLORS[0]);
  const [size, setSize] = React.useState(3);
  const [empty, setEmpty] = React.useState(true);

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * ratio;
    c.height = rect.height * ratio;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, []);

  function pos(e: React.PointerEvent) {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function start(e: React.PointerEvent) {
    const c = canvasRef.current!;
    c.setPointerCapture(e.pointerId);
    drawing.current = true;
    const ctx = c.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setEmpty(false);
  }
  function end() {
    drawing.current = false;
  }
  function clear() {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setEmpty(true);
  }
  function download() {
    const url = canvasRef.current!.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.png";
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Pen color ${c}`}
              className={cn("size-7 rounded-full border-2", color === c ? "border-foreground" : "border-transparent")}
              style={{ background: c }}
            />
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          Pen size
          <input type="range" min={1} max={8} value={size} onChange={(e) => setSize(Number(e.target.value))} className="accent-primary" />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="h-56 w-full cursor-crosshair rounded-xl border-2 border-dashed border-border bg-white"
        style={{ touchAction: "none" }}
      />

      <div className="flex gap-2">
        <Button onClick={download} disabled={empty}>Download PNG</Button>
        <Button variant="outline" onClick={clear}>Clear</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Draw with your mouse, trackpad, or finger. Downloads as a transparent PNG. Nothing is uploaded.
      </p>
    </div>
  );
}
