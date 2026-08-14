"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

// Deterministic positions (no Math.random) to avoid hydration mismatch.
const STARS = [
  { top: "12%", left: "14%", size: 3, delay: "0s" },
  { top: "20%", left: "82%", size: 2, delay: "0.8s" },
  { top: "30%", left: "24%", size: 2, delay: "1.6s" },
  { top: "16%", left: "62%", size: 3, delay: "0.4s" },
  { top: "40%", left: "88%", size: 2, delay: "1.2s" },
  { top: "50%", left: "10%", size: 2, delay: "2s" },
  { top: "26%", left: "46%", size: 2, delay: "1s" },
];

const LANTERNS = [
  { left: "18%", drop: "8%", delay: "0s", dur: "4.2s" },
  { left: "50%", drop: "4%", delay: "0.6s", dur: "4.8s" },
  { left: "82%", drop: "9%", delay: "1.1s", dur: "4.4s" },
];

const DIYAS = ["14%", "33%", "50%", "67%", "86%"];

export function CardFestival({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const isEid = data.occasion === "eid";

  return (
    <div
      className="cf-stage"
      style={{ "--bg1": t.bg1, "--bg2": t.bg2, "--accent": t.accent, "--text": t.text } as React.CSSProperties}
    >
      <style>{CSS}</style>
      <div className="cf-glow" />

      {STARS.map((s, i) => (
        <span
          key={i}
          className="cf-star"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}

      {isEid && <span className="cf-moon" aria-hidden />}

      {/* Hanging lanterns (gold, gently swaying) */}
      {LANTERNS.map((l, i) => (
        <span key={i} className="cf-lantern" style={{ left: l.left, top: l.drop, animationDelay: l.delay, animationDuration: l.dur }} aria-hidden>
          <span className="cf-lantern-body" />
        </span>
      ))}

      <Confetti colors={[t.accent, "#ffffff", t.bg2]} fireKey={fireKey} effect={data.effect} />

      {/* Diwali: row of glowing diyas along the bottom */}
      {!isEid && (
        <div className="cf-diyas" aria-hidden>
          {DIYAS.map((left, i) => (
            <span key={i} className="cf-diya" style={{ left, animationDelay: `${i * 0.25}s` }}>
              <span className="cf-flame" />
            </span>
          ))}
        </div>
      )}

      <div className="cf-frame" />
      <div className="cf-content">
        {data.photo && <img src={data.photo} alt="" className="cf-photo" />}
        <div className="cf-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="cf-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="cf-rule"><span className="cf-orn">{isEid ? "☾" : "✦"}</span></div>
        <p className="cf-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="cf-from"><span style={elemStyle(data, "from")}>— {data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.cf-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:var(--text);
  background:linear-gradient(165deg, var(--bg1), var(--bg2));}
.cf-glow{position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 55%),
             radial-gradient(circle at 50% 118%, color-mix(in srgb, var(--accent) 40%, transparent), transparent 45%);}

.cf-star{position:absolute; background:#fff; border-radius:50%; box-shadow:0 0 6px #fff, 0 0 12px var(--accent); opacity:.85;
  animation:cf-twinkle 3s ease-in-out infinite; z-index:1;}
@keyframes cf-twinkle{0%,100%{opacity:.25; transform:scale(.7)}50%{opacity:1; transform:scale(1.15)}}

.cf-moon{position:absolute; top:9%; right:14%; width:clamp(42px,13cqw,76px); height:clamp(42px,13cqw,76px); border-radius:50%;
  box-shadow: inset -13px -5px 0 0 var(--accent); filter:drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 65%, transparent));
  animation:cf-float 7s ease-in-out infinite; z-index:2;}
@keyframes cf-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

.cf-lantern{position:absolute; transform-origin:top center; animation:cf-sway ease-in-out infinite; z-index:2;}
.cf-lantern::before{content:""; position:absolute; left:50%; top:-38px; width:1px; height:38px; background:color-mix(in srgb, var(--accent) 55%, transparent);}
.cf-lantern-body{display:block; width:clamp(13px,3.2cqw,19px); height:clamp(19px,4.8cqw,28px);
  background:linear-gradient(var(--accent), color-mix(in srgb, var(--accent) 55%, #7c2d12));
  border-radius:44% 44% 46% 46% / 32% 32% 62% 62%; box-shadow:0 0 12px color-mix(in srgb, var(--accent) 70%, transparent);}
.cf-lantern-body::after{content:""; position:absolute; bottom:-5px; left:50%; transform:translateX(-50%); width:3px; height:6px; background:var(--accent); border-radius:0 0 2px 2px;}
@keyframes cf-sway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}

.cf-diyas{position:absolute; bottom:5%; left:0; right:0; height:40px; z-index:2;}
.cf-diya{position:absolute; bottom:0; width:clamp(22px,6cqw,34px); height:clamp(9px,2.4cqw,13px); transform:translateX(-50%);
  background:radial-gradient(circle at 50% 0, #b45309, #431407); border-radius:0 0 50% 50%; box-shadow:0 0 16px color-mix(in srgb, var(--accent) 55%, transparent);}
.cf-flame{position:absolute; left:50%; top:-11px; transform:translateX(-50%); width:8px; height:14px;
  background:radial-gradient(circle at 50% 75%, #fff, var(--accent) 45%, #f97316 80%); border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
  box-shadow:0 0 12px var(--accent); animation:cf-flicker 1.6s ease-in-out infinite;}
@keyframes cf-flicker{0%,100%{transform:translateX(-50%) scaleY(1); opacity:.95}50%{transform:translateX(-52%) scaleY(1.18); opacity:1}}

.cf-frame{position:absolute; inset:22px; border:1px solid color-mix(in srgb, var(--accent) 55%, transparent); border-radius:14px; pointer-events:none; z-index:3;
  box-shadow:inset 0 0 0 4px color-mix(in srgb, var(--accent) 12%, transparent);}

.cf-content{position:relative; z-index:10; padding:40px 34px; max-width:88%; overflow-wrap:break-word;}
.cf-photo{display:block; margin:0 auto 1em; width:clamp(88px,23cqw,124px); height:clamp(88px,23cqw,124px); border-radius:50%; object-fit:cover;
  border:2px solid var(--accent); box-shadow:0 0 22px color-mix(in srgb, var(--accent) 60%, transparent); animation:cf-in 1s .1s both;}
.cf-eyebrow{font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:clamp(1.2rem,4.4cqw,1.9rem); color:var(--accent);
  text-shadow:0 0 12px color-mix(in srgb, var(--accent) 55%, transparent); animation:cf-in .9s .2s both;}
.cf-name{margin:.12em 0 .1em; font-family:Georgia,'Times New Roman',serif; font-weight:700; font-size:clamp(2.2rem,9.5cqw,4.4rem); line-height:1.1;
  text-shadow:0 4px 22px rgba(0,0,0,.35); animation:cf-rise .9s .35s both;}
.cf-rule{display:flex; align-items:center; justify-content:center; gap:12px; margin:.45em auto 1em; animation:cf-in 1s .55s both;}
.cf-rule::before,.cf-rule::after{content:""; height:1px; width:44px; background:linear-gradient(90deg, transparent, var(--accent));}
.cf-rule::after{background:linear-gradient(90deg, var(--accent), transparent);}
.cf-orn{color:var(--accent); font-size:18px; text-shadow:0 0 10px var(--accent);}
.cf-msg{font-size:clamp(1rem,3.3cqw,1.28rem); line-height:1.7; opacity:.95; max-width:32ch; margin:0 auto; animation:cf-in 1s .7s both; text-wrap:balance;}
.cf-from{margin-top:1.3em; font-family:Georgia,serif; font-style:italic; font-size:clamp(1rem,3.4cqw,1.3rem); color:var(--accent); animation:cf-in 1s .85s both;}
@keyframes cf-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes cf-rise{from{opacity:0; transform:translateY(24px) scale(.97)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){
  .cf-star,.cf-moon,.cf-lantern,.cf-flame,.cf-photo,.cf-eyebrow,.cf-name,.cf-rule,.cf-msg,.cf-from{animation:none !important}
}
`;
