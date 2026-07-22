import { ImageResponse } from "next/og";

import { LogoGlyph } from "@/components/logo";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#ffffff",
          borderRadius: 14,
        }}
      >
        <LogoGlyph color="#ffffff" size={44} />
      </div>
    ),
    { ...size },
  );
}
