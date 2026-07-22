"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RGB = { r: number; g: number; b: number };

function parseHex(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: RGB) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function mix(c: RGB, target: RGB, amount: number): RGB {
  return {
    r: c.r + (target.r - c.r) * amount,
    g: c.g + (target.g - c.g) * amount,
    b: c.b + (target.b - c.b) * amount,
  };
}

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };
const STEPS = [0.9, 0.75, 0.6, 0.45, 0.3, 0.15];
const SHADE_STEPS = [0.15, 0.3, 0.45, 0.6, 0.75];

function readable(c: RGB) {
  // YIQ contrast — pick black or white text for a swatch.
  return (c.r * 299 + c.g * 587 + c.b * 114) / 1000 > 140 ? "#0a0a0a" : "#ffffff";
}

export function ColorShadesGenerator() {
  const [input, setInput] = React.useState("#6d28d9");
  const base = parseHex(input);

  const swatches: { hex: string; label: string }[] = [];
  if (base) {
    STEPS.forEach((amt, i) => swatches.push({ hex: toHex(mix(base, WHITE, amt)), label: `Tint ${STEPS.length - i}` }));
    swatches.push({ hex: toHex(base), label: "Base" });
    SHADE_STEPS.forEach((amt, i) => swatches.push({ hex: toHex(mix(base, BLACK, amt)), label: `Shade ${i + 1}` }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="shade-input">Base color</Label>
          <Input
            id="shade-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#6d28d9"
            className="font-mono"
          />
        </div>
        <input
          type="color"
          value={base ? toHex(base) : "#000000"}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Pick a color"
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
        />
      </div>

      {base ? (
        <div className="overflow-hidden rounded-xl border border-border">
          {swatches.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => navigator.clipboard?.writeText(s.hex)}
              title={`Copy ${s.hex}`}
              className="flex w-full items-center justify-between px-4 py-3 text-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: s.hex, color: readable(parseHex(s.hex)!) }}
            >
              <span className="font-medium">{s.label}</span>
              <span className="font-mono">{s.hex}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-destructive">Enter a valid HEX color (e.g. #6d28d9).</p>
      )}

      {base && <p className="text-xs text-muted-foreground">Click any shade to copy its HEX value.</p>}
    </div>
  );
}
