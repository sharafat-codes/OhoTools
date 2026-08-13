"use client";

import * as React from "react";

type Particle = {
  x: number; y: number; vx: number; vy: number;
  size: number; rot: number; vr: number; color: string; shape: number;
};

/**
 * Lightweight canvas confetti. Fires a burst on mount and whenever `fireKey`
 * changes. Sizes to its parent, so it works in both the small editor preview
 * and the full-screen public card. Pure client, no dependencies.
 */
export function Confetti({ colors, fireKey = 0 }: { colors: string[]; fireKey?: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const count = Math.max(80, Math.round((w * h) / 6000));
    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const speed = 4 + Math.random() * 7;
      return {
        x: w / 2 + (Math.random() - 0.5) * w * 0.3,
        y: h * 0.55,
        vx: Math.cos(angle) * speed * (0.6 + Math.random()),
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 7,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() < 0.5 ? 0 : 1,
      };
    });

    let frame = 0;
    const gravity = 0.16;
    const drag = 0.992;

    function tick() {
      if (!ctx) return;
      frame++;
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of particles) {
        p.vy += gravity;
        p.vx *= drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y < h + 40) alive = true;
        const alpha = Math.max(0, 1 - frame / 200);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 0) ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        else {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size / 2, p.size / 3, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (alive && frame < 220) rafRef.current = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    }
    tick();

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [colors, fireKey]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden />;
}
