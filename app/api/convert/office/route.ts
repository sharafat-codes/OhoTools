import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

// Supported conversions -> the vendor endpoint + output type.
// Provider-swappable: only this map + fetch know about Cloudmersive.
const OPS: Record<string, { path: string; ext: string; mime: string; field?: string }> = {
  "to-pdf": {
    path: "convert/autodetect/to/pdf",
    ext: "pdf",
    mime: "application/pdf",
  },
  "pdf-to-word": {
    path: "convert/pdf/to/docx",
    ext: "docx",
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  "to-text": {
    path: "convert/autodetect/to/txt",
    ext: "txt",
    mime: "text/plain",
  },
  // Image API uses a different base path + `imageFile` field.
  "heic-to-jpg": {
    path: "image/convert/heic/jpg",
    ext: "jpg",
    mime: "image/jpeg",
    field: "imageFile",
  },
  "heic-to-png": {
    path: "image/convert/heic/png",
    ext: "png",
    mime: "image/png",
    field: "imageFile",
  },
};

// OCR ops return JSON ({ TextResult }) instead of a downloadable file.
const OCR_OPS: Record<string, { path: string; field: string }> = {
  "image-to-text": { path: "ocr/image/toText", field: "imageFile" },
};

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to use this tool." }, { status: 401 });
  }
  if (!isPro((user as { plan?: string }).plan ?? "FREE")) {
    return NextResponse.json({ error: "Document conversion is a Pro feature." }, { status: 403 });
  }

  const apiKey = process.env.CLOUDMERSIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Document conversion isn't configured yet." }, { status: 503 });
  }

  let file: FormDataEntryValue | null = null;
  let op = "to-pdf";
  try {
    const form = await req.formData();
    file = form.get("file");
    op = (form.get("op") as string) || "to-pdf";
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const ocr = OCR_OPS[op];
  const spec = OPS[op];
  if (!spec && !ocr) {
    return NextResponse.json({ error: "Unsupported conversion." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 15 MB)." }, { status: 413 });
  }

  // OCR: returns recognized text as JSON.
  if (ocr) {
    try {
      const upstream = new FormData();
      upstream.append(ocr.field, file, file.name);
      const res = await fetch(`https://api.cloudmersive.com/${ocr.path}`, {
        method: "POST",
        headers: { Apikey: apiKey },
        body: upstream,
      });
      if (!res.ok) {
        return NextResponse.json({ error: "Text recognition failed. Try a clearer image." }, { status: 502 });
      }
      const j = (await res.json()) as { TextResult?: string };
      return NextResponse.json({ text: (j.TextResult ?? "").trim() });
    } catch {
      return NextResponse.json({ error: "Recognition service error. Try again." }, { status: 500 });
    }
  }

  try {
    const upstream = new FormData();
    upstream.append(spec.field ?? "inputFile", file, file.name);
    const res = await fetch(`https://api.cloudmersive.com/${spec.path}`, {
      method: "POST",
      headers: { Apikey: apiKey },
      body: upstream,
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Conversion failed. Check that the file is a valid document." },
        { status: 502 },
      );
    }
    const out = await res.arrayBuffer();
    const base = file.name.replace(/\.[^.]+$/, "") || "document";
    return new NextResponse(out, {
      headers: {
        "Content-Type": spec.mime,
        "Content-Disposition": `attachment; filename="${base}.${spec.ext}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Conversion service error. Try again." }, { status: 500 });
  }
}
