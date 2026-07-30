// Client-side helpers for rasterizing SVG (file or markup) to PNG/JPG/WebP.
// Everything runs in the browser via a <canvas> — nothing is uploaded.

/** Best-effort intrinsic size of an SVG from its width/height, else its viewBox. */
export function svgBaseSize(svgText: string): { w: number; h: number } {
  try {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (svg) {
      let w = parseFloat(svg.getAttribute("width") || "") || 0;
      let h = parseFloat(svg.getAttribute("height") || "") || 0;
      if (!w || !h) {
        const vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
        if (vb.length === 4 && vb.every((n) => Number.isFinite(n))) {
          w = w || vb[2];
          h = h || vb[3];
        }
      }
      if (w > 0 && h > 0) return { w, h };
    }
  } catch {
    /* fall through to default */
  }
  return { w: 512, h: 512 };
}

/**
 * Render SVG markup to a raster Blob at `scale`× its intrinsic size. Rejects on
 * invalid SVG, or if the SVG pulls in cross-origin resources (which taint the
 * canvas and block export).
 */
export function rasterizeSvg(
  svgText: string,
  type: string,
  scale: number,
  quality = 0.92,
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const { w, h } = svgBaseSize(svgText);
    const width = Math.max(1, Math.round(w * scale));
    const height = Math.max(1, Math.round(h * scale));
    const url = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas is not supported in this browser."));
          return;
        }
        if (type === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (b) => (b ? resolve({ blob: b, width, height }) : reject(new Error("Could not encode the image."))),
          type,
          quality,
        );
      } catch {
        reject(new Error("This SVG references external resources and can't be exported for security reasons."));
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That doesn't look like valid SVG."));
    };
    img.src = url;
  });
}
