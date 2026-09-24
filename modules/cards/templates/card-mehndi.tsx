"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

const PETALS = Array.from({ length: 16 }, (_, i) => i * 22.5);

function Mandala({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
        <circle cx="100" cy="100" r="16" />
        <circle cx="100" cy="100" r="30" />
        <circle cx="100" cy="100" r="46" />
        <circle cx="100" cy="100" r="70" strokeDasharray="2 7" />
        <circle cx="100" cy="100" r="90" strokeDasharray="1 9" />
        {PETALS.map((a) => (
          <ellipse key={`e${a}`} cx="100" cy="42" rx="7" ry="17" transform={`rotate(${a} 100 100)`} />
        ))}
        {PETALS.map((a) => (
          <path key={`p${a}`} d="M100 54 L108 74 L100 84 L92 74 Z" transform={`rotate(${a + 11.25} 100 100)`} />
        ))}
        {PETALS.map((a) => (
          <circle key={`d${a}`} cx="100" cy="22" r="2.4" fill="currentColor" stroke="none" transform={`rotate(${a} 100 100)`} />
        ))}
      </g>
    </svg>
  );
}

// A marigold string — the flowers actually hung across a doorway at a mehndi.
const GARLAND = Array.from({ length: 26 }, (_, i) => ({
  size: 7 + (i % 3) * 3,
  hue: i % 3,
  delay: `${(i % 7) * 0.22}s`,
}));
const MARIGOLD = ["#f7a828", "#ef6c1a", "#fcd34d"];

/**
 * Mehndi Nights — an emerald-and-gold mandala card for South Asian weddings,
 * mehndi and walima nights. Built because the wedding picker offered a neon
 * glow design and nothing that looked like the invitations these families
 * actually send.
 */
export function CardMehndi({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const gold = data.custom ? t.accent : "#e9c46a";

  return (
    <div className="mh-stage" style={{ "--gold": gold } as React.CSSProperties}>
      <style>{CSS}</style>

      <Mandala className="mh-mandala mh-mandala-tl" />
      <Mandala className="mh-mandala mh-mandala-br" />

      <div className="mh-garland" aria-hidden="true">
        {GARLAND.map((g, i) => (
          <span
            key={i}
            className="mh-bud"
            style={{ width: g.size, height: g.size, background: MARIGOLD[g.hue], animationDelay: g.delay }}
          />
        ))}
      </div>

      <div className="mh-arch" />
      <div className="mh-arch mh-arch2" />
      <Confetti colors={[gold, "#f7a828", "#fdf6e6"]} fireKey={fireKey} effect={data.effect} />

      <div className="mh-content">
        {data.photo && <img src={data.photo} alt="" className="mh-photo" />}
        <div className="mh-eyebrow">
          <span className="mh-orn">۞</span>
          <span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span>
          <span className="mh-orn">۞</span>
        </div>
        <h1 className="mh-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="mh-rule"><span className="mh-dot" /></div>
        <p className="mh-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="mh-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
.mh-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#fdf6e6;
  background:radial-gradient(circle at 50% 34%, #0f4436 0%, #08261f 48%, #3d0f1c 100%);}
.mh-mandala{position:absolute; color:var(--gold); width:clamp(180px,55cqw,350px); height:auto; opacity:.2; animation:mh-spin 90s linear infinite;}
.mh-mandala-tl{left:-15%; top:-7%;}
.mh-mandala-br{right:-15%; bottom:-7%; animation-direction:reverse;}
@keyframes mh-spin{to{rotate:360deg}}
.mh-garland{position:absolute; left:0; right:0; top:0; height:34px; display:flex; align-items:flex-start; justify-content:space-around;
  border-top:1px solid color-mix(in srgb, var(--gold) 55%, transparent); z-index:3;}
.mh-bud{display:block; border-radius:50%; margin-top:6px; box-shadow:0 0 7px rgba(247,168,40,.55); animation:mh-bob 3.4s ease-in-out infinite;}
@keyframes mh-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
.mh-arch{position:absolute; inset:44px 26px 26px; border:1px solid color-mix(in srgb, var(--gold) 58%, transparent);
  border-radius:50% 50% 8px 8px / 32% 32% 8px 8px; pointer-events:none; z-index:2;}
.mh-arch2{inset:51px 33px 33px; border-color:color-mix(in srgb, var(--gold) 26%, transparent);}
.mh-content{position:relative; z-index:10; padding:56px 38px 40px; max-width:84%; overflow-wrap:break-word;}
.mh-photo{display:block; margin:0 auto .9em; width:clamp(84px,21cqw,118px); height:clamp(84px,21cqw,118px); border-radius:50%; object-fit:cover;
  border:2px solid var(--gold); box-shadow:0 0 0 5px color-mix(in srgb, var(--gold) 16%, transparent), 0 12px 36px rgba(0,0,0,.5);
  animation:mh-in 1s .1s both;}
.mh-eyebrow{display:flex; align-items:center; justify-content:center; gap:.7em; font-size:clamp(.82rem,2.8cqw,1.08rem); letter-spacing:.22em;
  text-transform:uppercase; color:var(--gold); font-weight:600; animation:mh-in .9s .2s both;}
.mh-orn{font-size:1.15em; opacity:.8;}
.mh-name{margin:.24em 0 .1em; font-family:Georgia,'Times New Roman',serif; font-weight:700; font-size:clamp(2.2rem,9.2cqw,4.4rem); line-height:1.1;
  background:linear-gradient(100deg,#a9812c,#fff4d4 46%,var(--gold) 56%,#a9812c); background-size:220% auto;
  -webkit-background-clip:text; background-clip:text; color:transparent;
  animation:mh-rise .9s .35s both, mh-foil 6s linear 1s infinite;}
@keyframes mh-foil{to{background-position:220% center}}
.mh-rule{display:flex; align-items:center; justify-content:center; gap:10px; margin:.5em auto 1em; animation:mh-in 1s .55s both;}
.mh-rule::before,.mh-rule::after{content:""; height:1px; width:54px; background:linear-gradient(90deg, transparent, var(--gold));}
.mh-rule::after{background:linear-gradient(90deg, var(--gold), transparent);}
.mh-dot{width:6px; height:6px; rotate:45deg; background:var(--gold); box-shadow:0 0 9px var(--gold);}
.mh-msg{font-size:clamp(.95rem,3.1cqw,1.22rem); line-height:1.76; opacity:.92; max-width:33ch; margin:0 auto; animation:mh-in 1s .7s both; text-wrap:balance;}
.mh-from{margin-top:1.3em; font-family:Georgia,serif; font-style:italic; font-size:clamp(.95rem,3.2cqw,1.25rem); color:var(--gold); animation:mh-in 1s .85s both;}
@keyframes mh-in{from{opacity:0; transform:translateY(14px)}to{opacity:1; transform:none}}
@keyframes mh-rise{from{opacity:0; transform:translateY(22px) scale(.97)}to{opacity:1; transform:none}}
@media (prefers-reduced-motion: reduce){.mh-mandala,.mh-bud,.mh-photo,.mh-eyebrow,.mh-name,.mh-rule,.mh-msg,.mh-from{animation:none !important}
  .mh-name{color:var(--gold); -webkit-text-fill-color:var(--gold)}}
`;
