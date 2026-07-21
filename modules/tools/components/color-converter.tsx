"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

type RGB = { r: number; g: number; b: number };

function parseColor(input: string): RGB | null {
  const s = input.trim();
  let m = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }
  m = s.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (m) {
    const [r, g, b] = [+m[1], +m[2], +m[3]];
    if ([r, g, b].every((v) => v <= 255)) return { r, g, b };
  }
  m = s.match(/^hsla?\(\s*(\d+)[,\s]+(\d+)%?[,\s]+(\d+)%?/i);
  if (m) return hslToRgb(+m[1], +m[2], +m[3]);
  return null;
}

function rgbToHex({ r, g, b }: RGB) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl({ r, g, b }: RGB) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0;
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function ColorConverter() {
  const [input, setInput] = React.useState("#6d28d9");
  const rgb = parseColor(input);

  const hex = rgb ? rgbToHex(rgb) : null;
  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : null;
  const hsl = rgb ? rgbToHsl(rgb) : null;
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="color-input">Color</Label>
          <Input
            id="color-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#6d28d9, rgb(109,40,217), hsl(262,70%,50%)"
            className="font-mono"
          />
        </div>
        <input
          type="color"
          value={hex ?? "#000000"}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Pick a color"
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
        />
      </div>

      {rgb ? (
        <>
          <div
            className="h-24 w-full rounded-xl border border-border"
            style={{ backgroundColor: hex ?? undefined }}
          />
          <div className="flex flex-col gap-2">
            {[
              { label: "HEX", value: hex! },
              { label: "RGB", value: rgbStr! },
              { label: "HSL", value: hslStr! },
            ].map((row) => (
              <Card key={row.label}>
                <CardContent className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">{row.label}</div>
                    <code className="font-mono text-sm">{row.value}</code>
                  </div>
                  <CopyButton value={row.value} label="" />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-destructive">
          Enter a valid HEX, RGB, or HSL color.
        </p>
      )}
    </div>
  );
}
