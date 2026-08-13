import { ImageResponse } from "next/og";

import { decodeCard } from "@/modules/cards/share";
import { resolveTheme, DEFAULT_CARD } from "@/modules/cards/types";
import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";

export const runtime = "nodejs";

// Renders a still PNG of a card for download (Pro). Uses the same ImageResponse
// engine as /og for reliability. Free users get a small watermark; Pro doesn't.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const card = decodeCard(searchParams.get("d")) ?? DEFAULT_CARD;
  const t = resolveTheme(card);

  let pro = false;
  try {
    const user = await getCurrentUser();
    pro = isPro((user as { plan?: string } | null)?.plan ?? "FREE");
  } catch {
    pro = false;
  }

  const res = new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${t.bg1}, ${t.bg2})`,
          color: t.text,
          padding: "90px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {card.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.photo}
            width={260}
            height={260}
            style={{ borderRadius: "260px", objectFit: "cover", border: `8px solid ${t.accent}`, marginBottom: "44px" }}
          />
        ) : null}
        <div style={{ display: "flex", fontSize: "42px", fontWeight: 700, letterSpacing: "10px", color: t.accent }}>
          HAPPY BIRTHDAY
        </div>
        <div style={{ display: "flex", fontSize: "128px", fontWeight: 800, lineHeight: 1.05, margin: "14px 0 34px", maxWidth: "1000px" }}>
          {card.to}
        </div>
        <div style={{ display: "flex", fontSize: "46px", lineHeight: 1.5, maxWidth: "920px", opacity: 0.96 }}>
          {card.message}
        </div>
        {card.from ? (
          <div style={{ display: "flex", fontSize: "40px", marginTop: "44px", fontWeight: 600 }}>— {card.from}</div>
        ) : null}
        {!pro ? (
          <div style={{ position: "absolute", bottom: "40px", display: "flex", fontSize: "26px", opacity: 0.7 }}>
            ohotool.com/tools/birthday-card-maker
          </div>
        ) : null}
      </div>
    ),
    { width: 1200, height: 1500 },
  );

  const safeName = (card.to || "card").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  res.headers.set("Content-Disposition", `attachment; filename="birthday-card-${safeName}.png"`);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
