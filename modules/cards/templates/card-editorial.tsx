"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

/**
 * Editorial — cream paper, one very large serif line, and almost nothing else.
 * The restraint is the product: it is the only design here that does not
 * decorate, which is what the modern end of the wedding stationery market
 * looks like.
 */
export function CardEditorial({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  // Light card, so only the accent follows a custom palette — see Botanical.
  const accent = data.custom ? t.accent : "#9a7b4f";

  return (
    <div className="ed-stage" style={{ "--accent": accent } as React.CSSProperties}>
      <style>{CSS}</style>
      <div className="ed-frame" />
      <Confetti colors={[accent, "#c9b9a2", "#ffffff"]} fireKey={fireKey} effect={data.effect} />

      <div className="ed-content">
        {data.photo && <img src={data.photo} alt="" className="ed-photo" />}
        <div className="ed-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="ed-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="ed-rule" />
        <p className="ed-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="ed-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.ed-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#1f1d1a;
  background:linear-gradient(180deg,#faf7f2 0%,#f2ece2 100%);}
.ed-frame{position:absolute; inset:14px; border:1px solid color-mix(in srgb, var(--accent) 32%, transparent); pointer-events:none; z-index:2;}
.ed-content{position:relative; z-index:10; padding:48px 40px; max-width:86%; overflow-wrap:break-word;}
.ed-photo{display:block; margin:0 auto 1.4em; width:clamp(78px,19cqw,104px); height:clamp(78px,19cqw,104px); border-radius:0; object-fit:cover;
  filter:grayscale(.25); box-shadow:0 8px 26px rgba(40,34,26,.18); animation:ed-in 1s .1s both;}
.ed-eyebrow{font-size:clamp(.68rem,2.3cqw,.9rem); letter-spacing:.46em; text-transform:uppercase; color:var(--accent); font-weight:500;
  padding-left:.46em; animation:ed-in .9s .2s both;}
.ed-name{margin:.42em 0 0; font-family:Georgia,'Times New Roman',serif; font-weight:400; font-size:clamp(2.4rem,11cqw,5.2rem); line-height:1.04;
  letter-spacing:-.018em; animation:ed-rise 1s .35s both;}
.ed-rule{width:100%; max-width:220px; height:1px; margin:1.15em auto; background:var(--accent); opacity:.5; transform-origin:center;
  animation:ed-draw .9s .62s both;}
@keyframes ed-draw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.ed-msg{font-size:clamp(.88rem,2.9cqw,1.08rem); line-height:1.85; color:#4a453d; max-width:36ch; margin:0 auto; animation:ed-in 1s .78s both; text-wrap:balance;}
.ed-from{margin-top:1.6em; font-size:clamp(.68rem,2.3cqw,.88rem); letter-spacing:.32em; text-transform:uppercase; color:var(--accent);
  padding-left:.32em; animation:ed-in 1s .92s both;}
@keyframes ed-in{from{opacity:0; transform:translateY(12px)}to{opacity:1; transform:none}}
@keyframes ed-rise{from{opacity:0; transform:translateY(20px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.ed-photo,.ed-eyebrow,.ed-name,.ed-rule,.ed-msg,.ed-from{animation:none !important}}
`;
