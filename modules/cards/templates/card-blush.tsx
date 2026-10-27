"use client";

import * as React from "react";

import { resolveTheme, OCCASIONS, elemStyle, type CardData } from "@/modules/cards/types";
import { Confetti } from "@/modules/cards/components/confetti";

// Butterflies: each one drifts along its own slow path while its wings beat.
// Values are whole numbers so the server and client render identical markup.
const BUTTERFLIES = [
  { size: 46, top: 18, hue: "blush", dur: 26, delay: 0, flap: 1.1 },
  { size: 32, top: 36, hue: "lavender", dur: 32, delay: 6, flap: 0.9 },
  { size: 56, top: 62, hue: "blush", dur: 38, delay: 12, flap: 1.3 },
  { size: 26, top: 78, hue: "sage", dur: 30, delay: 3, flap: 0.8 },
  { size: 38, top: 10, hue: "lavender", dur: 34, delay: 18, flap: 1.0 },
  { size: 24, top: 50, hue: "blush", dur: 28, delay: 9, flap: 0.7 },
];

// Petals: start positions, sizes and timing fixed per petal.
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 7 + (i % 4) * 3,
  dur: 11 + (i % 5) * 2,
  delay: (i * 1.7) % 12,
  hue: i % 3,
}));

function Butterfly({ size, className, style }: { size: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={{ width: size, height: size, ...style }} viewBox="0 0 64 64" aria-hidden="true">
      <g className="bl-wing bl-wing-l">
        <path d="M31 32 C20 10 2 12 4 26 C6 36 18 40 31 32 Z" />
        <path d="M31 33 C18 36 8 50 16 56 C22 60 30 46 31 33 Z" opacity=".85" />
      </g>
      <g className="bl-wing bl-wing-r">
        <path d="M33 32 C44 10 62 12 60 26 C58 36 46 40 33 32 Z" />
        <path d="M33 33 C46 36 56 50 48 56 C42 60 34 46 33 33 Z" opacity=".85" />
      </g>
      <path d="M32 20 C30 28 30 40 32 48 C34 40 34 28 32 20 Z" className="bl-body" />
      <path d="M31 21 C28 16 25 14 23 12 M33 21 C36 16 39 14 41 12" className="bl-antenna" />
    </svg>
  );
}

function Sprig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 220" aria-hidden="true">
      <g fill="none" stroke="var(--sage)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M60 215 C58 160 64 120 56 60 C52 36 60 20 62 6" />
        <path d="M58 150 C40 142 30 128 26 110" />
        <path d="M60 120 C78 112 90 98 94 82" />
        <path d="M57 90 C42 84 34 72 32 58" />
      </g>
      <g fill="var(--sage)" opacity=".7">
        {[[26, 110], [94, 82], [32, 58], [44, 170], [76, 140]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="9" ry="4" transform={`rotate(${i % 2 ? -30 : 30} ${x} ${y})`} />
        ))}
      </g>
      <g fill="var(--blush)">
        <circle cx="62" cy="8" r="8" />
        <circle cx="94" cy="80" r="6" />
        <circle cx="30" cy="56" r="6" />
      </g>
      <g fill="var(--lavender)">
        <circle cx="26" cy="108" r="5" />
        <circle cx="76" cy="138" r="5" />
      </g>
    </svg>
  );
}

/**
 * Blush Garden — soft, dreamy pastels: ivory washed with blush, lavender and
 * sage; translucent butterflies drifting across; petals falling through warm
 * light; a sprig swaying in each corner; a film-grain veil over it all. Names
 * in handwriting. Built from a guest's brief: "romantic, peaceful, whimsical —
 * not luxurious, royal or glittery."
 */
export function CardBlush({ data, fireKey = 0 }: { data: CardData; fireKey?: number }) {
  const t = resolveTheme(data);
  const occ = OCCASIONS[data.occasion];
  const blush = data.custom ? t.accent : "#e9b4c0";
  const lavender = data.custom ? t.bg2 : "#c9bde4";
  const sage = data.custom ? t.bg1 : "#9fbfa6";
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <div className="bl-stage" style={{ "--blush": blush, "--lavender": lavender, "--sage": sage } as React.CSSProperties}>
      <style>{CSS}</style>
      <div className="bl-wash bl-wash-1" />
      <div className="bl-wash bl-wash-2" />
      <div className="bl-wash bl-wash-3" />
      <div className="bl-light" />

      <Sprig className="bl-sprig bl-sprig-l" />
      <Sprig className="bl-sprig bl-sprig-r" />

      <div className="bl-petals" aria-hidden="true">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className={`bl-petal bl-petal-${p.hue}`}
            style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.5, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
          />
        ))}
      </div>

      {BUTTERFLIES.map((b, i) => (
        <div
          key={i}
          className={`bl-fly bl-fly-${b.hue}`}
          style={{ top: `${b.top}%`, animationDuration: `${b.dur}s`, animationDelay: `-${b.delay}s`, "--flap": `${b.flap}s` } as React.CSSProperties}
        >
          <Butterfly size={b.size} className="bl-butterfly" />
        </div>
      ))}

      <Confetti colors={[blush, lavender, "#fff5f7"]} fireKey={fireKey} effect={data.effect} />

      <svg className="bl-grain" aria-hidden="true">
        <filter id={`g${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${id})`} />
      </svg>

      <div className="bl-content">
        {data.photo && <img src={data.photo} alt="" className="bl-photo" />}
        <div className="bl-eyebrow"><span style={elemStyle(data, "eyebrow")}>{occ.eyebrow}</span></div>
        <h1 className="bl-name"><span style={elemStyle(data, "name")}>{data.to}</span></h1>
        <div className="bl-rule"><i /><b /><i /></div>
        <p className="bl-msg"><span style={elemStyle(data, "message")}>{data.message}</span></p>
        {data.from.trim() && <div className="bl-from"><span style={elemStyle(data, "from")}>{data.from}</span></div>}
      </div>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
.bl-stage{position:absolute; inset:0; overflow:hidden; display:flex; align-items:center; justify-content:center; text-align:center; color:#5b5560; background:#fbf7f1;}
.bl-wash{position:absolute; width:70%; aspect-ratio:1; border-radius:50%; filter:blur(40px); opacity:.55; animation:bl-drift 22s ease-in-out infinite alternate;}
.bl-wash-1{background:var(--blush); left:-20%; top:-12%;}
.bl-wash-2{background:var(--lavender); right:-24%; top:30%; animation-delay:-8s;}
.bl-wash-3{background:var(--sage); left:-14%; bottom:-20%; animation-delay:-15s; opacity:.4;}
@keyframes bl-drift{from{transform:translate(0,0) scale(1)}to{transform:translate(6%,4%) scale(1.08)}}
.bl-light{position:absolute; inset:0; background:radial-gradient(ellipse at 50% 20%, rgba(255,250,235,.9), rgba(255,250,235,0) 60%); animation:bl-breathe 9s ease-in-out infinite;}
@keyframes bl-breathe{0%,100%{opacity:.7}50%{opacity:1}}
.bl-sprig{position:absolute; width:clamp(70px,22cqw,130px); height:auto; opacity:.9; filter:blur(.2px); transform-origin:bottom center; animation:bl-sway 6s ease-in-out infinite; z-index:2;}
.bl-sprig-l{left:-3%; bottom:-4%;}
.bl-sprig-r{right:-3%; top:-6%; transform:rotate(180deg); transform-origin:top center; animation-delay:-3s;}
@keyframes bl-sway{0%,100%{rotate:-2.5deg}50%{rotate:2.5deg}}
.bl-sprig-r{animation-name:bl-sway-r}
@keyframes bl-sway-r{0%,100%{rotate:177.5deg}50%{rotate:182.5deg}}
.bl-petals{position:absolute; inset:0; pointer-events:none; z-index:3;}
.bl-petal{position:absolute; top:-6%; display:block; border-radius:50% 50% 50% 50% / 60% 60% 40% 40%; opacity:.75; animation:bl-fall linear infinite;}
.bl-petal-0{background:var(--blush)} .bl-petal-1{background:color-mix(in srgb, var(--blush) 60%, #fff)} .bl-petal-2{background:var(--lavender)}
@keyframes bl-fall{0%{transform:translate(0,0) rotate(0deg); opacity:0}8%{opacity:.75}50%{transform:translate(28px,55vh) rotate(200deg)}100%{transform:translate(-18px,112vh) rotate(380deg); opacity:.2}}
.bl-fly{position:absolute; left:-12%; z-index:4; animation:bl-cross linear infinite; filter:drop-shadow(0 4px 6px rgba(120,80,100,.15));}
@keyframes bl-cross{0%{transform:translate(0,0)}25%{transform:translate(30cqw,-6cqh)}50%{transform:translate(60cqw,4cqh)}75%{transform:translate(90cqw,-5cqh)}100%{transform:translate(125cqw,2cqh)}}
.bl-butterfly{overflow:visible; animation:bl-bob 3.2s ease-in-out infinite;}
@keyframes bl-bob{0%,100%{translate:0 0}50%{translate:0 -6px}}
.bl-fly-blush .bl-wing{fill:var(--blush)} .bl-fly-lavender .bl-wing{fill:var(--lavender)} .bl-fly-sage .bl-wing{fill:var(--sage)}
.bl-wing{opacity:.72; transform-origin:32px 32px; animation:bl-flap var(--flap,1s) ease-in-out infinite; transform-box:view-box;}
.bl-wing-l{animation-name:bl-flap-l} .bl-wing-r{animation-name:bl-flap-r}
@keyframes bl-flap-l{0%,100%{transform:perspective(80px) rotateY(0deg)}50%{transform:perspective(80px) rotateY(60deg)}}
@keyframes bl-flap-r{0%,100%{transform:perspective(80px) rotateY(0deg)}50%{transform:perspective(80px) rotateY(-60deg)}}
.bl-body{fill:#7a6672; opacity:.7} .bl-antenna{fill:none; stroke:#7a6672; stroke-width:1.2; stroke-linecap:round; opacity:.6}
.bl-grain{position:absolute; inset:0; width:100%; height:100%; opacity:.07; mix-blend-mode:multiply; pointer-events:none; z-index:5;}
.bl-content{position:relative; z-index:10; padding:60px 40px 52px; max-width:84%; overflow-wrap:break-word;}
.bl-photo{display:block; margin:0 auto 1em; width:clamp(90px,23cqw,126px); height:clamp(90px,23cqw,126px); border-radius:50%; object-fit:cover; border:4px solid #fff;
  box-shadow:0 10px 30px rgba(120,80,100,.18); animation:bl-in 1.2s .2s both;}
.bl-eyebrow{font-size:clamp(.72rem,2.5cqw,.95rem); letter-spacing:.3em; text-transform:uppercase; color:#8a9e8d; font-weight:600; animation:bl-in 1.2s .4s both;}
.bl-name{margin:.1em 0 .05em; font-family:'Great Vibes','Segoe Script','Brush Script MT','Snell Roundhand',cursive; font-weight:400; font-size:clamp(2.9rem,12.5cqw,6rem); line-height:1.15;
  color:#8b5a6b; text-shadow:0 2px 14px rgba(233,180,192,.45); animation:bl-rise 1.4s .6s both;}
.bl-rule{display:flex; align-items:center; justify-content:center; gap:8px; margin:.3em auto .9em; animation:bl-in 1.2s .9s both;}
.bl-rule i{display:block; height:1px; width:40px; background:linear-gradient(90deg,transparent,var(--blush))}
.bl-rule i:last-child{background:linear-gradient(90deg,var(--blush),transparent)}
.bl-rule b{display:block; width:6px; height:6px; border-radius:50%; background:var(--blush)}
.bl-msg{font-size:clamp(.95rem,3.1cqw,1.2rem); line-height:1.8; max-width:32ch; margin:0 auto; color:#6a6270; animation:bl-in 1.4s 1.1s both; text-wrap:balance;}
.bl-from{margin-top:1.2em; font-family:'Great Vibes','Segoe Script',cursive; font-size:clamp(1.3rem,4.6cqw,1.9rem); color:#9a7b8a; animation:bl-in 1.4s 1.3s both;}
@keyframes bl-in{from{opacity:0; transform:translateY(10px); filter:blur(4px)}to{opacity:1; transform:none; filter:blur(0)}}
@keyframes bl-rise{from{opacity:0; transform:translateY(16px) scale(.98); filter:blur(6px)}to{opacity:1; transform:none; filter:blur(0)}}
@media (prefers-reduced-motion: reduce){.bl-wash,.bl-light,.bl-sprig,.bl-petal,.bl-fly,.bl-butterfly,.bl-wing,.bl-photo,.bl-eyebrow,.bl-name,.bl-rule,.bl-msg,.bl-from{animation:none !important}
  .bl-fly{left:auto; right:10%}}
`;
