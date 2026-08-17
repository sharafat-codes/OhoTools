import QRCode from "qrcode";

import type { QRInput, QRModuleStyle } from "@/modules/qr/validations";

export type EyeStyle = "square" | "rounded" | "circle";
export type GradientType = "diagonal" | "horizontal" | "vertical" | "radial";

export type QROptions = Pick<
  QRInput,
  "data" | "fgColor" | "bgColor" | "size" | "margin" | "ecLevel"
> & {
  moduleStyle?: QRModuleStyle;
  gradient?: boolean;
  fgColor2?: string | null;
  gradientType?: GradientType;
  /** Custom color for the three corner "eyes" (finder patterns). Null = match fg. */
  eyeColor?: string | null;
  eyeStyle?: EyeStyle;
  /** Transparent background (no bg fill). */
  transparent?: boolean;
  logo?: string | null;
  /** Logo width as a fraction of the QR size (0.1–0.3). Default 0.22. */
  logoScale?: number;
  /** Backing plate behind the logo. "white" (default), "match" bg, or "none". */
  logoBackground?: "white" | "match" | "none";
  /** Custom caption text drawn above/below the QR. */
  caption?: string | null;
  captionPosition?: "below" | "above";
  captionColor?: string | null;
  /** Caption font size as a fraction of the QR size (0.04–0.12). Default 0.07. */
  captionSize?: number;
  captionBold?: boolean;
};

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type Matrix = { count: number; bits: Uint8Array };

function getMatrix(data: string, ecLevel: QROptions["ecLevel"]): Matrix {
  const qr = QRCode.create(data, { errorCorrectionLevel: ecLevel });
  const modules = qr.modules as unknown as { size: number; data: Uint8Array };
  return { count: modules.size, bits: modules.data };
}

// True for any module inside one of the three 7×7 finder patterns (the "eyes").
function inFinder(r: number, c: number, count: number): boolean {
  return (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);
}

function traceRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  traceRoundRect(ctx, x, y, w, h, r);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Draw one styled eye (7×7 module block) at pixel origin (ox, oy), module size m.
function drawEyeCanvas(ctx: CanvasRenderingContext2D, ox: number, oy: number, m: number, style: EyeStyle) {
  const s7 = 7 * m;
  if (style === "circle") {
    const cx = ox + 3.5 * m;
    const cy = oy + 3.5 * m;
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5 * m, 0, Math.PI * 2);
    ctx.arc(cx, cy, 2.5 * m, 0, Math.PI * 2);
    ctx.fill("evenodd");
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5 * m, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === "rounded") {
    ctx.beginPath();
    traceRoundRect(ctx, ox, oy, s7, s7, 2 * m);
    traceRoundRect(ctx, ox + m, oy + m, 5 * m, 5 * m, 1.4 * m);
    ctx.fill("evenodd");
    roundRectPath(ctx, ox + 2 * m, oy + 2 * m, 3 * m, 3 * m, m);
    ctx.fill();
  } else {
    // Square — crisp filled bars (pixel-exact finder = maximally scannable).
    ctx.fillRect(ox, oy, s7, m);
    ctx.fillRect(ox, oy + 6 * m, s7, m);
    ctx.fillRect(ox, oy + m, m, 5 * m);
    ctx.fillRect(ox + 6 * m, oy + m, m, 5 * m);
    ctx.fillRect(ox + 2 * m, oy + 2 * m, 3 * m, 3 * m);
  }
}

function setForeground(ctx: CanvasRenderingContext2D, px: number, opts: QROptions) {
  if (opts.gradient && opts.fgColor2) {
    const t = opts.gradientType ?? "diagonal";
    const g =
      t === "radial"
        ? ctx.createRadialGradient(px / 2, px / 2, px * 0.05, px / 2, px / 2, px * 0.7)
        : t === "horizontal"
          ? ctx.createLinearGradient(0, 0, px, 0)
          : t === "vertical"
            ? ctx.createLinearGradient(0, 0, 0, px)
            : ctx.createLinearGradient(0, 0, px, px);
    g.addColorStop(0, opts.fgColor);
    g.addColorStop(1, opts.fgColor2);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = opts.fgColor;
  }
}

/** Draw a styled QR onto a canvas (client-side). */
export async function drawQrToCanvas(canvas: HTMLCanvasElement, opts: QROptions) {
  const { count, bits } = getMatrix(opts.data, opts.ecLevel);
  const margin = opts.margin;
  const total = count + margin * 2;
  const px = opts.size;
  const m = px / total;
  const style = opts.moduleStyle ?? "square";

  const caption = (opts.caption ?? "").trim();
  const capSize = caption ? Math.min(0.12, Math.max(0.04, opts.captionSize ?? 0.07)) : 0;
  const fontPx = px * capSize;
  const bandPx = caption ? fontPx * 1.7 : 0;
  const yOff = caption && opts.captionPosition === "above" ? bandPx : 0;

  canvas.width = px;
  canvas.height = px + bandPx;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, px, px + bandPx);
  if (!opts.transparent) {
    ctx.fillStyle = opts.bgColor;
    ctx.fillRect(0, 0, px, px + bandPx);
  }

  ctx.save();
  ctx.translate(0, yOff);
  setForeground(ctx, px, opts);

  // Modules (skip the finder patterns — drawn separately as eyes).
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!bits[r * count + c]) continue;
      if (inFinder(r, c, count)) continue;
      const x = (margin + c) * m;
      const y = (margin + r) * m;
      if (style === "dots") {
        ctx.beginPath();
        ctx.arc(x + m / 2, y + m / 2, (m / 2) * 0.9, 0, Math.PI * 2);
        ctx.fill();
      } else if (style === "rounded") {
        roundRectPath(ctx, x, y, m, m, m * 0.35);
        ctx.fill();
      } else {
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(m) + 1, Math.ceil(m) + 1);
      }
    }
  }

  // Eyes.
  if (opts.eyeColor) ctx.fillStyle = opts.eyeColor;
  const eyeStyle = opts.eyeStyle ?? "square";
  drawEyeCanvas(ctx, margin * m, margin * m, m, eyeStyle);
  drawEyeCanvas(ctx, (margin + count - 7) * m, margin * m, m, eyeStyle);
  drawEyeCanvas(ctx, margin * m, (margin + count - 7) * m, m, eyeStyle);

  if (opts.logo) {
    const img = await loadImage(opts.logo);
    const logoSize = px * Math.min(0.3, Math.max(0.1, opts.logoScale ?? 0.22));
    const lx = (px - logoSize) / 2;
    const pad = logoSize * 0.12;
    const lb = opts.logoBackground ?? "white";
    const plate = lb === "none" ? null : lb === "match" ? (opts.transparent ? null : opts.bgColor) : "#ffffff";
    if (plate) {
      ctx.fillStyle = plate;
      roundRectPath(ctx, lx - pad, lx - pad, logoSize + pad * 2, logoSize + pad * 2, logoSize * 0.18);
      ctx.fill();
    }
    ctx.drawImage(img, lx, lx, logoSize, logoSize);
  }

  ctx.restore();

  if (caption) {
    const cy = opts.captionPosition === "above" ? bandPx / 2 : px + bandPx / 2;
    ctx.fillStyle = opts.captionColor || opts.fgColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const weight = opts.captionBold ? "700" : "500";
    let fp = fontPx;
    const maxW = px * 0.92;
    ctx.font = `${weight} ${fp}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    while (fp > 6 && ctx.measureText(caption).width > maxW) {
      fp -= 1;
      ctx.font = `${weight} ${fp}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    }
    ctx.fillText(caption, px / 2, cy);
  }
}

/** Render a styled QR to a PNG data URL (client-side). */
export async function qrToPngDataUrl(opts: QROptions): Promise<string> {
  const canvas = document.createElement("canvas");
  await drawQrToCanvas(canvas, opts);
  return canvas.toDataURL("image/png");
}

// ── SVG ──────────────────────────────────────────────────────────────────────
function roundRectData(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x + r},${y} h${w - 2 * r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 ${-r},${r} h${-(w - 2 * r)} a${r},${r} 0 0 1 ${-r},${-r} v${-(h - 2 * r)} a${r},${r} 0 0 1 ${r},${-r} Z`;
}
function circleData(cx: number, cy: number, r: number): string {
  return `M${cx - r},${cy} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 Z`;
}

function eyeSvg(ox: number, oy: number, style: EyeStyle, fill: string): string {
  if (style === "circle") {
    const cx = ox + 3.5;
    const cy = oy + 3.5;
    return (
      `<path fill-rule="evenodd" d="${circleData(cx, cy, 3.5)}${circleData(cx, cy, 2.5)}" fill="${fill}"/>` +
      `<circle cx="${cx}" cy="${cy}" r="1.5" fill="${fill}"/>`
    );
  }
  if (style === "rounded") {
    return (
      `<path fill-rule="evenodd" d="${roundRectData(ox, oy, 7, 7, 2)}${roundRectData(ox + 1, oy + 1, 5, 5, 1.4)}" fill="${fill}"/>` +
      `<rect x="${ox + 2}" y="${oy + 2}" width="3" height="3" rx="1" fill="${fill}"/>`
    );
  }
  // square
  return (
    `<path fill-rule="evenodd" d="M${ox},${oy}h7v7h-7Z M${ox + 1},${oy + 1}v5h5v-5Z" fill="${fill}"/>` +
    `<rect x="${ox + 2}" y="${oy + 2}" width="3" height="3" fill="${fill}"/>`
  );
}

/** Render a styled QR to an SVG string. */
export function qrToSvgString(opts: QROptions): string {
  const { count, bits } = getMatrix(opts.data, opts.ecLevel);
  const margin = opts.margin;
  const total = count + margin * 2;
  const style = opts.moduleStyle ?? "square";

  const caption = (opts.caption ?? "").trim();
  const capSize = caption ? Math.min(0.12, Math.max(0.04, opts.captionSize ?? 0.07)) : 0;
  const fontU = total * capSize;
  const bandU = caption ? fontU * 1.7 : 0;
  const yOff = caption && opts.captionPosition === "above" ? bandU : 0;
  const vbH = total + bandU;
  const svgH = Math.round(opts.size * (vbH / total));

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.size}" height="${svgH}" viewBox="0 0 ${total} ${vbH}" shape-rendering="geometricPrecision">`,
  );

  let fill = opts.fgColor;
  if (opts.gradient && opts.fgColor2) {
    const t = opts.gradientType ?? "diagonal";
    const grad =
      t === "radial"
        ? `<radialGradient id="g" cx="0.5" cy="0.5" r="0.65"><stop offset="0" stop-color="${opts.fgColor}"/><stop offset="1" stop-color="${opts.fgColor2}"/></radialGradient>`
        : `<linearGradient id="g" x1="0" y1="0" x2="${t === "vertical" ? 0 : 1}" y2="${t === "horizontal" ? 0 : 1}"><stop offset="0" stop-color="${opts.fgColor}"/><stop offset="1" stop-color="${opts.fgColor2}"/></linearGradient>`;
    parts.push(`<defs>${grad}</defs>`);
    fill = "url(#g)";
  }

  if (!opts.transparent) parts.push(`<rect width="${total}" height="${vbH}" fill="${opts.bgColor}"/>`);

  parts.push(`<g transform="translate(0 ${yOff})">`);
  parts.push(`<g fill="${fill}">`);
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!bits[r * count + c]) continue;
      if (inFinder(r, c, count)) continue;
      const x = margin + c;
      const y = margin + r;
      if (style === "dots") {
        parts.push(`<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.45"/>`);
      } else if (style === "rounded") {
        parts.push(`<rect x="${x}" y="${y}" width="1" height="1" rx="0.35"/>`);
      } else {
        parts.push(`<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`);
      }
    }
  }
  parts.push(`</g>`);

  const eyeStyle = opts.eyeStyle ?? "square";
  const eyeFill = opts.eyeColor || fill;
  parts.push(eyeSvg(margin, margin, eyeStyle, eyeFill));
  parts.push(eyeSvg(margin + count - 7, margin, eyeStyle, eyeFill));
  parts.push(eyeSvg(margin, margin + count - 7, eyeStyle, eyeFill));

  if (opts.logo) {
    const logoSize = total * Math.min(0.3, Math.max(0.1, opts.logoScale ?? 0.22));
    const lx = (total - logoSize) / 2;
    const pad = logoSize * 0.12;
    const lb = opts.logoBackground ?? "white";
    const plate = lb === "none" ? null : lb === "match" ? (opts.transparent ? null : opts.bgColor) : "#ffffff";
    if (plate) {
      parts.push(
        `<rect x="${lx - pad}" y="${lx - pad}" width="${logoSize + pad * 2}" height="${logoSize + pad * 2}" rx="${logoSize * 0.18}" fill="${plate}"/>`,
      );
    }
    parts.push(`<image href="${opts.logo}" x="${lx}" y="${lx}" width="${logoSize}" height="${logoSize}"/>`);
  }
  parts.push(`</g>`);

  if (caption) {
    const ty = opts.captionPosition === "above" ? bandU / 2 : total + bandU / 2;
    const capColor = opts.captionColor || opts.fgColor;
    parts.push(
      `<text x="${total / 2}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-family="system-ui, -apple-system, sans-serif" font-size="${fontU}" font-weight="${opts.captionBold ? 700 : 500}" fill="${escapeXml(capColor)}">${escapeXml(caption)}</text>`,
    );
  }

  parts.push(`</svg>`);
  return parts.join("");
}
