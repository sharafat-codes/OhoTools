"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

const HEARTS = [
  { left: "10%", delay: "0s", dur: "10s", size: 20 },
  { left: "26%", delay: "2s", dur: "12s", size: 14 },
  { left: "44%", delay: "1s", dur: "11s", size: 24 },
  { left: "63%", delay: "3s", dur: "13s", size: 16 },
  { left: "80%", delay: "0.6s", dur: "10.5s", size: 22 },
  { left: "91%", delay: "2.4s", dur: "12.5s", size: 15 },
];

export function CardRomantic({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  return (
    <div className="br-stage" style={{ "--bg1": t.bg1, "--bg2": t.bg2, "--accent": t.accent, "--text": t.text } as React.CSSProperties}>
      <style>{CSS}</style>
      <div className="br-vignette" />
      {HEARTS.map((h, i) => (
        <span key={i} className="br-heart" style={{ left: h.left, animationDelay: h.delay, animationDuration: h.dur, fontSize: h.size }}>
          ♥
        </span>
      ))}
      <Confetti colors={[t.accent, "#ffffff", t.bg2]} fireKey={fireKey} effect={data.effect} />

      <div className="br-frame" />
      <div className="br-content">
        {data.photo && <img src={data.photo} alt="" className="br-photo" />}
        <div className="br-eyebrow">{occ.eyebrow}</div>
        <h1 className="br-name">{data.to}</h1>
        <div className="br-rule"><span className="br-diamond">♥</span></div>
        <p className="br-msg">{data.message}</p>
        {data.from.trim() && <div className="br-from">{data.from}</div>}
      </div>
    </div>
  );
}

const CSS = `
.br-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:var(--text);
  background:linear-gradient(160deg, var(--bg1), var(--bg2));}
.br-vignette{position:absolute; inset:0; background:radial-gradient(circle at 50% 42%, transparent 40%, rgba(0,0,0,.28)); pointer-events:none;}
.br-heart{position:absolute; bottom:-10%; color:#ffffff; opacity:.55; animation-name:br-rise; animation-timing-function:linear; animation-iteration-count:infinite; z-index:1;}
@keyframes br-rise{0%{bottom:-10%; opacity:0}12%{opacity:.55}100%{bottom:115%; opacity:0}}
.br-frame{position:absolute; inset:24px; border:1px solid color-mix(in srgb, var(--accent) 55%, transparent); border-radius:10px; pointer-events:none; z-index:2;}
.br-content{position:relative; z-index:10; padding:36px; max-width:88%; overflow-wrap:break-word;}
.br-photo{display:block; margin:0 auto 1em; width:clamp(90px,24cqw,130px); height:clamp(90px,24cqw,130px); border-radius:50%; object-fit:cover;
  border:3px solid #fff; box-shadow:0 8px 30px rgba(0,0,0,.35); animation:br-in 1s .1s both;}
.br-eyebrow{font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:clamp(1.1rem,4cqw,1.7rem); color:#fff; opacity:.95; animation:br-in .9s .2s both;}
.br-name{margin:.15em 0 .1em; font-family:Georgia,'Times New Roman',serif; font-weight:700; font-size:clamp(2.4rem,10cqw,4.8rem); line-height:1.1;
  text-shadow:0 4px 24px rgba(0,0,0,.3); animation:br-rise-in .9s .35s both;}
.br-rule{display:flex; align-items:center; justify-content:center; gap:10px; margin:.5em auto 1em; animation:br-in 1s .55s both;}
.br-rule::before,.br-rule::after{content:""; height:1px; width:46px; background:linear-gradient(90deg, transparent, var(--accent));}
.br-rule::after{background:linear-gradient(90deg, var(--accent), transparent);}
.br-diamond{color:var(--accent); font-size:14px;}
.br-msg{font-size:clamp(1rem,3.3cqw,1.3rem); line-height:1.7; opacity:.95; max-width:32ch; margin:0 auto; animation:br-in 1s .7s both; text-wrap:balance;}
.br-from{margin-top:1.3em; font-family:Georgia,serif; font-style:italic; font-size:clamp(1rem,3.4cqw,1.35rem); color:var(--accent); animation:br-in 1s .85s both;}
@keyframes br-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes br-rise-in{from{opacity:0; transform:translateY(24px) scale(.97)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.br-heart,.br-photo,.br-eyebrow,.br-name,.br-rule,.br-msg,.br-from{animation:none !important}}
`;
