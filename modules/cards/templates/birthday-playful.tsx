"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

const RAIN = [
  { emoji: "🎈", left: "8%", delay: "0s", dur: "7s" },
  { emoji: "🎉", left: "24%", delay: "1.4s", dur: "8.5s" },
  { emoji: "🎂", left: "44%", delay: "0.6s", dur: "7.8s" },
  { emoji: "🎁", left: "63%", delay: "2s", dur: "9s" },
  { emoji: "🎈", left: "80%", delay: "0.3s", dur: "7.2s" },
  { emoji: "⭐", left: "92%", delay: "1.7s", dur: "8s" },
  { emoji: "🎉", left: "34%", delay: "2.6s", dur: "8.8s" },
  { emoji: "🎈", left: "54%", delay: "1s", dur: "7.6s" },
];

export function BirthdayPlayful({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  return (
    <div
      className="bp-stage"
      style={{ "--bg1": t.bg1, "--bg2": t.bg2, "--accent": t.accent } as React.CSSProperties}
    >
      <style>{CSS}</style>
      {RAIN.map((r, i) => (
        <span key={i} className="bp-rain" style={{ left: r.left, animationDelay: r.delay, animationDuration: r.dur }}>
          {r.emoji}
        </span>
      ))}
      <Confetti colors={[t.accent, "#ffffff", t.bg2, "#fde68a"]} fireKey={fireKey} effect={data.effect} />

      <div className="bp-content">
        {data.photo && <img src={data.photo} alt="" className="bp-photo" />}
        <div className="bp-eyebrow">🥳 <span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="bp-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <p className="bp-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="bp-from">🎈 <span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.bp-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:var(--bg1);
  background:radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent) 45%, transparent), transparent 45%),
             radial-gradient(circle at 85% 75%, color-mix(in srgb, var(--bg2) 55%, transparent), transparent 45%),
             #fffdf5;}
.bp-stage{background-color:#fffdf5;}
.bp-rain{position:absolute; top:-12%; font-size:clamp(1.6rem,5cqw,2.4rem); animation-name:bp-fall; animation-timing-function:linear; animation-iteration-count:infinite; z-index:1;}
@keyframes bp-fall{0%{top:-12%; transform:rotate(0deg)}100%{top:115%; transform:rotate(30deg)}}
.bp-content{position:relative; z-index:10; padding:24px; max-width:90%; overflow-wrap:break-word;}
.bp-photo{display:block; margin:0 auto .6em; width:clamp(88px,23cqw,124px); height:clamp(88px,23cqw,124px); border-radius:50%; object-fit:cover;
  border:4px solid #fff; box-shadow:0 10px 30px rgba(0,0,0,.18); animation:bp-boing .8s .1s both;}
.bp-eyebrow{display:inline-block; font-size:clamp(1rem,3.4cqw,1.3rem); font-weight:800; color:#fff; background:var(--bg2); padding:.35em .9em; border-radius:999px; box-shadow:0 6px 18px rgba(0,0,0,.15); animation:bp-boing .7s .15s both;}
.bp-name{margin:.2em 0 .25em; font-weight:900; letter-spacing:-.02em; line-height:1; font-size:clamp(3rem,13cqw,6rem); color:var(--bg1);
  text-shadow:3px 3px 0 var(--accent); animation:bp-boing .8s .3s both, bp-wobble 3.5s ease-in-out .9s infinite;}
.bp-msg{font-size:clamp(1.05rem,3.6cqw,1.4rem); line-height:1.55; font-weight:600; color:color-mix(in srgb, var(--bg1) 85%, #000); max-width:30ch; margin:0 auto; animation:bp-in .7s .5s both; text-wrap:balance;}
.bp-from{margin-top:1.1em; font-size:clamp(1rem,3cqw,1.2rem); font-weight:800; color:var(--bg2); animation:bp-in .7s .7s both;}
@keyframes bp-boing{0%{opacity:0; transform:scale(.4)}70%{opacity:1; transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes bp-wobble{0%,100%{rotate:-2deg}50%{rotate:2deg}}
@keyframes bp-in{from{opacity:0; transform:translateY(16px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.bp-rain,.bp-photo,.bp-eyebrow,.bp-name,.bp-msg,.bp-from{animation:none !important}}
`;
