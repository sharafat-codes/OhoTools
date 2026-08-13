"use client";

import * as React from "react";

import type { CardEffect } from "@/modules/cards/types";

type Particle = {
  x: number; y: number; vx: number; vy: number;
  size: number; rot: number; vr: number; color: string; variant: number;
};

function drawHeart(ctx: CanvasRenderingContext2D, s: number) {
  const k = s / 2;
  ctx.beginPath();
  ctx.moveTo(0, k * 0.6);
  ctx.bezierCurveTo(k, -k * 0.3, k, -k * 0.95, 0, -k * 0.4);
  ctx.bezierCurveTo(-k, -k * 0.95, -k, -k * 0.3, 0, k * 0.6);
  ctx.closePath();
  ctx.fill();
}

function drawStar(ctx: CanvasRenderingContext2D, s: number) {
  const outer = s / 1.5;
  const inner = outer * 0.5;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Lightweight canvas particle burst (confetti / hearts / stars). Fires on mount
 * and whenever `fireKey` changes. Sizes to its parent, so it works in both the
 * small editor preview and the full-screen card. Pure client, no dependencies.
 */
export function Confetti({ colors, fireKey = 0, effect = "confetti" }: { colors: string[]; fireKey?: number; effect?: CardEffect }) {
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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(70, Math.round((w * h) / 6500));
    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const speed = 4 + Math.random() * 7;
      return {
        x: w / 2 + (Math.random() - 0.5) * w * 0.3,
        y: h * 0.55,
        vx: Math.cos(angle) * speed * (0.6 + Math.random()),
        vy: Math.sin(angle) * speed,
        size: (effect === "confetti" ? 6 : 10) + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        variant: Math.random() < 0.5 ? 0 : 1,
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
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - frame / 200);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (effect === "hearts") drawHeart(ctx, p.size);
        else if (effect === "stars") drawStar(ctx, p.size);
        else if (p.variant === 0) ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
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
  }, [colors, fireKey, effect]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden />;
}
