import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Same-origin proxy used as a CORS fallback when the browser can't fetch a
// cloud provider's direct download link. Locked to known provider hosts to
// prevent it from being used as an open proxy (SSRF).
const ALLOWED_HOST = [
  /(^|\.)dropboxusercontent\.com$/i,
  /(^|\.)dropbox\.com$/i,
  /(^|\.)googleusercontent\.com$/i,
  /(^|\.)googleapis\.com$/i,
];

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "Missing url." }, { status: 400 });

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Invalid url." }, { status: 400 });
  }
  if (target.protocol !== "https:" || !ALLOWED_HOST.some((re) => re.test(target.hostname))) {
    return NextResponse.json({ error: "That host isn't allowed." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.toString());
  } catch {
    return NextResponse.json({ error: "Could not fetch the file." }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Could not fetch the file." }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/octet-stream",
      "cache-control": "no-store",
    },
  });
}
