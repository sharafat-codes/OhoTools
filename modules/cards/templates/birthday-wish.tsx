"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

const CANDLES = [74, 100, 126];
const SPRINKLES = [
  { x: 46, y: 122, r: -20 }, { x: 68, y: 134, r: 30 }, { x: 92, y: 124, r: -40 },
  { x: 116, y: 136, r: 15 }, { x: 140, y: 122, r: -25 }, { x: 80, y: 146, r: 45 },
  { x: 122, y: 146, r: -10 }, { x: 70, y: 88, r: 25 }, { x: 100, y: 94, r: -30 },
  { x: 128, y: 88, r: 10 },
];
const SPRINKLE_COLORS = ["#ef476f", "#06d6a0", "#ffd166", "#4cc9f0", "#f78c6b"];

// Soft out-of-focus lights, fixed rather than random so the server and client
// markup match.
const BOKEH = [
  { left: "12%", top: "18%", size: 46, delay: "0s" },
  { left: "78%", top: "14%", size: 62, delay: "1.4s" },
  { left: "86%", top: "52%", size: 38, delay: "2.6s" },
  { left: "8%", top: "58%", size: 54, delay: "0.8s" },
  { left: "40%", top: "8%", size: 34, delay: "2s" },
];

function Cake() {
  return (
    <svg className="wi-cake" viewBox="0 0 200 172" aria-hidden="true">
      {/* candles and flames */}
      {CANDLES.map((x, i) => (
        <g key={x}>
          <rect x={x - 2.5} y="38" width="5" height="30" rx="1.5" fill="#fdf1e0" />
          <rect x={x - 2.5} y="38" width="5" height="30" rx="1.5" fill="#ef476f" opacity=".55"
            style={{ clipPath: "polygon(0 0,100% 0,100% 22%,0 22%)" }} />
          <rect x={x - 0.6} y="30" width="1.2" height="9" fill="#8a6a44" />
          <g className="wi-flame" style={{ animationDelay: `${i * 0.23}s`, transformOrigin: `${x}px 32px` }}>
            <ellipse cx={x} cy="24" rx="5" ry="9.5" fill="#ff9d2e" />
            <ellipse cx={x} cy="26" rx="2.4" ry="5.4" fill="#fff3b0" />
          </g>
        </g>
      ))}

      {/* top tier */}
      <rect x="58" y="68" width="84" height="40" rx="5" fill="#c9835a" />
      <path d="M58 72 q7 11 14 0 q7 11 14 0 q7 11 14 0 q7 11 14 0 q7 11 14 0 q7 11 14 0 V68 H58 Z" fill="#fdf1e0" />

      {/* bottom tier */}
      <rect x="32" y="108" width="136" height="48" rx="6" fill="#b9714b" />
      <path d="M32 112 q8.5 12 17 0 q8.5 12 17 0 q8.5 12 17 0 q8.5 12 17 0 q8.5 12 17 0 q8.5 12 17 0 q8.5 12 17 0 q8.5 12 17 0 V108 H32 Z" fill="#fdf1e0" />

      {SPRINKLES.map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width="6" height="2.2" rx="1.1"
          fill={SPRINKLE_COLORS[i % SPRINKLE_COLORS.length]} transform={`rotate(${s.r} ${s.x} ${s.y})`} opacity=".9" />
      ))}

      {/* plate */}
      <ellipse cx="100" cy="158" rx="80" ry="8" fill="#6b4a33" opacity=".85" />
      <ellipse cx="100" cy="156" rx="80" ry="7" fill="#8a6244" />
    </svg>
  );
}

/**
 * Make a Wish — a lit birthday cake in a dark room. Nothing else in the set
 * shows a cake: the two free birthday designs are gradients with balloons and
 * falling emoji, so the one object everybody associates with a birthday was
 * missing entirely.
 */
export function BirthdayWish({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const glow = data.custom ? t.accent : "#ffb84d";

  return (
    <div className="wi-stage" style={{ "--glow": glow } as React.CSSProperties}>
      <style>{CSS}</style>

      {BOKEH.map((b, i) => (
        <span key={i} className="wi-bokeh" style={{ left: b.left, top: b.top, width: b.size, height: b.size, animationDelay: b.delay }} />
      ))}
      <div className="wi-warmth" />
      <Confetti colors={[glow, "#fff3b0", "#ef476f"]} fireKey={fireKey} effect={data.effect} />

      <div className="wi-content">
        {data.photo && <img src={data.photo} alt="" className="wi-photo" />}
        <div className="wi-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="wi-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <p className="wi-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="wi-from"><span style={elemStyle(data, "from")}>— {data.from}</span></div>}
      </div>

      <Cake />
    </div>
  );
}

const CSS = `
.wi-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#fdf3e3;
  background:radial-gradient(ellipse at 50% 88%, #4a2f18 0%, #21150d 45%, #0c0805 100%);}
.wi-warmth{position:absolute; left:50%; bottom:-6%; width:min(90cqw,520px); aspect-ratio:1; translate:-50% 0; pointer-events:none; z-index:1;
  background:radial-gradient(circle, color-mix(in srgb, var(--glow) 40%, transparent) 0%, transparent 62%);
  animation:wi-breathe 4.5s ease-in-out infinite;}
@keyframes wi-breathe{0%,100%{opacity:.75}50%{opacity:1}}
.wi-bokeh{position:absolute; border-radius:50%; background:var(--glow); opacity:.13; filter:blur(9px); animation:wi-float 9s ease-in-out infinite; z-index:1;}
@keyframes wi-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
.wi-content{position:relative; z-index:10; padding:24px 34px min(clamp(182px,52cqw,318px), 44vh); max-width:86%; overflow-wrap:break-word;}
.wi-photo{display:block; margin:0 auto .8em; width:clamp(78px,19cqw,108px); height:clamp(78px,19cqw,108px); border-radius:50%; object-fit:cover;
  border:3px solid color-mix(in srgb, var(--glow) 60%, #fff); box-shadow:0 10px 32px rgba(0,0,0,.6); animation:wi-in 1s .1s both;}
.wi-eyebrow{font-size:clamp(.82rem,2.7cqw,1.05rem); letter-spacing:.3em; text-transform:uppercase; color:var(--glow); font-weight:600;
  padding-left:.3em; animation:wi-in .9s .2s both;}
.wi-name{margin:.2em 0 .18em; font-family:Georgia,'Times New Roman',serif; font-weight:700; font-size:clamp(2.4rem,10cqw,4.8rem); line-height:1.08;
  text-shadow:0 0 30px color-mix(in srgb, var(--glow) 45%, transparent), 0 4px 18px rgba(0,0,0,.5); animation:wi-rise .9s .35s both;}
.wi-msg{font-size:clamp(.95rem,3.1cqw,1.22rem); line-height:1.7; opacity:.9; max-width:32ch; margin:0 auto; animation:wi-in 1s .6s both; text-wrap:balance;}
.wi-from{margin-top:1em; font-family:Georgia,serif; font-style:italic; font-size:clamp(.95rem,3cqw,1.15rem); color:var(--glow); animation:wi-in 1s .78s both;}
.wi-cake{position:absolute; left:50%; bottom:5%; translate:-50% 0; width:min(clamp(210px,58cqw,356px), 50vh); height:auto; z-index:6;
  filter:drop-shadow(0 -6px 26px color-mix(in srgb, var(--glow) 38%, transparent)); animation:wi-rise 1s .85s both;}
.wi-flame{animation:wi-flick 1.5s ease-in-out infinite;}
@keyframes wi-flick{0%,100%{transform:scaleY(1) scaleX(1)}35%{transform:scaleY(1.18) scaleX(.92)}70%{transform:scaleY(.92) scaleX(1.06)}}
@keyframes wi-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes wi-rise{from{opacity:0; transform:translateY(24px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.wi-warmth,.wi-bokeh,.wi-photo,.wi-eyebrow,.wi-name,.wi-msg,.wi-from,.wi-cake,.wi-flame{animation:none !important}
  .wi-cake{translate:-50% 0}}
`;
