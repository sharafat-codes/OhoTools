"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

const STARBURSTS = [
  { left: "9%", top: "16%", size: 30, delay: "0s" },
  { left: "84%", top: "12%", size: 22, delay: ".7s" },
  { left: "88%", top: "72%", size: 34, delay: "1.4s" },
  { left: "7%", top: "76%", size: 25, delay: "2.1s" },
];

/**
 * Retro Pop — halftone, a rotating sunburst and hard-offset display type.
 *
 * Distinct from Neon Glow, which is a dark card lit from within; this one is
 * printed poster ink on butter paper, and it is the loudest design in the set.
 */
export function BirthdayRetro({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const pop = data.custom ? t.accent : "#e63946";
  const pop2 = data.custom ? t.bg2 : "#118ab2";

  return (
    <div className="rt-stage" style={{ "--pop": pop, "--pop2": pop2 } as React.CSSProperties}>
      <style>{CSS}</style>

      <div className="rt-sunburst" />
      <div className="rt-halftone" />
      {STARBURSTS.map((s, i) => (
        <span key={i} className="rt-star" style={{ left: s.left, top: s.top, fontSize: s.size, animationDelay: s.delay }}>✦</span>
      ))}
      <Confetti colors={[pop, pop2, "#ffd166"]} fireKey={fireKey} effect={data.effect} />

      <div className="rt-content">
        {data.photo && <img src={data.photo} alt="" className="rt-photo" />}
        <div className="rt-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="rt-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <p className="rt-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="rt-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.rt-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#1e2a32;
  background:linear-gradient(170deg,#fdf6e3 0%,#f7e9c9 100%);}
.rt-sunburst{position:absolute; left:50%; top:46%; width:min(190cqw,1100px); aspect-ratio:1; translate:-50% -50%; border-radius:50%; opacity:.14;
  background:repeating-conic-gradient(from 0deg, var(--pop) 0deg 9deg, transparent 9deg 18deg);
  animation:rt-spin 70s linear infinite;}
@keyframes rt-spin{to{rotate:360deg}}
.rt-halftone{position:absolute; inset:0; pointer-events:none; opacity:.3;
  background-image:radial-gradient(color-mix(in srgb, var(--pop2) 55%, transparent) 1.4px, transparent 1.5px); background-size:11px 11px;}
.rt-star{position:absolute; color:var(--pop2); animation:rt-pulse 3s ease-in-out infinite; z-index:2;}
@keyframes rt-pulse{0%,100%{opacity:.35; transform:scale(.8) rotate(0deg)}50%{opacity:1; transform:scale(1.15) rotate(25deg)}}
.rt-content{position:relative; z-index:10; padding:30px; max-width:88%; overflow-wrap:break-word;}
/* Soft cream halo so the message is not read straight off the sunburst rays. */
.rt-content::before{content:""; position:absolute; inset:-6% -10%; z-index:-1; pointer-events:none;
  background:radial-gradient(ellipse at 50% 50%, rgba(253,246,227,.92) 0%, rgba(253,246,227,.72) 45%, transparent 72%);}
.rt-photo{display:block; margin:0 auto .7em; width:clamp(86px,22cqw,120px); height:clamp(86px,22cqw,120px); border-radius:50%; object-fit:cover;
  border:5px solid #fdf6e3; box-shadow:6px 6px 0 var(--pop2), 0 12px 28px rgba(30,42,50,.25); animation:rt-pop .7s .1s both;}
.rt-eyebrow{display:inline-block; font-size:clamp(.8rem,2.8cqw,1.05rem); font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:#fdf6e3;
  background:var(--pop2); padding:.34em .95em; rotate:-2deg; box-shadow:3px 3px 0 rgba(30,42,50,.85); animation:rt-pop .7s .22s both;}
.rt-name{margin:.26em 0 .3em; font-family:'Trebuchet MS','Segoe UI',system-ui,sans-serif; font-weight:900; font-style:italic; letter-spacing:-.025em;
  line-height:.98; font-size:clamp(2.8rem,13cqw,6rem); color:var(--pop); text-shadow:5px 5px 0 #1e2a32; animation:rt-pop .8s .38s both;}
.rt-msg{font-size:clamp(.98rem,3.3cqw,1.28rem); line-height:1.6; font-weight:600; color:#2c3a44; max-width:30ch; margin:0 auto;
  animation:rt-in .8s .6s both; text-wrap:balance;}
.rt-from{display:inline-block; margin-top:1.15em; font-size:clamp(.92rem,3cqw,1.15rem); font-weight:800; color:#fdf6e3; background:var(--pop);
  padding:.3em .9em; rotate:1.5deg; box-shadow:3px 3px 0 rgba(30,42,50,.85); animation:rt-in .8s .78s both;}
@keyframes rt-pop{0%{opacity:0; transform:scale(.55)}72%{opacity:1; transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes rt-in{from{opacity:0; transform:translateY(16px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.rt-sunburst,.rt-star,.rt-photo,.rt-eyebrow,.rt-name,.rt-msg,.rt-from{animation:none !important}}
`;
