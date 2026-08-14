"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

// Fixed positions (not random) so server and client render identically.
const BALLOONS = [
  { left: "6%", delay: "0s", dur: "9s", scale: 0.9 },
  { left: "22%", delay: "1.6s", dur: "11s", scale: 1.15 },
  { left: "40%", delay: "0.7s", dur: "10s", scale: 0.8 },
  { left: "60%", delay: "2.3s", dur: "12s", scale: 1.05 },
  { left: "78%", delay: "0.4s", dur: "9.5s", scale: 1.2 },
  { left: "91%", delay: "1.9s", dur: "10.5s", scale: 0.85 },
];

export function BirthdayClassic({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const balloonColors = [t.accent, "#ffffff", t.bg2, t.accent, t.bg1, "#ffffff"];

  return (
    <div
      className="bc-stage"
      style={
        {
          "--bg1": t.bg1,
          "--bg2": t.bg2,
          "--accent": t.accent,
          "--text": t.text,
        } as React.CSSProperties
      }
    >
      <style>{CSS}</style>

      {/* soft moving glow orbs */}
      <div className="bc-orb bc-orb1" />
      <div className="bc-orb bc-orb2" />

      {/* balloons */}
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          className="bc-balloon-wrap"
          style={{ left: b.left, animationDelay: b.delay, animationDuration: b.dur }}
        >
          <div className="bc-balloon" style={{ background: balloonColors[i % balloonColors.length], transform: `scale(${b.scale})` }} />
        </div>
      ))}

      <Confetti colors={[t.accent, "#ffffff", t.bg2, "#fde68a"]} fireKey={fireKey} effect={data.effect} />

      {/* content */}
      <div className="bc-content">
        {data.photo && <img src={data.photo} alt="" className="bc-photo" />}
        <div className="bc-eyebrow">{occ.eyebrow}</div>
        <h1 className="bc-name">{data.to}</h1>
        <p className="bc-msg">{data.message}</p>
        {data.from.trim() && <div className="bc-from">— {data.from}</div>}
      </div>
    </div>
  );
}

const CSS = `
.bc-stage{
  position:absolute; inset:0; overflow:hidden;
  display:flex; align-items:center; justify-content:center;
  text-align:center; color:var(--text);
  background:linear-gradient(135deg, var(--bg1), var(--bg2), var(--bg1));
  background-size:200% 200%;
  animation:bc-grad 12s ease infinite;
  font-family:inherit;
}
@keyframes bc-grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.bc-orb{position:absolute; border-radius:50%; filter:blur(60px); opacity:.5; mix-blend-mode:screen;}
.bc-orb1{width:45%; padding-top:45%; background:var(--accent); top:-10%; left:-8%; animation:bc-drift 14s ease-in-out infinite;}
.bc-orb2{width:50%; padding-top:50%; background:var(--bg2); bottom:-15%; right:-10%; animation:bc-drift 18s ease-in-out infinite reverse;}
@keyframes bc-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(6%,8%)}}

.bc-balloon-wrap{position:absolute; bottom:-20%; animation-name:bc-rise; animation-timing-function:linear; animation-iteration-count:infinite; z-index:1;}
@keyframes bc-rise{0%{bottom:-20%}100%{bottom:125%}}
.bc-balloon{position:relative; width:44px; height:56px; border-radius:50%; opacity:.85; box-shadow:inset -6px -6px 12px rgba(0,0,0,.15); animation:bc-sway 4s ease-in-out infinite;}
.bc-balloon::after{content:""; position:absolute; bottom:-26px; left:50%; width:1px; height:26px; background:rgba(255,255,255,.5); transform:translateX(-50%);}
@keyframes bc-sway{0%,100%{rotate:-6deg}50%{rotate:6deg}}

.bc-content{position:relative; z-index:10; padding:24px; max-width:90%; overflow-wrap:break-word;}
.bc-photo{display:block; margin:0 auto .7em; width:clamp(84px,22cqw,120px); height:clamp(84px,22cqw,120px); border-radius:50%; object-fit:cover; border:3px solid var(--accent); box-shadow:0 8px 30px rgba(0,0,0,.3); animation:bc-pop .8s both;}
.bc-eyebrow{font-size:clamp(.9rem,3cqw,1.2rem); font-weight:600; letter-spacing:.08em; text-transform:uppercase; opacity:.95; animation:bc-in .7s .1s both;}
.bc-name{
  margin:.15em 0 .3em; font-weight:800; line-height:1.05;
  font-size:clamp(2.6rem,11cqw,5.5rem);
  background:linear-gradient(90deg,#fff,var(--accent),#fff);
  background-size:200% auto; -webkit-background-clip:text; background-clip:text; color:transparent;
  animation:bc-pop .8s .25s both, bc-shine 4s linear .9s infinite;
  filter:drop-shadow(0 4px 20px rgba(0,0,0,.25));
}
@keyframes bc-shine{to{background-position:200% center}}
.bc-msg{font-size:clamp(1rem,3.4cqw,1.35rem); line-height:1.6; opacity:.96; margin:0 auto; max-width:32ch; animation:bc-in .8s .5s both; text-wrap:balance;}
.bc-from{margin-top:1.2em; font-size:clamp(.95rem,3cqw,1.15rem); font-weight:600; opacity:.9; animation:bc-in .8s .7s both;}
@keyframes bc-in{from{opacity:0; transform:translateY(18px)}to{opacity:1; transform:none}}
@keyframes bc-pop{0%{opacity:0; transform:scale(.7)}60%{opacity:1; transform:scale(1.06)}100%{transform:scale(1)}}
@media (prefers-reduced-motion: reduce){
  .bc-stage,.bc-orb,.bc-balloon-wrap,.bc-balloon,.bc-name,.bc-eyebrow,.bc-msg,.bc-from{animation:none !important}
  .bc-name{color:var(--accent); -webkit-text-fill-color:var(--accent)}
}
`;
