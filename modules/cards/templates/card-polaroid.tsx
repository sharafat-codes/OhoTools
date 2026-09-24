"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

/**
 * Polaroid — a taped instant photo on kraft paper.
 *
 * The only design that treats the uploaded photo as the subject rather than a
 * small avatar above the text. Without a photo it still works: the frame holds
 * the greeting instead, so the layout never collapses into an empty white box.
 */
export function CardPolaroid({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const ink = data.custom ? t.accent : "#b4553f";

  return (
    <div className="pl-stage" style={{ "--ink": ink, "--c1": t.bg1, "--c2": t.bg2 } as React.CSSProperties}>
      <style>{CSS}</style>
      <Confetti colors={[ink, "#e8d9c0", "#ffffff"]} fireKey={fireKey} effect={data.effect} />

      <div className="pl-content">
        <div className="pl-frame">
          <span className="pl-tape pl-tape-l" />
          <span className="pl-tape pl-tape-r" />
          <div className="pl-window">
            {data.photo ? (
              <img src={data.photo} alt="" className="pl-photo" />
            ) : (
              <div className="pl-fallback"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
            )}
          </div>
          <div className="pl-caption"><span style={elemStyle(data, "name")}>{data.to}</span></div>
        </div>

        {data.photo && <div className="pl-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>}
        <p className="pl-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="pl-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.pl-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#40382e;
  background:
    radial-gradient(circle at 18% 12%, rgba(255,255,255,.55), transparent 42%),
    radial-gradient(circle at 84% 86%, rgba(255,255,255,.35), transparent 44%),
    linear-gradient(160deg,#f2e7d5 0%,#e7d8c0 55%,#dfcdb1 100%);}
.pl-stage::after{content:""; position:absolute; inset:0; pointer-events:none; opacity:.35;
  background-image:radial-gradient(rgba(120,95,65,.16) 1px, transparent 1px); background-size:7px 7px;}
.pl-content{position:relative; z-index:10; padding:30px; max-width:88%; overflow-wrap:break-word;}
/* Its own query container: the frame is capped by viewport height, so text
   sized against the page container would outgrow the photo window. */
.pl-frame{container-type:inline-size; position:relative; width:min(clamp(168px,46cqw,260px), 34vh); margin:0 auto 1.15em; padding:11px 11px 0; background:#fffdf8; rotate:-2.4deg;
  box-shadow:0 14px 34px rgba(70,54,36,.3), 0 2px 5px rgba(70,54,36,.18); animation:pl-drop .85s .1s both;}
.pl-tape{position:absolute; top:-12px; width:60px; height:23px; background:rgba(226,214,186,.78); box-shadow:0 1px 3px rgba(70,54,36,.2);}
.pl-tape-l{left:-16px; rotate:-28deg;}
.pl-tape-r{right:-16px; rotate:28deg;}
.pl-window{position:relative; aspect-ratio:1; overflow:hidden; background:linear-gradient(150deg, var(--c1), var(--c2));}
.pl-photo{width:100%; height:100%; object-fit:cover; display:block; filter:saturate(1.05) contrast(1.02);}
.pl-fallback{position:absolute; inset:0; display:grid; place-items:center; padding:12px; color:#fff; text-align:center;
  font-family:'Segoe Script','Brush Script MT',cursive; font-size:clamp(.85rem,12cqw,1.9rem); line-height:1.2; text-shadow:0 2px 10px rgba(0,0,0,.3);}
.pl-caption{padding:.5em 6px .62em; font-family:'Segoe Script','Brush Script MT',cursive; color:var(--ink);
  font-size:clamp(1rem,13cqw,2.1rem); line-height:1.15; overflow-wrap:break-word;}
.pl-eyebrow{font-size:clamp(.68rem,2.3cqw,.88rem); letter-spacing:.34em; text-transform:uppercase; color:#8a7a63; font-weight:600;
  padding-left:.34em; margin-bottom:.5em; animation:pl-in .9s .5s both;}
.pl-msg{font-family:Georgia,'Times New Roman',serif; font-size:clamp(.92rem,3cqw,1.15rem); line-height:1.75; color:#4d4336; max-width:32ch; margin:0 auto;
  animation:pl-in 1s .62s both; text-wrap:balance;}
.pl-from{margin-top:1.15em; font-family:'Segoe Script','Brush Script MT',cursive; font-size:clamp(1.05rem,3.8cqw,1.5rem); color:var(--ink);
  animation:pl-in 1s .8s both;}
@keyframes pl-drop{from{opacity:0; transform:translateY(-22px) scale(.94); rotate:-9deg}to{opacity:1; transform:none; rotate:-2.4deg}}
@keyframes pl-in{from{opacity:0; transform:translateY(12px)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.pl-frame,.pl-eyebrow,.pl-msg,.pl-from{animation:none !important} .pl-frame{rotate:-2.4deg}}
`;
