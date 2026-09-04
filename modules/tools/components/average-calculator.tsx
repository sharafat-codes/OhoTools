"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  return Number(n.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-heading text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

function parseNumbers(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function modes(nums: number[]): number[] {
  const counts = new Map<number, number>();
  for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);
  let max = 0;
  for (const c of counts.values()) if (c > max) max = c;
  if (max <= 1) return []; // no repeats → no mode
  return [...counts.entries()].filter(([, c]) => c === max).map(([v]) => v).sort((a, b) => a - b);
}

export function AverageCalculator() {
  const [raw, setRaw] = React.useState("10, 15, 15, 20, 40");

  const nums = React.useMemo(() => parseNumbers(raw), [raw]);
  const count = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = count ? sum / count : NaN;
  const sorted = React.useMemo(() => [...nums].sort((a, b) => a - b), [nums]);
  const med = median(sorted);
  const mode = modes(nums);
  const min = count ? sorted[0] : NaN;
  const max = count ? sorted[count - 1] : NaN;
  const range = count ? max - min : NaN;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="avg-input">Numbers (separated by commas, spaces, or new lines)</Label>
        <textarea
          id="avg-input"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-lg border border-border bg-background p-3 text-sm"
          placeholder="e.g. 10, 15, 15, 20, 40"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Mean (average)" value={fmt(mean)} />
        <Stat label="Median" value={fmt(med)} />
        <Stat label="Mode" value={mode.length ? mode.map(fmt).join(", ") : "None"} />
        <Stat label="Count" value={count ? String(count) : "—"} />
        <Stat label="Sum" value={count ? fmt(sum) : "—"} />
        <Stat label="Range" value={fmt(range)} />
        <Stat label="Minimum" value={fmt(min)} />
        <Stat label="Maximum" value={fmt(max)} />
      </div>
    </div>
  );
}
