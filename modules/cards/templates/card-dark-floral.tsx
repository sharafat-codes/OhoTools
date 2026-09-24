"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

// A bloom built from three rings of petals, each ring rotated off the last so
// the petals interleave the way they do on a garden rose.
const RINGS = [
  { count: 8, rx: 15, ry: 26, dist: 30, off: 0, fill: "var(--bloom1)", op: 0.94 },
  { count: 7, rx: 12, ry: 20, dist: 19, off: 26, fill: "var(--bloom2)", op: 0.97 },
  { count: 6, rx: 9, ry: 13, dist: 9, off: 12, fill: "var(--bloom3)", op: 1 },
];

const LEAVES = [
  { x: 24, y: 96, r: -52 }, { x: 118, y: 24, r: 38 },
  { x: 116, y: 116, r: 24 }, { x: 28, y: 22, r: -28 },
];

function Bloom({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 140 140" aria-hidden="true">
      {LEAVES.map((l, i) => (
        <ellipse key={i} cx={l.x} cy={l.y} rx="9" ry="21" fill="var(--leaf)"
          transform={`rotate(${l.r} ${l.x} ${l.y})`} opacity=".85" />
      ))}
      {RINGS.map((ring, ri) =>
        Array.from({ length: ring.count }, (_, i) => {
          const a = ring.off + (360 / ring.count) * i;
          const rad = (a * Math.PI) / 180;
          // Rounded: raw trig gives values like 6.12e-17, and the server and
          // client do not always serialise those identically, which shows up
          // as a hydration mismatch on every petal.
          const cx = Math.round((70 + Math.cos(rad) * ring.dist) * 100) / 100;
          const cy = Math.round((70 + Math.sin(rad) * ring.dist) * 100) / 100;
          return (
            <ellipse
              key={`${ri}-${i}`}
              cx={cx}
              cy={cy}
              rx={ring.rx}
              ry={ring.ry}
              fill={ring.fill}
              opacity={ring.op}
              // A hair of darker edge is what separates overlapping petals; flat
              // fills alone read as one blob at card size.
              stroke="rgba(20,8,14,.45)"
              strokeWidth="0.8"
              transform={`rotate(${a + 90} ${cx} ${cy})`}
            />
          );
        }),
      )}
      <circle cx="70" cy="70" r="5" fill="var(--pollen)" />
    </svg>
  );
}

/**
 * Midnight Garden — deep, moody florals on near-black.
 *
 * The wedding set had one floral design and it was ivory and daylit
 * (Botanical). This is its opposite: the same subject in the dark palette that
 * most of the current stationery market actually uses.
 */
export function CardDarkFloral({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const gold = data.custom ? t.accent : "#d9b96c";

  return (
    <div
      className="df-stage"
      style={
        {
          "--gold": gold,
          "--bloom1": "#7d2340",
          "--bloom2": "#a33a54",
          "--bloom3": "#c86b7d",
          "--leaf": "#1f4034",
          "--pollen": "#e9c46a",
        } as React.CSSProperties
      }
    >
      <style>{CSS}</style>

      <Bloom className="df-bloom df-b1" />
      <Bloom className="df-bloom df-b2" style={{ "--bloom1": "#5d2a46", "--bloom2": "#8a3f5c" } as React.CSSProperties} />
      <Bloom className="df-bloom df-b3" />
      <Bloom className="df-bloom df-b4" style={{ "--bloom1": "#5d2a46", "--bloom2": "#8a3f5c" } as React.CSSProperties} />

      <div className="df-frame" />
      <Confetti colors={[gold, "#c86b7d", "#ffffff"]} fireKey={fireKey} effect={data.effect} />

      <div className="df-content">
        {data.photo && <img src={data.photo} alt="" className="df-photo" />}
        <div className="df-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="df-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="df-rule"><span className="df-dot" /></div>
        <p className="df-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="df-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.df-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#f4ece2;
  background:
    radial-gradient(circle at 12% 8%, rgba(125,35,64,.42), transparent 42%),
    radial-gradient(circle at 88% 92%, rgba(31,64,52,.5), transparent 44%),
    linear-gradient(165deg,#12100f 0%,#0a0c0b 55%,#140f12 100%);}
.df-bloom{position:absolute; width:clamp(104px,30cqw,190px); height:auto; animation:df-open 1.1s both;}
.df-b1{left:-9%; top:-8%; rotate:-14deg;}
.df-b2{right:-11%; top:4%; rotate:22deg; width:clamp(78px,22cqw,142px); animation-delay:.1s;}
.df-b3{right:-8%; bottom:-9%; rotate:12deg; animation-delay:.05s;}
.df-b4{left:-10%; bottom:2%; rotate:-24deg; width:clamp(72px,20cqw,132px); animation-delay:.15s;}
@keyframes df-open{from{opacity:0; transform:scale(.82)}to{opacity:1; transform:none}}
.df-frame{position:absolute; inset:20px; border:1px solid color-mix(in srgb, var(--gold) 42%, transparent); pointer-events:none; z-index:3;}
.df-content{position:relative; z-index:10; padding:40px 34px; max-width:80%; overflow-wrap:break-word;}
.df-photo{display:block; margin:0 auto .9em; width:clamp(84px,21cqw,118px); height:clamp(84px,21cqw,118px); border-radius:50%; object-fit:cover;
  border:2px solid var(--gold); box-shadow:0 0 0 5px rgba(0,0,0,.35), 0 14px 38px rgba(0,0,0,.6); animation:df-in 1s .15s both;}
.df-eyebrow{font-size:clamp(.72rem,2.4cqw,.95rem); letter-spacing:.36em; text-transform:uppercase; color:var(--gold); font-weight:500;
  padding-left:.36em; animation:df-in .9s .3s both;}
.df-name{margin:.26em 0 .1em; font-family:Georgia,'Times New Roman',serif; font-weight:400; font-size:clamp(2.1rem,8.6cqw,4.1rem); line-height:1.14;
  text-shadow:0 6px 26px rgba(0,0,0,.7); animation:df-rise .9s .45s both;}
.df-rule{display:flex; align-items:center; justify-content:center; gap:10px; margin:.5em auto 1em; animation:df-in 1s .62s both;}
.df-rule::before,.df-rule::after{content:""; height:1px; width:50px; background:linear-gradient(90deg, transparent, var(--gold));}
.df-rule::after{background:linear-gradient(90deg, var(--gold), transparent);}
.df-dot{width:5px; height:5px; rotate:45deg; background:var(--gold);}
.df-msg{font-family:Georgia,'Times New Roman',serif; font-size:clamp(.92rem,3cqw,1.18rem); line-height:1.78; opacity:.88; max-width:31ch; margin:0 auto;
  animation:df-in 1s .76s both; text-wrap:balance;}
.df-from{margin-top:1.3em; font-size:clamp(.76rem,2.5cqw,.98rem); letter-spacing:.24em; text-transform:uppercase; color:var(--gold);
  padding-left:.24em; animation:df-in 1s .9s both;}
@keyframes df-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes df-rise{from{opacity:0; transform:translateY(22px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.df-bloom,.df-photo,.df-eyebrow,.df-name,.df-rule,.df-msg,.df-from{animation:none !important}}
`;
