"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

// Leaves hand-placed along the stem curve below, alternating sides and tapering
// toward the tip. Coordinates are in the sprig's 120×200 viewBox.
const LEAVES: { x: number; y: number; r: number; s: number }[] = [
  { x: 44, y: 172, r: -48, s: 1.0 },
  { x: 72, y: 163, r: 46, s: 0.96 },
  { x: 41, y: 146, r: -44, s: 0.94 },
  { x: 70, y: 136, r: 42, s: 0.9 },
  { x: 40, y: 119, r: -40, s: 0.86 },
  { x: 69, y: 108, r: 38, s: 0.8 },
  { x: 42, y: 92, r: -36, s: 0.74 },
  { x: 69, y: 80, r: 34, s: 0.68 },
  { x: 46, y: 64, r: -32, s: 0.6 },
  { x: 68, y: 52, r: 30, s: 0.52 },
  { x: 52, y: 38, r: -26, s: 0.44 },
];

function Sprig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 200" aria-hidden="true">
      <path d="M60 198 C 44 156 40 100 58 26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {LEAVES.map((l, i) => (
        <ellipse
          key={i}
          cx={l.x}
          cy={l.y}
          rx={8.5 * l.s}
          ry={17 * l.s}
          transform={`rotate(${l.r} ${l.x} ${l.y})`}
          fill="currentColor"
          opacity={0.55}
        />
      ))}
      <circle cx="58" cy="26" r="3.4" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/**
 * Botanical — ivory stationery with pressed-leaf sprigs. The light palette is
 * the point: every other template is a dark gradient, so this is the one that
 * reads as printed paper rather than a screen.
 */
export function CardBotanical({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  // Only the accent follows a custom palette — a dark custom background would
  // make the ink on this card unreadable.
  const sage = data.custom ? t.accent : "#7f9873";
  return (
    <div className="bt-stage" style={{ "--sage": sage } as React.CSSProperties}>
      <style>{CSS}</style>

      <Sprig className="bt-sprig bt-sprig-tl" />
      <Sprig className="bt-sprig bt-sprig-br" />
      <div className="bt-frame" />
      <Confetti colors={[sage, "#d8c3a5", "#ffffff"]} fireKey={fireKey} effect={data.effect} />

      <div className="bt-content">
        {data.photo && <img src={data.photo} alt="" className="bt-photo" />}
        <div className="bt-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="bt-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="bt-rule"><span className="bt-leaf">❧</span></div>
        <p className="bt-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="bt-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.bt-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#3b4438;
  background:linear-gradient(168deg,#fdfbf7 0%,#f6f3ea 45%,#eaeee3 100%);}
.bt-sprig{position:absolute; color:var(--sage); width:clamp(78px,22cqw,132px); height:auto; opacity:.7; transform-origin:50% 100%;
  animation:bt-sway 7s ease-in-out infinite;}
.bt-sprig-tl{left:-7%; top:-15%; transform:rotate(168deg);}
.bt-sprig-br{right:-7%; bottom:-15%; transform:rotate(-12deg);}
@keyframes bt-sway{0%,100%{rotate:0deg}50%{rotate:2.5deg}}
.bt-frame{position:absolute; inset:22px; border:1px solid color-mix(in srgb, var(--sage) 45%, transparent); border-radius:4px; pointer-events:none; z-index:2;}
.bt-content{position:relative; z-index:10; padding:40px; max-width:84%; overflow-wrap:break-word;}
.bt-photo{display:block; margin:0 auto 1em; width:clamp(90px,23cqw,128px); height:clamp(90px,23cqw,128px); border-radius:50%; object-fit:cover;
  border:4px solid #fff; box-shadow:0 6px 22px rgba(60,70,55,.22); animation:bt-in 1s .1s both;}
.bt-eyebrow{font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:clamp(.95rem,3.2cqw,1.35rem); color:var(--sage); animation:bt-in .9s .2s both;}
.bt-name{margin:.12em 0 .06em; font-family:Georgia,'Times New Roman',serif; font-weight:400; font-size:clamp(2.2rem,9.5cqw,4.4rem); line-height:1.12;
  letter-spacing:.005em; animation:bt-rise .9s .35s both;}
.bt-rule{display:flex; align-items:center; justify-content:center; gap:12px; margin:.45em auto 1em; animation:bt-in 1s .55s both;}
.bt-rule::before,.bt-rule::after{content:""; height:1px; width:52px; background:linear-gradient(90deg, transparent, var(--sage));}
.bt-rule::after{background:linear-gradient(90deg, var(--sage), transparent);}
.bt-leaf{color:var(--sage); font-size:17px; line-height:1;}
.bt-msg{font-family:Georgia,'Times New Roman',serif; font-size:clamp(.95rem,3.1cqw,1.2rem); line-height:1.75; color:#4c5548; max-width:33ch; margin:0 auto;
  animation:bt-in 1s .7s both; text-wrap:balance;}
.bt-from{margin-top:1.3em; font-family:Georgia,serif; font-style:italic; font-size:clamp(.95rem,3.2cqw,1.25rem); color:var(--sage); animation:bt-in 1s .85s both;}
@keyframes bt-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes bt-rise{from{opacity:0; transform:translateY(22px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.bt-sprig,.bt-photo,.bt-eyebrow,.bt-name,.bt-rule,.bt-msg,.bt-from{animation:none !important}}
`;
