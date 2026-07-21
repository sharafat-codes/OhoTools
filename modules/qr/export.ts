import { jsPDF } from "jspdf";
import JSZip from "jszip";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadSvg(svg: string, filename: string) {
  downloadBlob(new Blob([svg], { type: "image/svg+xml" }), filename);
}

/** Center the QR PNG on an A4 page and save as PDF. */
export function downloadPdf(pngDataUrl: string, filename: string) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const s = Math.min(pageW, pageH) * 0.6;
  pdf.addImage(pngDataUrl, "PNG", (pageW - s) / 2, (pageH - s) / 2, s, s);
  pdf.save(filename);
}

/** Zip a set of PNG data URLs and download. */
export async function downloadZip(
  files: { name: string; dataUrl: string }[],
  zipName: string,
) {
  const zip = new JSZip();
  files.forEach((f, i) => {
    const base64 = f.dataUrl.split(",")[1] ?? "";
    // Ensure unique, safe file names.
    zip.file(`${String(i + 1).padStart(3, "0")}-${f.name}.png`, base64, {
      base64: true,
    });
  });
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, zipName);
}
