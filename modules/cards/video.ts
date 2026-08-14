// Client-side animated card export: draw the card animation frame-by-frame on a
// canvas, then encode an MP4 with the shared ffmpeg.wasm engine. Crisper and
// smaller than a GIF, and plays natively on WhatsApp. Used by the Pro export.

import { getFfmpeg } from "@/modules/tools/components/ffmpeg-client";
import { resolveTheme, OCCASIONS, type CardData } from "@/modules/cards/types";

const W = 480;
const H = 600;
const FPS = 15;
const DURATION = 3; // seconds
const FRAMES = FPS * DURATION;

type Particle = { x: number; speed: number; size: number; color: string; drift: number; phase: number; rot: number; vr: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

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

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 5);
}

function drawFrame(ctx: CanvasRenderingContext2D, t: number, data: CardData, particles: Particle[], photo: HTMLImageElement | null) {
  const th = resolveTheme(data);

  // background
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, th.bg1);
  g.addColorStop(1, th.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // falling particles
  for (const p of particles) {
    const y = (((t * p.speed + p.x) % (H + 60)) + H + 60) % (H + 60) - 30;
    const x = p.x + Math.sin(t * 2 + p.phase) * p.drift;
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.translate(x, y);
    ctx.rotate(p.rot + t * p.vr);
    ctx.fillStyle = p.color;
    drawShape(ctx, data.effect, p.size);
    ctx.restore();
  }

  // content — fade/scale in over the first 0.6s
  const appear = Math.min(1, t / 0.6);
  ctx.save();
  ctx.globalAlpha = appear;
  ctx.textAlign = "center";
  ctx.fillStyle = th.text;

  // measure block heights to center vertically
  const hasPhoto = !!photo;
  const photoR = 54;
  const gap = 14;
  ctx.font = "700 46px Georgia, 'Times New Roman', serif";
  const nameSize = 46;
  ctx.font = "400 22px Arial, sans-serif";
  const msgLines = wrapLines(ctx, data.message, W - 90);
  const msgLineH = 30;
  const eyebrowH = 22;
  const fromH = data.from.trim() ? 30 : 0;
  const total =
    (hasPhoto ? photoR * 2 + gap : 0) + eyebrowH + gap + nameSize + gap + msgLines.length * msgLineH + (fromH ? gap + fromH : 0);
  let y = (H - total) / 2;

  if (hasPhoto && photo) {
    const cx = W / 2;
    const cy = y + photoR;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(photo, cx - photoR, cy - photoR, photoR * 2, photoR * 2);
    ctx.restore();
    ctx.lineWidth = 5;
    ctx.strokeStyle = th.accent;
    ctx.beginPath();
    ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
    ctx.stroke();
    y += photoR * 2 + gap;
  }

  // eyebrow
  ctx.fillStyle = th.accent;
  ctx.font = "600 18px Arial, sans-serif";
  ctx.fillText(OCCASIONS[data.occasion].eyebrow.toUpperCase(), W / 2, y + 16);
  y += eyebrowH + gap;

  // name (scale-in)
  const scale = 0.85 + 0.15 * appear;
  ctx.save();
  ctx.translate(W / 2, y + nameSize * 0.8);
  ctx.scale(scale, scale);
  ctx.fillStyle = th.text;
  ctx.font = "800 46px Georgia, 'Times New Roman', serif";
  ctx.fillText(data.to, 0, 0);
  ctx.restore();
  y += nameSize + gap;

  // message
  ctx.fillStyle = th.text;
  ctx.font = "400 22px Arial, sans-serif";
  for (const line of msgLines) {
    ctx.fillText(line, W / 2, y + 20);
    y += msgLineH;
  }

  // from
  if (data.from.trim()) {
    y += gap;
    ctx.fillStyle = th.accent;
    ctx.font = "600 20px Arial, sans-serif";
    ctx.fillText("— " + data.from, W / 2, y + 16);
  }

  ctx.restore();
}

export async function exportCardVideo(data: CardData, onProgress: (pct: number) => void): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const photo = data.photo ? await loadImage(data.photo).catch(() => null) : null;
  const th = resolveTheme(data);
  const particles = makeParticles([th.accent, "#ffffff", th.bg2, "#fde68a"]);

  // ffmpeg progress maps to the second half (50–100%)
  const ff = await getFfmpeg((p) => onProgress(50 + Math.round(p / 2)));

  for (let i = 0; i < FRAMES; i++) {
    drawFrame(ctx, i / FPS, data, particles, photo);
    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b as Blob), "image/png"));
    const buf = new Uint8Array(await blob.arrayBuffer());
    await ff.writeFile(`f${String(i).padStart(3, "0")}.png`, buf);
    onProgress(Math.round((i / FRAMES) * 45));
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
