"use client";

import * as React from "react";
import { ShuffleIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/copy-button";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function randHex() {
  const n = Math.floor(Math.random() * 0xffffff);
  return "#" + n.toString(16).padStart(6, "0");
}

function ColorField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="size-9 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="flex-1 font-mono" />
      </div>
    </div>
  );
}

export function CssGradientGenerator() {
  const [type, setType] = React.useState("linear");
  const [angle, setAngle] = React.useState(90);
  const [c1, setC1] = React.useState("#6d28d9");
  const [c2, setC2] = React.useState("#ec4899");

  const gradient =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${c1}, ${c2})`
      : `radial-gradient(circle, ${c1}, ${c2})`;
  const css = `background: ${gradient};`;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="h-44 w-full rounded-xl border border-border"
        style={{ background: gradient }}
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="grad-type">Type</Label>
          <select
            id="grad-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
          >
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
          </select>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mb-0.5"
          onClick={() => {
            setC1(randHex());
            setC2(randHex());
          }}
        >
          <ShuffleIcon />
          Randomize
        </Button>
      </div>

      {type === "linear" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Angle</Label>
            <span className="text-sm text-muted-foreground">{angle}°</span>
          </div>
          <Slider
            value={[angle]}
            min={0}
            max={360}
            onValueChange={(v) => setAngle(Array.isArray(v) ? v[0] : v)}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <ColorField id="grad-c1" label="Color 1" value={c1} onChange={setC1} />
        <ColorField id="grad-c2" label="Color 2" value={c2} onChange={setC2} />
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-muted p-3">
        <code className="overflow-x-auto font-mono text-sm">{css}</code>
        <CopyButton value={css} label="" />
      </div>
    </div>
  );
}
