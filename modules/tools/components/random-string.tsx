"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SliderField } from "@/components/slider-field";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const SETS: Record<string, string> = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  symbol: "-_.!@#$%",
};
const LABELS: Record<string, string> = {
  lower: "a-z",
  upper: "A-Z",
  number: "0-9",
  symbol: "-_.!@#$%",
};

function randomString(length: number, pool: string) {
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < length; i++) out += pool[arr[i] % pool.length];
  return out;
}

export function RandomString() {
  const [length, setLength] = React.useState(24);
  const [count, setCount] = React.useState(5);
  const [opts, setOpts] = React.useState({ lower: true, upper: true, number: true, symbol: false });
  const [results, setResults] = React.useState<string[]>([]);

  const pool = Object.entries(opts)
    .filter(([, on]) => on)
    .map(([k]) => SETS[k])
    .join("");

  function generate() {
    if (!pool) return;
    const n = Math.min(100, Math.max(1, count));
    setResults(Array.from({ length: n }, () => randomString(length, pool)));
  }

  return (
    <div className="flex flex-col gap-5">
      <SliderField label="Length" value={length} min={4} max={128} step={1} onChange={setLength} />

      <div className="grid gap-2 sm:grid-cols-2">
        {(Object.keys(SETS) as (keyof typeof opts)[]).map((key) => (
          <label key={key} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm">
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
              className="size-4 accent-primary"
            />
            <span className="font-mono">{LABELS[key]}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rs-count">How many?</Label>
          <Input
            id="rs-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24"
          />
        </div>
        <Button onClick={generate} disabled={!pool}>
          <RefreshCwIcon />
          Generate
        </Button>
      </div>
      {!pool && <p className="text-xs text-destructive">Select at least one character set.</p>}

      {results.length > 0 && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{results.length} strings</span>
              <CopyButton value={results.join("\n")} label="Copy all" />
            </div>
            <div className="flex flex-col divide-y divide-border rounded-lg bg-muted">
              {results.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-2 px-3 py-2">
                  <code className="truncate font-mono text-xs">{s}</code>
                  <CopyButton value={s} label="" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
