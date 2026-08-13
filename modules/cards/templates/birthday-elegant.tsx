"use client";

import * as React from "react";

import { resolveTheme, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

const SPARKLES = [
  { left: "12%", top: "22%", delay: "0s" },
  { left: "82%", top: "18%", delay: "1.1s" },
  { left: "20%", top: "70%", delay: "0.6s" },
  { left: "74%", top: "66%", delay: "1.6s" },
  { left: "50%", top: "12%", delay: "0.3s" },
  { left: "38%", top: "82%", delay: "2s" },
];

export function BirthdayElegant({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  return (
    <div
      className="be-stage"
      style={{ "--accent": t.accent, "--bg1": t.bg1 } as React.CSSProperties}
    >
      <style>{CSS}</style>
      <div className="be-glow" />
      {SPARKLES.map((s, i) => (
        <span key={i} className="be-sparkle" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
      ))}
      <Confetti colors={[t.accent, "#ffffff", "#fde68a"]} fireKey={fireKey} effect={data.effect} />

      <div className="be-content">
        {data.photo && <img src={data.photo} alt="" className="be-photo" />}
        <div className="be-eyebrow">Happy Birthday</div>
        <h1 className="be-name">{data.to}</h1>
        <div className="be-rule" />
        <p className="be-msg">{data.message}</p>
        {data.from.trim() && <div className="be-from">with love, {data.from}</div>}
      </div>
    </div>
  );
}

const CSS = `
.be-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#f8fafc;
  background:radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--bg1) 60%, #000) 0%, #07070c 70%);}
.be-glow{position:absolute; top:30%; left:50%; width:70%; padding-top:70%; transform:translate(-50%,-50%); border-radius:50%;
  background:radial-gradient(circle, color-mix(in srgb, var(--accent) 55%, transparent), transparent 60%); filter:blur(40px); opacity:.5; animation:be-breathe 6s ease-in-out infinite;}
@keyframes be-breathe{0%,100%{opacity:.4; transform:translate(-50%,-50%) scale(1)}50%{opacity:.65; transform:translate(-50%,-50%) scale(1.08)}}
.be-sparkle{position:absolute; width:6px; height:6px; border-radius:50%; background:var(--accent); box-shadow:0 0 10px var(--accent); animation:be-twinkle 3s ease-in-out infinite;}
@keyframes be-twinkle{0%,100%{opacity:0; transform:scale(.4)}50%{opacity:1; transform:scale(1.2)}}
.be-content{position:relative; z-index:10; padding:24px; max-width:90%;}
.be-photo{display:block; margin:0 auto 1em; width:clamp(90px,24vw,130px); height:clamp(90px,24vw,130px); border-radius:50%; object-fit:cover;
  border:2px solid var(--accent); box-shadow:0 0 0 6px color-mix(in srgb, var(--accent) 20%, transparent), 0 10px 40px rgba(0,0,0,.5); animation:be-in 1s .1s both;}
.be-eyebrow{font-size:clamp(.8rem,2.6vw,1rem); letter-spacing:.35em; text-transform:uppercase; color:var(--accent); font-weight:600; animation:be-in .9s .2s both;}
.be-name{margin:.25em 0; font-family:Georgia,'Times New Roman',serif; font-weight:700; font-size:clamp(2.8rem,11vw,5.5rem); line-height:1.05;
  text-shadow:0 4px 30px rgba(0,0,0,.4); animation:be-rise .9s .35s both;}
.be-rule{width:70px; height:2px; margin:.4em auto 1em; background:linear-gradient(90deg, transparent, var(--accent), transparent); animation:be-in 1s .55s both;}
.be-msg{font-size:clamp(1rem,3.2vw,1.3rem); line-height:1.7; opacity:.9; max-width:34ch; margin:0 auto; font-style:italic; animation:be-in 1s .7s both; text-wrap:balance;}
.be-from{margin-top:1.4em; font-size:clamp(.9rem,2.8vw,1.1rem); letter-spacing:.1em; color:var(--accent); animation:be-in 1s .85s both;}
@keyframes be-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes be-rise{from{opacity:0; transform:translateY(26px) scale(.96)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.be-glow,.be-sparkle,.be-photo,.be-eyebrow,.be-name,.be-rule,.be-msg,.be-from{animation:none !important}}
`;
