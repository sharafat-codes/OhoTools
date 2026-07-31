import { ImageResponse } from "next/og";

import { TOOL_COUNT_LABEL } from "@/modules/tools/registry";
import { siteConfig } from "@/lib/site";

export const alt = "OhoTool — Free online tools for PDF, images, text & more";
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

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: "76px", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: "980px" }}>
            Every online tool you need — free & private
          </div>
          <div style={{ fontSize: "34px", color: "#a1a1a1", maxWidth: "860px" }}>
            {`${TOOL_COUNT_LABEL} browser-based tools for PDF, images, text, and code. No sign-up, nothing uploaded.`}
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {["PDF & converters", "Image tools", "Developer", "QR + analytics"].map((t) => (
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
