"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

// Two swags of bulbs. Each bulb sits on the curve below, so the maths stays in
// one place and the wire and the lamps cannot drift apart.
const SWAGS = [
  { y0: 12, sag: 40, count: 9 },
  { y0: 4, sag: 66, count: 11 },
];

/** Point on a quadratic curve from (0,y0) to (200,y0) dipping by `sag`. */
function onSwag(tt: number, y0: number, sag: number) {
  // Rounded so the markup serialises identically on server and client.
  const r = (v: number) => Math.round(v * 100) / 100;
  return { x: r(tt * 200), y: r(y0 + 4 * sag * tt * (1 - tt)) };
}

function Lights() {
  return (
    <svg className="sl-lights" viewBox="0 0 200 90" preserveAspectRatio="none" aria-hidden="true">
      {SWAGS.map((s, si) => (
        <g key={si}>
          <path
            d={`M0 ${s.y0} Q 100 ${s.y0 + 2 * s.sag} 200 ${s.y0}`}
            fill="none"
            stroke="#4b3b2c"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
          />
          {Array.from({ length: s.count }, (_, i) => {
            const p = onSwag((i + 0.5) / s.count, s.y0, s.sag);
            return (
              <g key={i} className="sl-bulb" style={{ animationDelay: `${((i * 7 + si * 3) % 11) * 0.27}s` }}>
                <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + 4} stroke="#4b3b2c" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
                <circle cx={p.x} cy={p.y + 8} r="4.6" fill="var(--bulb)" />
                <circle cx={p.x} cy={p.y + 8} r="2.1" fill="#fff6dd" />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

/**
 * String Lights — a warm evening reception rather than a printed card.
 *
 * The rest of the wedding set is stationery: paper, foil, frames. This is the
 * venue, which is what a lot of couples are actually selling their guests on.
 */
export function CardStringLights({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const bulb = data.custom ? t.accent : "#ffc861";

  return (
    <div className="sl-stage" style={{ "--bulb": bulb } as React.CSSProperties}>
      <style>{CSS}</style>

      <div className="sl-haze" />
      <Lights />
      <Confetti colors={[bulb, "#fff6dd", "#c08a4a"]} fireKey={fireKey} effect={data.effect} />

      <div className="sl-content">
        {data.photo && <img src={data.photo} alt="" className="sl-photo" />}
        <div className="sl-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="sl-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="sl-rule" />
        <p className="sl-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="sl-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.sl-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#f8eddb;
  background:linear-gradient(170deg,#2e2116 0%,#1a130d 55%,#241a12 100%);}
.sl-haze{position:absolute; left:0; right:0; top:0; height:46%; pointer-events:none; z-index:1;
  background:radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--bulb) 26%, transparent), transparent 68%);}
.sl-lights{position:absolute; left:-2%; right:-2%; top:0; width:104%; height:clamp(90px,26cqw,150px); z-index:4; overflow:visible;}
.sl-bulb{filter:drop-shadow(0 0 5px var(--bulb)); animation:sl-twinkle 3.4s ease-in-out infinite;}
@keyframes sl-twinkle{0%,100%{opacity:1}50%{opacity:.62}}
.sl-content{position:relative; z-index:10; padding:clamp(86px,25cqw,140px) 34px 40px; max-width:84%; overflow-wrap:break-word;}
.sl-photo{display:block; margin:0 auto .85em; width:clamp(80px,20cqw,112px); height:clamp(80px,20cqw,112px); border-radius:50%; object-fit:cover;
  border:3px solid rgba(255,246,221,.85); box-shadow:0 12px 34px rgba(0,0,0,.6); animation:sl-in 1s .15s both;}
.sl-eyebrow{font-size:clamp(.74rem,2.5cqw,.98rem); letter-spacing:.32em; text-transform:uppercase; color:var(--bulb); font-weight:600;
  padding-left:.32em; animation:sl-in .9s .3s both;}
.sl-name{margin:.2em 0 .12em; font-family:'Segoe Script','Brush Script MT',cursive; font-weight:400; font-size:clamp(2.4rem,10.5cqw,5rem); line-height:1.12;
  color:#fff6dd; text-shadow:0 0 34px color-mix(in srgb, var(--bulb) 55%, transparent), 0 4px 16px rgba(0,0,0,.55);
  animation:sl-rise .9s .42s both;}
.sl-rule{width:70px; height:1px; margin:.7em auto 1em; background:linear-gradient(90deg, transparent, var(--bulb), transparent);
  animation:sl-in 1s .6s both;}
.sl-msg{font-size:clamp(.92rem,3cqw,1.18rem); line-height:1.75; opacity:.9; max-width:31ch; margin:0 auto; animation:sl-in 1s .74s both; text-wrap:balance;}
.sl-from{margin-top:1.2em; font-family:'Segoe Script','Brush Script MT',cursive; font-size:clamp(1.05rem,3.6cqw,1.45rem); color:var(--bulb);
  animation:sl-in 1s .88s both;}
@keyframes sl-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes sl-rise{from{opacity:0; transform:translateY(22px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.sl-bulb,.sl-photo,.sl-eyebrow,.sl-name,.sl-rule,.sl-msg,.sl-from{animation:none !important}}
`;
