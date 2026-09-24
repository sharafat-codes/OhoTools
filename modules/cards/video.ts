// Client-side animated card export: draw the card frame-by-frame on a canvas,
// then encode an MP4 with the shared ffmpeg.wasm engine. Crisper and smaller
// than a GIF, and plays natively on WhatsApp. Used by the Pro export.
//
// The card itself is not re-drawn here. It used to be — a gradient plus the
// text in Georgia — which ignored the chosen template entirely. Now the real
// component is photographed once (see modules/cards/capture.ts) and this file
// only animates over that still: a slow push-in, and the falling effect the
// card is set to.

import { getFfmpeg } from "@/modules/tools/components/ffmpeg-client";
import { captureCard, EXPORT_W, EXPORT_H } from "@/modules/cards/capture";
import { resolveTheme, type CardData } from "@/modules/cards/types";

const W = EXPORT_W;
const H = EXPORT_H;
const FPS = 15;
const DURATION = 3; // seconds
const FRAMES = FPS * DURATION;

type Particle = { x: number; speed: number; size: number; color: string; drift: number; phase: number; rot: number; vr: number };

function makeParticles(colors: string[]): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < 34; i++) {
    out.push({
      x: Math.random() * W,
      speed: 60 + Math.random() * 80,
      size: 9 + Math.random() * 9,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: 10 + Math.random() * 24,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 3,
    });
  }
  return out;
}

function drawShape(ctx: CanvasRenderingContext2D, effect: CardData["effect"], s: number) {
  if (effect === "hearts") {
    const k = s / 2;
    ctx.beginPath();
    ctx.moveTo(0, k * 0.6);
    ctx.bezierCurveTo(k, -k * 0.3, k, -k * 0.95, 0, -k * 0.4);
    ctx.bezierCurveTo(-k, -k * 0.95, -k, -k * 0.3, 0, k * 0.6);
    ctx.closePath();
    ctx.fill();
  } else if (effect === "stars") {
    const outer = s / 1.5;
    const inner = outer * 0.5;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(-s / 2, -s / 2, s, s * 0.6);
  }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  t: number,
  data: CardData,
  particles: Particle[],
  card: HTMLCanvasElement,
) {
  // Slow push-in, so a still card still reads as a moving one.
  const zoom = 1 + 0.05 * (t / DURATION);
  const dw = W * zoom;
  const dh = H * zoom;
  ctx.drawImage(card, (W - dw) / 2, (H - dh) / 2, dw, dh);

  for (const p of particles) {
    const y = ((((t * p.speed + p.x) % (H + 60)) + H + 60) % (H + 60)) - 30;
    const x = p.x + Math.sin(t * 2 + p.phase) * p.drift;
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.translate(x, y);
    ctx.rotate(p.rot + t * p.vr);
    ctx.fillStyle = p.color;
    drawShape(ctx, data.effect, p.size);
    ctx.restore();
  }
}

export async function exportCardVideo(data: CardData, onProgress: (pct: number) => void): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  // Photograph the real card first — everything after this is motion over it.
  // Laid out at W x H but rastered at twice that, so the push-in stays sharp.
  const card = await captureCard(data);
  onProgress(8);

  const th = resolveTheme(data);
  const particles = makeParticles([th.accent, "#ffffff", th.bg2, "#fde68a"]);

  // ffmpeg progress maps to the second half (50–100%)
  const ff = await getFfmpeg((p) => onProgress(50 + Math.round(p / 2)));

  for (let i = 0; i < FRAMES; i++) {
    drawFrame(ctx, i / FPS, data, particles, card);
    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b as Blob), "image/png"));
    const buf = new Uint8Array(await blob.arrayBuffer());
    await ff.writeFile(`f${String(i).padStart(3, "0")}.png`, buf);
    onProgress(8 + Math.round((i / FRAMES) * 40));
  }

  await ff.exec([
    "-framerate", String(FPS),
    "-i", "f%03d.png",
    "-pix_fmt", "yuv420p",
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-movflags", "+faststart",
    "out.mp4",
  ]);

  const out = (await ff.readFile("out.mp4")) as Uint8Array;
  onProgress(100);
  // Copy into a fresh ArrayBuffer-backed array so it's a valid BlobPart.
  return new Blob([new Uint8Array(out)], { type: "video/mp4" });
}
