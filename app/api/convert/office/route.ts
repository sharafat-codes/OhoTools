import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

// Office/document -> PDF via a third-party conversion API (Cloudmersive).
// Provider-swappable: only this route talks to the vendor.
async function convertToPdf(file: File): Promise<Response> {
  const apiKey = process.env.CLOUDMERSIVE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Document conversion isn't configured yet." },
      { status: 503 },
    );
  }

  const upstream = new FormData();
  upstream.append("inputFile", file, file.name);

  const res = await fetch("https://api.cloudmersive.com/convert/autodetect/to/pdf", {
    method: "POST",
    headers: { Apikey: apiKey },
    body: upstream,
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Conversion failed. Check that the file is a valid Office document." },
      { status: 502 },
    );
  }

  const pdf = await res.arrayBuffer();
  const base = file.name.replace(/\.[^.]+$/, "") || "document";
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${base}.pdf"`,
    },
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to use this tool." }, { status: 401 });
  }
  if (!isPro((user as { plan?: string }).plan ?? "FREE")) {
    return NextResponse.json(
      { error: "Office to PDF conversion is a Pro feature." },
      { status: 403 },
    );
  }

  let file: FormDataEntryValue | null = null;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 15 MB)." }, { status: 413 });
  }

  try {
    return await convertToPdf(file);
  } catch {
    return NextResponse.json({ error: "Conversion service error. Try again." }, { status: 500 });
  }
}
