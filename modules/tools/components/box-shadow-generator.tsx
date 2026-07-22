"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/copy-button";

function hexToRgb(hex: string) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const int = parseInt(h, 16);
  if (Number.isNaN(int) || h.length !== 6) return { r: 0, g: 0, b: 0 };
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function SliderRow({
  label,
  value,
  min,
  max,
  unit = "px",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)} />
    </div>
  );
}

export function BoxShadowGenerator() {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(10);
  const [blur, setBlur] = React.useState(25);
  const [spread, setSpread] = React.useState(-5);
  const [opacity, setOpacity] = React.useState(25);
  const [color, setColor] = React.useState("#0f172a");
  const [inset, setInset] = React.useState(false);

  const { r, g, b } = hexToRgb(color);
  const rgba = `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
  const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
  const css = `box-shadow: ${shadow};`;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid place-items-center rounded-xl border border-border bg-muted/40 py-16">
        <div className="size-28 rounded-xl bg-card" style={{ boxShadow: shadow }} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SliderRow label="Offset X" value={x} min={-50} max={50} onChange={setX} />
        <SliderRow label="Offset Y" value={y} min={-50} max={50} onChange={setY} />
        <SliderRow label="Blur" value={blur} min={0} max={100} onChange={setBlur} />
        <SliderRow label="Spread" value={spread} min={-50} max={50} onChange={setSpread} />
        <SliderRow label="Opacity" value={opacity} min={0} max={100} unit="%" onChange={setOpacity} />
        <div className="flex flex-col gap-2">
          <Label htmlFor="shadow-color">Color</Label>
          <div className="flex items-center gap-3">
            <input
              id="shadow-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Shadow color"
              className="size-9 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
            />
            <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
              <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="size-4" />
              Inset
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-muted p-3">
        <code className="overflow-x-auto font-mono text-sm">{css}</code>
        <CopyButton value={css} label="" />
      </div>
    </div>
  );
}
