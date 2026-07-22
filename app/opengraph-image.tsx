import { ImageResponse } from "next/og";

import { LogoGlyph } from "@/components/logo";

export const alt = "OhoTool — QR codes, barcodes & scan analytics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
              background: "#fafafa",
              color: "#0a0a0a",
            }}
          >
            <LogoGlyph color="#0a0a0a" size={50} />
          </div>
          <div style={{ fontSize: "40px", fontWeight: 700 }}>OhoTool</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: "76px", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: "900px" }}>
            QR codes, barcodes & scan analytics
          </div>
          <div style={{ fontSize: "34px", color: "#a1a1a1", maxWidth: "820px" }}>
            Dynamic QR codes you can edit anytime, custom branding, bulk
            generation, and an API.
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {["Dynamic QR", "Scan analytics", "Branding", "Bulk & API"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                fontSize: "24px",
                color: "#d4d4d4",
                border: "1px solid #262626",
                borderRadius: "999px",
                padding: "10px 22px",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
