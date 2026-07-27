import type { NextRequest } from "next/server";

import { authenticateApiKey } from "@/lib/api-auth";
import {
  convertFile,
  convertUrl,
  isWebOp,
  CONVERT_OPS,
  WEB_OPS,
} from "@/lib/convert";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public docs — no auth, so developers can discover the endpoint.
export function GET() {
  return Response.json({
    endpoint: `${SITE_URL}/api/v1/convert`,
    method: "POST",
    auth: "Authorization: Bearer <your Pro API key>",
    fileOps: Object.keys(CONVERT_OPS),
    urlOps: Object.keys(WEB_OPS),
    usage: {
      file: 'multipart/form-data with fields: op=<fileOp>, file=<binary>',
      url: 'application/json body: { "op": "url-to-pdf", "url": "https://example.com" }',
    },
    example:
      `curl -X POST "${SITE_URL}/api/v1/convert" ` +
      `-H "Authorization: Bearer oho_..." ` +
      `-F op=to-pdf -F file=@document.docx --output document.pdf`,
  });
}

export async function POST(req: NextRequest) {
  const auth = await authenticateApiKey(req);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const contentType = req.headers.get("content-type") || "";

  // URL / HTML → PDF via JSON body.
  if (contentType.includes("application/json")) {
    let body: { op?: string; url?: string };
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const op = body.op || "url-to-pdf";
    if (!isWebOp(op)) {
      return Response.json({ error: `Unsupported url op. Try one of: ${Object.keys(WEB_OPS).join(", ")}.` }, { status: 400 });
    }
    const result = await convertUrl(op, (body.url || "").trim());
    if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
    return fileResponse(result.bytes, result.mime, `webpage.${result.ext}`);
  }

  // File → file via multipart form.
  let file: FormDataEntryValue | null = null;
  let op = "to-pdf";
  let urlInput = "";
  try {
    const form = await req.formData();
    file = form.get("file");
    op = (form.get("op") as string) || "to-pdf";
    urlInput = ((form.get("url") as string) || "").trim();
  } catch {
    return Response.json({ error: "Send multipart/form-data with 'op' and 'file', or JSON for url ops." }, { status: 400 });
  }

  if (isWebOp(op)) {
    const result = await convertUrl(op, urlInput);
    if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
    return fileResponse(result.bytes, result.mime, `webpage.${result.ext}`);
  }

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided. Send a 'file' field." }, { status: 400 });
  }
  const result = await convertFile(op, file);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
  const base = file.name.replace(/\.[^.]+$/, "") || "converted";
  return fileResponse(result.bytes, result.mime, `${base}.${result.ext}`);
}

function fileResponse(bytes: ArrayBuffer, mime: string, filename: string) {
  return new Response(bytes, {
    headers: {
      "content-type": mime,
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
