import "server-only";

// Shared document-conversion logic (Cloudmersive). Used by both the in-app
// tool route (app/api/convert/office) and the public API (app/api/v1/convert),
// so the provider and endpoint map live in exactly one place.

export const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

// File → file conversions: vendor endpoint + output type. `field` overrides the
// default multipart field name (the Image API uses `imageFile`).
export const CONVERT_OPS: Record<
  string,
  { path: string; ext: string; mime: string; field?: string }
> = {
  "to-pdf": { path: "convert/autodetect/to/pdf", ext: "pdf", mime: "application/pdf" },
  "pdf-to-word": {
    path: "convert/pdf/to/docx",
    ext: "docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  "to-text": { path: "convert/autodetect/to/txt", ext: "txt", mime: "text/plain" },
  "heic-to-jpg": { path: "image/convert/heic/jpg", ext: "jpg", mime: "image/jpeg", field: "imageFile" },
  "heic-to-png": { path: "image/convert/heic/png", ext: "png", mime: "image/png", field: "imageFile" },
};

// Text (URL / HTML) → file conversions: JSON request body.
export const WEB_OPS: Record<
  string,
  { path: string; bodyKey: string; ext: string; mime: string }
> = {
  "url-to-pdf": { path: "convert/web/url/to/pdf", bodyKey: "Url", ext: "pdf", mime: "application/pdf" },
};

export type ConvertResult =
  | { ok: true; bytes: ArrayBuffer; mime: string; ext: string }
  | { ok: false; status: number; error: string };

export function isConvertConfigured(): boolean {
  return Boolean(process.env.CLOUDMERSIVE_API_KEY?.trim());
}

function apiKey(): string | null {
  return process.env.CLOUDMERSIVE_API_KEY?.trim() || null;
}

/** Convert an uploaded file via a CONVERT_OPS op. */
export async function convertFile(op: string, file: File): Promise<ConvertResult> {
  const key = apiKey();
  if (!key) return { ok: false, status: 503, error: "Document conversion isn't configured yet." };

  const spec = CONVERT_OPS[op];
  if (!spec) return { ok: false, status: 400, error: "Unsupported conversion." };
  if (file.size > MAX_BYTES) return { ok: false, status: 413, error: "File too large (max 15 MB)." };

  try {
    const upstream = new FormData();
    upstream.append(spec.field ?? "inputFile", file, file.name);
    const res = await fetch(`https://api.cloudmersive.com/${spec.path}`, {
      method: "POST",
      headers: { Apikey: key },
      body: upstream,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        status: 502,
        error: `Conversion failed (${res.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`,
      };
    }
    return { ok: true, bytes: await res.arrayBuffer(), mime: spec.mime, ext: spec.ext };
  } catch {
    return { ok: false, status: 500, error: "Conversion service error. Try again." };
  }
}

/** Convert a URL (or HTML) to a file via a WEB_OPS op. */
export async function convertUrl(op: string, url: string): Promise<ConvertResult> {
  const key = apiKey();
  if (!key) return { ok: false, status: 503, error: "Document conversion isn't configured yet." };

  const spec = WEB_OPS[op];
  if (!spec) return { ok: false, status: 400, error: "Unsupported conversion." };
  if (!/^https?:\/\/.+/i.test(url)) {
    return { ok: false, status: 400, error: "Enter a valid URL starting with http:// or https://" };
  }

  try {
    const res = await fetch(`https://api.cloudmersive.com/${spec.path}`, {
      method: "POST",
      headers: { Apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ [spec.bodyKey]: url }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        status: 502,
        error: `Could not render that URL to PDF (${res.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`,
      };
    }
    return { ok: true, bytes: await res.arrayBuffer(), mime: spec.mime, ext: spec.ext };
  } catch {
    return { ok: false, status: 500, error: "Conversion service error. Try again." };
  }
}

export function isWebOp(op: string): boolean {
  return op in WEB_OPS;
}
