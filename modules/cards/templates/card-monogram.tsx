"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

/**
 * Two initials from the card's subject: "Aisha & Bilal" → A B, "Sarah Khan" →
 * S K, a single word → one letter. Spread into an array first so a name that
 * starts with a non-BMP character is not cut in half.
 */
function initials(to: string): string[] {
  const first = (s: string) => [...s.trim()][0]?.toUpperCase() ?? "";
  const pair = to.split(/\s*(?:&|\+|\/|\band\b)\s*/i).map((s) => s.trim()).filter(Boolean);
  if (pair.length >= 2) return [first(pair[0]), first(pair[1])].filter(Boolean);
  const words = to.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return [first(words[0]), first(words[words.length - 1])].filter(Boolean);
  return [first(to)].filter(Boolean);
}

/**
 * Gold Monogram — engraved wedding stationery. The monogram is the whole idea:
 * a crest built from the couple's initials, which is what the printed cards
 * this imitates put at the top of the page.
 */
export function CardMonogram({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const gold = data.custom ? t.accent : "#d9b96c";
  const marks = initials(data.to);

  return (
    <div className="mg-stage" style={{ "--gold": gold } as React.CSSProperties}>
      <style>{CSS}</style>

      <div className="mg-frame" />
      <div className="mg-frame mg-frame2" />
      <span className="mg-corner mg-tl" />
      <span className="mg-corner mg-tr" />
      <span className="mg-corner mg-bl" />
      <span className="mg-corner mg-br" />
      <Confetti colors={[gold, "#fdf3d8", "#8c7233"]} fireKey={fireKey} effect={data.effect} />

      <div className="mg-content">
        {data.photo ? (
          <img src={data.photo} alt="" className="mg-photo" />
        ) : (
          <div className="mg-crest" aria-hidden="true">
            <span className="mg-ring" />
            <span className="mg-marks">
              {marks[0]}
              {marks[1] && <span className="mg-amp">&</span>}
              {marks[1]}
            </span>
          </div>
        )}

        <div className="mg-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="mg-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="mg-rule"><span className="mg-dot" /></div>
        <p className="mg-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="mg-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.mg-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#f3eee3;
  background:radial-gradient(circle at 50% 22%, #1d2437 0%, #0d101a 72%);}
.mg-frame{position:absolute; inset:16px; border:1px solid color-mix(in srgb, var(--gold) 50%, transparent); pointer-events:none;}
.mg-frame2{inset:23px; border-color:color-mix(in srgb, var(--gold) 22%, transparent);}
.mg-corner{position:absolute; width:26px; height:26px; border:0 solid var(--gold); opacity:.85; pointer-events:none;}
.mg-tl{left:16px; top:16px; border-left-width:2px; border-top-width:2px;}
.mg-tr{right:16px; top:16px; border-right-width:2px; border-top-width:2px;}
.mg-bl{left:16px; bottom:16px; border-left-width:2px; border-bottom-width:2px;}
.mg-br{right:16px; bottom:16px; border-right-width:2px; border-bottom-width:2px;}
.mg-content{position:relative; z-index:10; padding:42px; max-width:86%; overflow-wrap:break-word;}
.mg-crest{position:relative; display:grid; place-items:center; margin:0 auto .85em; width:clamp(84px,21cqw,116px); height:clamp(84px,21cqw,116px);
  animation:mg-in 1s .1s both;}
.mg-ring{position:absolute; inset:0; border:1px solid color-mix(in srgb, var(--gold) 65%, transparent); border-radius:50%;}
.mg-ring::after{content:""; position:absolute; inset:5px; border:1px solid color-mix(in srgb, var(--gold) 28%, transparent); border-radius:50%;}
.mg-marks{position:relative; font-family:Georgia,'Times New Roman',serif; font-size:clamp(1.7rem,5.6cqw,2.5rem); letter-spacing:.06em; line-height:1;
  background:linear-gradient(100deg,#9c7c32,#fff2cd 45%,var(--gold) 55%,#9c7c32); background-size:220% auto;
  -webkit-background-clip:text; background-clip:text; color:transparent; animation:mg-foil 6s linear 1s infinite;}
.mg-amp{font-size:.5em; font-style:italic; padding:0 .18em; vertical-align:.25em;}
@keyframes mg-foil{to{background-position:220% center}}
.mg-photo{display:block; margin:0 auto .9em; width:clamp(88px,22cqw,122px); height:clamp(88px,22cqw,122px); border-radius:50%; object-fit:cover;
  border:1px solid var(--gold); box-shadow:0 0 0 5px color-mix(in srgb, var(--gold) 14%, transparent), 0 12px 38px rgba(0,0,0,.55);
  animation:mg-in 1s .1s both;}
.mg-eyebrow{font-size:clamp(.72rem,2.4cqw,.95rem); letter-spacing:.38em; text-transform:uppercase; color:var(--gold); font-weight:500;
  padding-left:.38em; animation:mg-in .9s .25s both;}
.mg-name{margin:.28em 0 .1em; font-family:Georgia,'Times New Roman',serif; font-weight:400; font-size:clamp(2.1rem,8.8cqw,4.2rem); line-height:1.14;
  letter-spacing:.01em; animation:mg-rise .9s .4s both;}
.mg-rule{display:flex; align-items:center; justify-content:center; gap:11px; margin:.5em auto 1.05em; animation:mg-in 1s .6s both;}
.mg-rule::before,.mg-rule::after{content:""; height:1px; width:58px; background:linear-gradient(90deg, transparent, var(--gold));}
.mg-rule::after{background:linear-gradient(90deg, var(--gold), transparent);}
.mg-dot{width:5px; height:5px; rotate:45deg; background:var(--gold);}
.mg-msg{font-family:Georgia,'Times New Roman',serif; font-size:clamp(.95rem,3.1cqw,1.22rem); line-height:1.78; opacity:.88; max-width:34ch; margin:0 auto;
  animation:mg-in 1s .75s both; text-wrap:balance;}
.mg-from{margin-top:1.35em; font-size:clamp(.78rem,2.5cqw,1rem); letter-spacing:.24em; text-transform:uppercase; color:var(--gold);
  padding-left:.24em; animation:mg-in 1s .9s both;}
@keyframes mg-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes mg-rise{from{opacity:0; transform:translateY(22px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.mg-crest,.mg-marks,.mg-photo,.mg-eyebrow,.mg-name,.mg-rule,.mg-msg,.mg-from{animation:none !important}
  .mg-marks{color:var(--gold); -webkit-text-fill-color:var(--gold)}}
`;
