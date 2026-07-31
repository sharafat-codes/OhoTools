import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

// Dynamic, branded Open Graph card. Tool/category/blog metadata point their
// `openGraph.images` at /og?title=…&subtitle=…&eyebrow=… so each page gets a
// share image naming the actual page instead of one site-wide card.
export const runtime = "nodejs";

function clamp(v: string | null, max: number, fallback = ""): string {
  const s = (v ?? "").trim();
  if (!s) return fallback;
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eyebrow = clamp(searchParams.get("eyebrow"), 40, "OhoTool");
  const title = clamp(searchParams.get("title"), 80, "Free online tools");
  const subtitle = clamp(
    searchParams.get("subtitle"),
    150,
    "Fast, private, browser-based tools for PDF, images, text, and code.",
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "80px",
          color: "#fafafa",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: `linear-gradient(135deg, ${siteConfig.brand.gradientFrom} 0%, ${siteConfig.brand.gradientTo} 100%)`,
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "9999px",
                border: "9px solid #ffffff",
              }}
            />
          </div>
          <div style={{ fontSize: "40px", fontWeight: 700 }}>OhoTool</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "26px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#8b5cf6",
              fontWeight: 600,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: "78px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: "34px", color: "#a1a1a1", maxWidth: "900px" }}>
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "26px", color: "#d4d4d4" }}>ohotool.com</div>
          <div style={{ fontSize: "24px", color: "#a1a1a1" }}>Free · Private · No sign-up</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
