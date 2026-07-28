// Small client-side helpers shared by the image-editing tools.

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export function blobFromCanvas(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), type, quality),
  );
}

/** Keep JPEGs as JPEG (so photos don't balloon to PNG); everything else → PNG. */
export function pickOutput(file: File): { type: string; ext: string } {
  const isJpeg = file.type === "image/jpeg" || /\.jpe?g$/i.test(file.name);
  return isJpeg ? { type: "image/jpeg", ext: "jpg" } : { type: "image/png", ext: "png" };
}

export function baseName(file: File): string {
  return file.name.replace(/\.[^.]+$/, "") || "image";
}

export function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
