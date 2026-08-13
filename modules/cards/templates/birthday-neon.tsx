"use client";

import * as React from "react";

import { resolveTheme, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

export function BirthdayNeon({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const neon = t.accent;
  const neon2 = t.bg2;
  return (
    <div className="bn-stage" style={{ "--neon": neon, "--neon2": neon2 } as React.CSSProperties}>
      <style>{CSS}</style>
      <div className="bn-grid" />
      <div className="bn-frame" />
      <Confetti colors={[neon, "#ffffff", neon2]} fireKey={fireKey} effect={data.effect} />

      <div className="bn-content">
        {data.photo && <img src={data.photo} alt="" className="bn-photo" />}
        <div className="bn-eyebrow">HAPPY BIRTHDAY</div>
        <h1 className="bn-name">{data.to}</h1>
        <p className="bn-msg">{data.message}</p>
        {data.from.trim() && <div className="bn-from">— {data.from}</div>}
      </div>
    </div>
  );
}

const CSS = `
.bn-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#eafaff;
  background:radial-gradient(circle at 50% 40%, #10131f 0%, #060711 75%);}
.bn-grid{position:absolute; inset:0; opacity:.18;
  background-image:linear-gradient(color-mix(in srgb, var(--neon) 60%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--neon) 60%, transparent) 1px, transparent 1px);
  background-size:44px 44px; -webkit-mask-image:radial-gradient(circle at 50% 55%, #000 30%, transparent 75%); mask-image:radial-gradient(circle at 50% 55%, #000 30%, transparent 75%);}
.bn-frame{position:absolute; inset:20px; border:2px solid var(--neon); border-radius:16px; pointer-events:none;
  box-shadow:0 0 14px var(--neon), inset 0 0 14px color-mix(in srgb, var(--neon) 60%, transparent); animation:bn-pulse 2.6s ease-in-out infinite;}
@keyframes bn-pulse{0%,100%{opacity:.55}50%{opacity:1}}
.bn-content{position:relative; z-index:10; padding:44px; max-width:88%;}
.bn-photo{display:block; margin:0 auto 1em; width:clamp(92px,24vw,128px); height:clamp(92px,24vw,128px); border-radius:50%; object-fit:cover;
  border:2px solid var(--neon); box-shadow:0 0 20px var(--neon); animation:bn-in 1s .1s both;}
.bn-eyebrow{font-size:clamp(.75rem,2.4vw,1rem); letter-spacing:.4em; color:var(--neon); font-weight:600; text-shadow:0 0 8px var(--neon); animation:bn-in .9s .2s both;}
.bn-name{margin:.15em 0 .3em; font-weight:800; font-size:clamp(3rem,12vw,6rem); line-height:1; color:#fff;
  text-shadow:0 0 6px #fff, 0 0 16px var(--neon), 0 0 34px var(--neon), 0 0 60px var(--neon2);
  animation:bn-flicker 4s linear .8s infinite, bn-pop .8s .3s both;}
@keyframes bn-flicker{0%,18%,22%,25%,53%,57%,100%{opacity:1}20%,24%,55%{opacity:.72}}
@keyframes bn-pop{from{opacity:0; transform:scale(.85)}to{opacity:1; transform:none}}
.bn-msg{font-size:clamp(1rem,3.3vw,1.32rem); line-height:1.6; opacity:.92; max-width:32ch; margin:0 auto; animation:bn-in 1s .55s both; text-wrap:balance;}
.bn-from{margin-top:1.3em; font-size:clamp(.95rem,3vw,1.15rem); font-weight:600; color:var(--neon); text-shadow:0 0 8px var(--neon); animation:bn-in 1s .75s both;}
@keyframes bn-in{from{opacity:0; transform:translateY(16px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.bn-frame,.bn-photo,.bn-eyebrow,.bn-name,.bn-msg,.bn-from{animation:none !important}}
`;
