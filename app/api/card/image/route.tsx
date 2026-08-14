import { ImageResponse } from "next/og";

import { decodeCard } from "@/modules/cards/share";
import { resolveTheme, DEFAULT_CARD, OCCASIONS, type CardData } from "@/modules/cards/types";
import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";

export const runtime = "nodejs";

function decoEmoji(effect: CardData["effect"]): string[] {
  if (effect === "hearts") return ["💖", "💕", "💝", "❤️"];
  if (effect === "stars") return ["⭐", "✨", "🌟", "💫"];
  return ["🎈", "🎉", "🎊", "🎁"];
}

// Renders a decorated still PNG of a card for download (Pro). Same ImageResponse
// engine as /og. Free downloads carry a small watermark; Pro don't.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const card = decodeCard(searchParams.get("d")) ?? DEFAULT_CARD;
  const t = resolveTheme(card);
  const deco = decoEmoji(card.effect);

  let pro = false;
  try {
    const user = await getCurrentUser();
    pro = isPro((user as { plan?: string } | null)?.plan ?? "FREE");
  } catch {
    pro = false;
  }

  // Small confetti squares scattered around the card.
  const confetti = [
    { top: 210, left: 150, c: t.accent, r: -20 },
    { top: 320, left: 1010, c: "#ffffff", r: 25 },
    { top: 1120, left: 190, c: "#ffffff", r: 15 },
    { top: 1230, left: 980, c: t.accent, r: -12 },
    { top: 640, left: 90, c: t.accent, r: 8 },
    { top: 760, left: 1090, c: "#ffffff", r: -18 },
  ];

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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* soft depth circles */}
        <div style={{ position: "absolute", top: -160, left: -140, width: 520, height: 520, borderRadius: 520, background: t.accent, opacity: 0.16, display: "flex" }} />
        <div style={{ position: "absolute", bottom: -180, right: -160, width: 560, height: 560, borderRadius: 560, background: "#ffffff", opacity: 0.1, display: "flex" }} />

        {/* corner emoji */}
        <div style={{ position: "absolute", top: 60, left: 70, fontSize: 104, transform: "rotate(-15deg)", display: "flex" }}>{deco[0]}</div>
        <div style={{ position: "absolute", top: 72, right: 80, fontSize: 96, transform: "rotate(14deg)", display: "flex" }}>{deco[1]}</div>
        <div style={{ position: "absolute", bottom: 96, left: 96, fontSize: 92, transform: "rotate(10deg)", display: "flex" }}>{deco[2]}</div>
        <div style={{ position: "absolute", bottom: 80, right: 92, fontSize: 92, transform: "rotate(-8deg)", display: "flex" }}>{deco[3]}</div>

        {/* confetti squares */}
        {confetti.map((c, i) => (
          <div key={i} style={{ position: "absolute", top: c.top, left: c.left, width: 26, height: 16, background: c.c, opacity: 0.85, transform: `rotate(${c.r}deg)`, borderRadius: 3, display: "flex" }} />
        ))}

        {/* content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "90px", zIndex: 10 }}>
          {card.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.photo} width={280} height={280} style={{ borderRadius: 280, objectFit: "cover", border: `10px solid ${t.accent}`, marginBottom: 48 }} />
          ) : null}
          <div style={{ display: "flex", fontSize: 42, fontWeight: 700, letterSpacing: 12, color: t.accent }}>{OCCASIONS[card.occasion].eyebrow.toUpperCase()}</div>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 800, lineHeight: 1.05, margin: "14px 0 34px", maxWidth: 1000 }}>{card.to}</div>
          <div style={{ display: "flex", fontSize: 46, lineHeight: 1.5, maxWidth: 900, opacity: 0.96 }}>{card.message}</div>
          {card.from ? <div style={{ display: "flex", fontSize: 40, marginTop: 44, fontWeight: 600 }}>— {card.from}</div> : null}
        </div>

        {!pro ? (
          <div style={{ position: "absolute", bottom: 40, display: "flex", fontSize: 26, opacity: 0.7 }}>ohotool.com/tools/birthday-card-maker</div>
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
