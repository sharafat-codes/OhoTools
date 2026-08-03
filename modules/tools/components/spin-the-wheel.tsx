"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SIZE = 440; // intrinsic canvas resolution

function truncate(s: string) {
  return s.length > 16 ? s.slice(0, 15) + "…" : s;
}

export function SpinTheWheel() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const rotationRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);

  const [text, setText] = React.useState("Alice\nBob\nCharlie\nDana\nEli\nFinn");
  const [winner, setWinner] = React.useState<string | null>(null);
  const [spinning, setSpinning] = React.useState(false);

  const items = React.useMemo(
    () => text.split("\n").map((s) => s.trim()).filter(Boolean),
    [text],
  );

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const r = SIZE / 2 - 6;
    ctx.clearRect(0, 0, SIZE, SIZE);

    if (items.length === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(120,120,120,0.15)";
      ctx.fill();
      return;
    }

    const seg = (Math.PI * 2) / items.length;
    const rot = rotationRef.current;
    for (let i = 0; i < items.length; i++) {
      const start = i * seg + rot;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, start + seg);
      ctx.closePath();
      ctx.fillStyle = `hsl(${Math.round((i * 360) / items.length)}, 68%, 55%)`;
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + seg / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 15px system-ui, sans-serif";
      ctx.fillText(truncate(items[i]), r - 12, 5);
      ctx.restore();
    }

    // center hub
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [items]);

  React.useEffect(() => {
    draw();
  }, [draw]);

  React.useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  function spin() {
    if (spinning || items.length < 2) return;
    setSpinning(true);
    setWinner(null);

    const seg = (Math.PI * 2) / items.length;
    const win = Math.floor(Math.random() * items.length);
    const pointer = -Math.PI / 2; // pointer sits at the top
    const twoPi = Math.PI * 2;
    const current = rotationRef.current;
    // rotation (mod 2π) that lands the winner's center under the pointer…
    let target = pointer - (win * seg + seg / 2);
    // …then push it at least 5 full turns ahead of the current angle.
    const min = current + 5 * twoPi;
    target += Math.ceil((min - target) / twoPi) * twoPi;

    const duration = 4500;
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const t = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      rotationRef.current = current + (target - current) * eased;
      draw();
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rotationRef.current = target % twoPi;
        draw();
        setWinner(items[win]);
        setSpinning(false);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* pointer */}
          <div
            className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1"
            aria-hidden
            style={{
              width: 0,
              height: 0,
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "20px solid var(--primary, #7c3aed)",
            }}
          />
          <canvas ref={canvasRef} width={SIZE} height={SIZE} className="aspect-square w-full max-w-[340px] rounded-full" />
        </div>
        <Button onClick={spin} disabled={spinning || items.length < 2} className="w-40">
          {spinning ? "Spinning…" : "Spin"}
        </Button>
        {winner && !spinning && (
          <div className="animate-in fade-in-0 zoom-in-95 text-center duration-300">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Winner</div>
            <div className="font-heading text-2xl font-semibold text-primary">{winner}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="wheel-entries">Entries (one per line)</Label>
        <Textarea
          id="wheel-entries"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Alice\nBob\nCharlie"}
          className="min-h-64 text-sm"
        />
        <p className="text-xs text-muted-foreground">{items.length} entries · add at least 2 to spin.</p>
      </div>
    </div>
  );
}
