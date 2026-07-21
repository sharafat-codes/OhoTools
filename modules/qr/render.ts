import QRCode from "qrcode";

import type { QRInput, QRModuleStyle } from "@/modules/qr/validations";

export type QROptions = Pick<
  QRInput,
  "data" | "fgColor" | "bgColor" | "size" | "margin" | "ecLevel"
> & {
  moduleStyle?: QRModuleStyle;
  gradient?: boolean;
  fgColor2?: string | null;
  logo?: string | null;
};

type Matrix = { count: number; bits: Uint8Array };

function getMatrix(data: string, ecLevel: QROptions["ecLevel"]): Matrix {
  const qr = QRCode.create(data, { errorCorrectionLevel: ecLevel });
  const modules = qr.modules as unknown as { size: number; data: Uint8Array };
  return { count: modules.size, bits: modules.data };
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draw a styled QR onto a canvas (client-side). Returns nothing; reads canvas after. */
export async function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  opts: QROptions,
) {
  const { count, bits } = getMatrix(opts.data, opts.ecLevel);
  const margin = opts.margin;
  const total = count + margin * 2;
  const px = opts.size;
  const m = px / total;
  const style = opts.moduleStyle ?? "square";

  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = opts.bgColor;
  ctx.fillRect(0, 0, px, px);

  if (opts.gradient && opts.fgColor2) {
    const g = ctx.createLinearGradient(0, 0, px, px);
    g.addColorStop(0, opts.fgColor);
    g.addColorStop(1, opts.fgColor2);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = opts.fgColor;
  }

  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!bits[r * count + c]) continue;
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
        // Slight overdraw avoids hairline seams between modules.
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(m) + 1, Math.ceil(m) + 1);
      }
    }
  }

  if (opts.logo) {
    const img = await loadImage(opts.logo);
    const logoSize = px * 0.22;
    const lx = (px - logoSize) / 2;
    const pad = logoSize * 0.12;
    ctx.fillStyle = opts.bgColor || "#ffffff";
    roundRectPath(ctx, lx - pad, lx - pad, logoSize + pad * 2, logoSize + pad * 2, logoSize * 0.18);
    ctx.fill();
    ctx.drawImage(img, lx, lx, logoSize, logoSize);
  }
}

/** Render a styled QR to a PNG data URL (client-side). */
export async function qrToPngDataUrl(opts: QROptions): Promise<string> {
  const canvas = document.createElement("canvas");
  await drawQrToCanvas(canvas, opts);
  return canvas.toDataURL("image/png");
}

/** Render a styled QR to an SVG string (vector; client or server safe). */
export function qrToSvgString(opts: QROptions): string {
  const { count, bits } = getMatrix(opts.data, opts.ecLevel);
  const margin = opts.margin;
  const total = count + margin * 2;
  const style = opts.moduleStyle ?? "square";

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${opts.size}" height="${opts.size}" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">`,
  );

  let fill = opts.fgColor;
  if (opts.gradient && opts.fgColor2) {
    parts.push(
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${opts.fgColor}"/><stop offset="1" stop-color="${opts.fgColor2}"/></linearGradient></defs>`,
    );
    fill = "url(#g)";
  }

  parts.push(`<rect width="${total}" height="${total}" fill="${opts.bgColor}"/>`);
  parts.push(`<g fill="${fill}">`);
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!bits[r * count + c]) continue;
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

  if (opts.logo) {
    const logoSize = total * 0.22;
    const lx = (total - logoSize) / 2;
    const pad = logoSize * 0.12;
    parts.push(
      `<rect x="${lx - pad}" y="${lx - pad}" width="${logoSize + pad * 2}" height="${logoSize + pad * 2}" rx="${logoSize * 0.18}" fill="${opts.bgColor}"/>`,
    );
    parts.push(
      `<image href="${opts.logo}" x="${lx}" y="${lx}" width="${logoSize}" height="${logoSize}"/>`,
    );
  }

  parts.push(`</svg>`);
  return parts.join("");
}
