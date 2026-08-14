"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

const SPARKLES = [
  { left: "14%", top: "20%", delay: "0s" },
  { left: "84%", top: "24%", delay: "1.2s" },
  { left: "22%", top: "74%", delay: "0.7s" },
  { left: "78%", top: "70%", delay: "1.7s" },
  { left: "50%", top: "14%", delay: "0.4s" },
  { left: "40%", top: "84%", delay: "2.1s" },
];

export function BirthdayLuxe({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const gold = data.custom ? t.accent : "#e7c873";
  return (
    <div className="bl-stage" style={{ "--gold": gold } as React.CSSProperties}>
      <style>{CSS}</style>
      <div className="bl-frame" />
      <div className="bl-frame bl-frame2" />
      {SPARKLES.map((s, i) => (
        <span key={i} className="bl-sparkle" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
      ))}
      <Confetti colors={[gold, "#fff7e0", "#c9a227"]} fireKey={fireKey} effect={data.effect} />

      <div className="bl-content">
        {data.photo && <img src={data.photo} alt="" className="bl-photo" />}
        <div className="bl-eyebrow">✦ {occ.eyebrow} ✦</div>
        <h1 className="bl-name">{data.to}</h1>
        <div className="bl-rule" />
        <p className="bl-msg">{data.message}</p>
        {data.from.trim() && <div className="bl-from">— {data.from}</div>}
      </div>
    </div>
  );
}

const CSS = `
.bl-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#f6efdf;
  background:radial-gradient(circle at 50% 30%, #1a160d 0%, #0a0a0c 70%);}
.bl-frame{position:absolute; inset:18px; border:1.5px solid color-mix(in srgb, var(--gold) 55%, transparent); border-radius:14px; pointer-events:none;}
.bl-frame2{inset:26px; border-color:color-mix(in srgb, var(--gold) 30%, transparent);}
.bl-sparkle{position:absolute; width:7px; height:7px; border-radius:50%; background:var(--gold); box-shadow:0 0 12px var(--gold); animation:bl-tw 3s ease-in-out infinite;}
@keyframes bl-tw{0%,100%{opacity:0; transform:scale(.3)}50%{opacity:1; transform:scale(1.3)}}
.bl-content{position:relative; z-index:10; padding:40px; max-width:88%; overflow-wrap:break-word;}
.bl-photo{display:block; margin:0 auto 1em; width:clamp(96px,24cqw,132px); height:clamp(96px,24cqw,132px); border-radius:50%; object-fit:cover;
  border:2px solid var(--gold); box-shadow:0 0 0 6px color-mix(in srgb, var(--gold) 18%, transparent), 0 12px 40px rgba(0,0,0,.6); animation:bl-in 1s .1s both;}
.bl-eyebrow{font-size:clamp(.8rem,2.6cqw,1.05rem); letter-spacing:.3em; text-transform:uppercase; color:var(--gold); font-weight:600; animation:bl-in .9s .2s both;}
.bl-name{margin:.2em 0; font-family:Georgia,'Times New Roman',serif; font-weight:700; font-size:clamp(2.8rem,11cqw,5.6rem); line-height:1.05;
  background:linear-gradient(100deg, #b8860b, #fff3cf 45%, var(--gold) 55%, #b8860b);
  background-size:220% auto; -webkit-background-clip:text; background-clip:text; color:transparent;
  animation:bl-rise .9s .35s both, bl-foil 5s linear 1s infinite;}
@keyframes bl-foil{to{background-position:220% center}}
.bl-rule{width:80px; height:1.5px; margin:.5em auto 1em; background:linear-gradient(90deg, transparent, var(--gold), transparent); animation:bl-in 1s .55s both;}
.bl-msg{font-size:clamp(1rem,3.2cqw,1.3rem); line-height:1.7; opacity:.9; max-width:34ch; margin:0 auto; font-style:italic; animation:bl-in 1s .7s both; text-wrap:balance;}
.bl-from{margin-top:1.3em; font-size:clamp(.9rem,2.8cqw,1.1rem); letter-spacing:.12em; color:var(--gold); animation:bl-in 1s .85s both;}
@keyframes bl-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes bl-rise{from{opacity:0; transform:translateY(24px) scale(.97)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.bl-sparkle,.bl-photo,.bl-eyebrow,.bl-name,.bl-rule,.bl-msg,.bl-from{animation:none !important} .bl-name{color:var(--gold); -webkit-text-fill-color:var(--gold)}}
`;
