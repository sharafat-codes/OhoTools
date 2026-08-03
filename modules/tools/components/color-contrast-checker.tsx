"use client";

import * as React from "react";
import { CheckIcon, XIcon } from "lucide-react";

import { Label } from "@/components/ui/label";

function parseHex(hex: string): [number, number, number] | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function luminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function normalize(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return "#000000";
  return "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
}

function Verdict({ pass, label }: { pass: boolean; label: string }) {
  return (
    <div
      className={
        "flex items-center justify-between rounded-lg border px-3 py-2 text-sm " +
        (pass ? "border-emerald-500/30 bg-emerald-500/10" : "border-destructive/30 bg-destructive/10")
      }
    >
      <span className="text-muted-foreground">{label}</span>
      <span className={"inline-flex items-center gap-1 font-medium " + (pass ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>
        {pass ? <CheckIcon className="size-4" /> : <XIcon className="size-4" />}
        {pass ? "Pass" : "Fail"}
      </span>
    </div>
  );
}

export function ColorContrastChecker() {
  const [fg, setFg] = React.useState("#1f2937");
  const [bg, setBg] = React.useState("#ffffff");

  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);
  const ratio =
    fgRgb && bgRgb
      ? (() => {
          const l1 = luminance(fgRgb);
          const l2 = luminance(bgRgb);
          return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        })()
      : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField label="Text color" value={fg} onChange={setFg} />
        <ColorField label="Background color" value={bg} onChange={setBg} />
      </div>

      {ratio != null ? (
        <div className="flex flex-col gap-4">
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-8 text-center"
            style={{ backgroundColor: normalize(bg), color: normalize(fg) }}
          >
            <span className="text-lg font-medium">Almost before we knew it, we had left the ground.</span>
            <span className="text-2xl font-bold">Large text sample</span>
          </div>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">Contrast ratio</div>
            <div className="font-heading text-4xl font-semibold">{ratio.toFixed(2)}:1</div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <Verdict pass={ratio >= 4.5} label="AA · normal text" />
            <Verdict pass={ratio >= 3} label="AA · large text" />
            <Verdict pass={ratio >= 7} label="AAA · normal text" />
            <Verdict pass={ratio >= 4.5} label="AAA · large text" />
          </div>
        </div>
      ) : (
        <p className="text-sm text-destructive">Enter valid hex colors (e.g. #1a2b3c).</p>
      )}

      <p className="text-xs text-muted-foreground">
        Follows the WCAG 2 contrast formula. &ldquo;Large text&rdquo; means 18pt+ (or 14pt+ bold). AA is the common
        accessibility target; AAA is stricter.
      </p>
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const swatch = parseHex(value) ? normalize(value) : "#ffffff";
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={swatch}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} picker`}
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-border bg-background"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>
    </div>
  );
}
