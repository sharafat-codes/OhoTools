import type { NextRequest } from "next/server";
import QRCode from "qrcode";

import { authenticateApiKey } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

function clampInt(raw: string | null, fallback: number, min: number, max: number) {
  const n = raw ? parseInt(raw, 10) : NaN;
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeHex(raw: string | null, fallback: string) {
  if (!raw) return fallback;
  const v = raw.startsWith("#") ? raw : `#${raw}`;
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
}

export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");
  if (!data) {
    return Response.json(
      { error: "Missing 'data' query parameter." },
      { status: 400 },
    );
  }

  const size = clampInt(searchParams.get("size"), 512, 128, 1024);
  const margin = clampInt(searchParams.get("margin"), 2, 0, 10);
  const ecParam = searchParams.get("ec") ?? "M";
  const ecLevel = (["L", "M", "Q", "H"].includes(ecParam) ? ecParam : "M") as
    | "L"
    | "M"
    | "Q"
    | "H";
  const dark = normalizeHex(searchParams.get("dark"), "#000000");
  const light = normalizeHex(searchParams.get("light"), "#ffffff");

  try {
    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: ecLevel,
      margin,
      width: size,
      color: { dark, light },
    });
    return new Response(new Uint8Array(buffer), {
      headers: { "content-type": "image/png", "cache-control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "Could not generate a QR code for that input." },
      { status: 400 },
    );
  }
}
