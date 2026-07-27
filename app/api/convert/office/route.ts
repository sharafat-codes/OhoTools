import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { convertFile, convertUrl, isWebOp, isConvertConfigured } from "@/lib/convert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to use this tool." }, { status: 401 });
  }
  if (!isPro((user as { plan?: string }).plan ?? "FREE")) {
    return NextResponse.json({ error: "Document conversion is a Pro feature." }, { status: 403 });
  }
  if (!isConvertConfigured()) {
    return NextResponse.json({ error: "Document conversion isn't configured yet." }, { status: 503 });
  }

  let file: FormDataEntryValue | null = null;
  let op = "to-pdf";
  let urlInput = "";
  try {
    const form = await req.formData();
    file = form.get("file");
    op = (form.get("op") as string) || "to-pdf";
    urlInput = ((form.get("url") as string) || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // URL / HTML → PDF (text input).
  if (isWebOp(op)) {
    const result = await convertUrl(op, urlInput);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    let base = "webpage";
    try {
      base = new URL(urlInput).hostname.replace(/^www\./, "") || "webpage";
    } catch {
      /* keep default */
    }
    return fileResponse(result.bytes, result.mime, `${base}.${result.ext}`);
  }

  // File → file conversion.
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const result = await convertFile(op, file);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  const base = file.name.replace(/\.[^.]+$/, "") || "document";
  return fileResponse(result.bytes, result.mime, `${base}.${result.ext}`);
}

function fileResponse(bytes: ArrayBuffer, mime: string, filename: string) {
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
