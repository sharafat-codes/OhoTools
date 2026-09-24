"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

// Veins drawn rather than generated: a noise filter would be at the mercy of
// each browser's feTurbulence, and these need to look the same in the exported
// image as on screen.
const VEINS = [
  // A few dominant diagonals with hairline companions and short branches.
  // Evenly spaced sweeps of uniform weight read as line art, not stone.
  { d: "M-10 44 C 52 74, 72 30, 122 66 C 162 94, 192 62, 266 100", w: 1.3, o: 0.3 },
  { d: "M-10 54 C 56 82, 78 44, 126 76 C 164 100, 196 74, 266 108", w: 0.5, o: 0.16 },
  { d: "M122 66 C 134 86, 152 80, 166 98", w: 0.6, o: 0.2 },
  { d: "M70 52 C 78 68, 92 62, 104 74", w: 0.5, o: 0.16 },
  { d: "M-10 192 C 42 212, 80 174, 130 200 C 180 226, 212 192, 266 216", w: 1.2, o: 0.26 },
  { d: "M130 200 C 142 216, 158 208, 174 222", w: 0.55, o: 0.18 },
  { d: "M-10 202 C 46 222, 86 186, 134 210", w: 0.45, o: 0.13 },
  { d: "M32 -10 C 46 62, 22 112, 42 172 C 58 222, 36 252, 48 286", w: 0.9, o: 0.2 },
  { d: "M222 -10 C 206 52, 232 102, 214 152 C 198 202, 220 242, 208 286", w: 1.0, o: 0.22 },
  { d: "M-10 122 C 62 102, 112 142, 172 120 C 212 106, 242 130, 266 118", w: 0.6, o: 0.15 },
];

function Veining() {
  return (
    <svg className="mb-veins" viewBox="0 0 256 276" preserveAspectRatio="none" aria-hidden="true">
      {VEINS.map((v, i) => (
        <path key={i} d={v.d} fill="none" stroke="#7e766a" strokeWidth={v.w} strokeOpacity={v.o} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/**
 * Marble — white stone and gold leaf.
 *
 * The light designs in the set are paper (Botanical, Editorial, Polaroid).
 * This is the formal one: heavier, colder, and the only light card that can
 * carry gold without looking like a birthday.
 */
export function CardMarble({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const gold = data.custom ? t.accent : "#b08d4f";

  return (
    <div className="mb-stage" style={{ "--gold": gold } as React.CSSProperties}>
      <style>{CSS}</style>

      <Veining />
      <div className="mb-frame" />
      <div className="mb-frame mb-frame2" />
      <Confetti colors={[gold, "#e6ded2", "#ffffff"]} fireKey={fireKey} effect={data.effect} />

      <div className="mb-content">
        {data.photo && <img src={data.photo} alt="" className="mb-photo" />}
        <div className="mb-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="mb-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="mb-rule"><span className="mb-dot" /></div>
        <p className="mb-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="mb-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.mb-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#2e2b26;
  background:
    radial-gradient(ellipse at 22% 18%, rgba(255,255,255,.95), transparent 46%),
    radial-gradient(ellipse at 80% 78%, rgba(226,220,209,.85), transparent 48%),
    radial-gradient(ellipse at 62% 30%, rgba(150,143,131,.18), transparent 38%),
    radial-gradient(ellipse at 24% 70%, rgba(150,143,131,.16), transparent 40%),
    linear-gradient(150deg,#fbfaf7 0%,#f1eee7 48%,#e6e1d7 100%);}
.mb-veins{position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:1;}
.mb-frame{position:absolute; inset:18px; border:1.5px solid color-mix(in srgb, var(--gold) 62%, transparent); pointer-events:none; z-index:3;}
.mb-frame2{inset:25px; border-width:1px; border-color:color-mix(in srgb, var(--gold) 26%, transparent);}
.mb-content{position:relative; z-index:10; padding:44px 36px; max-width:84%; overflow-wrap:break-word;}
.mb-photo{display:block; margin:0 auto 1em; width:clamp(84px,21cqw,118px); height:clamp(84px,21cqw,118px); border-radius:50%; object-fit:cover;
  border:1.5px solid var(--gold); box-shadow:0 0 0 6px rgba(255,255,255,.75), 0 12px 30px rgba(70,64,54,.22); animation:mb-in 1s .1s both;}
.mb-eyebrow{font-size:clamp(.7rem,2.35cqw,.9rem); letter-spacing:.4em; text-transform:uppercase; color:var(--gold); font-weight:600;
  padding-left:.4em; animation:mb-in .9s .22s both;}
.mb-name{margin:.3em 0 .1em; font-family:Georgia,'Times New Roman',serif; font-weight:400; font-size:clamp(2.1rem,8.8cqw,4.2rem); line-height:1.12;
  background:linear-gradient(100deg,#8a6b33,#e2c98d 46%,var(--gold) 58%,#8a6b33); background-size:220% auto;
  -webkit-background-clip:text; background-clip:text; color:transparent;
  animation:mb-rise .9s .38s both, mb-foil 6s linear 1.1s infinite;}
@keyframes mb-foil{to{background-position:220% center}}
.mb-rule{display:flex; align-items:center; justify-content:center; gap:11px; margin:.55em auto 1.05em; animation:mb-in 1s .58s both;}
.mb-rule::before,.mb-rule::after{content:""; height:1px; width:54px; background:linear-gradient(90deg, transparent, var(--gold));}
.mb-rule::after{background:linear-gradient(90deg, var(--gold), transparent);}
.mb-dot{width:5px; height:5px; rotate:45deg; background:var(--gold);}
.mb-msg{font-family:Georgia,'Times New Roman',serif; font-size:clamp(.92rem,3cqw,1.18rem); line-height:1.8; color:#4a453c; max-width:32ch; margin:0 auto;
  animation:mb-in 1s .74s both; text-wrap:balance;}
.mb-from{margin-top:1.35em; font-size:clamp(.74rem,2.45cqw,.95rem); letter-spacing:.26em; text-transform:uppercase; color:var(--gold);
  padding-left:.26em; animation:mb-in 1s .88s both;}
@keyframes mb-in{from{opacity:0; transform:translateY(13px)}to{opacity:1; transform:none}}
@keyframes mb-rise{from{opacity:0; transform:translateY(20px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.mb-photo,.mb-eyebrow,.mb-name,.mb-rule,.mb-msg,.mb-from{animation:none !important}
  .mb-name{color:var(--gold); -webkit-text-fill-color:var(--gold)}}
`;
