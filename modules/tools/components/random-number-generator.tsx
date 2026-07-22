"use client";

import * as React from "react";
import { ShuffleIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

export function RandomNumberGenerator() {
  const [min, setMin] = React.useState("1");
  const [max, setMax] = React.useState("100");
  const [count, setCount] = React.useState("1");
  const [unique, setUnique] = React.useState(false);
  const [results, setResults] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  function generate() {
    const lo = parseInt(min);
    const hi = parseInt(max);
    const n = Math.max(1, Math.min(parseInt(count) || 1, 10000));
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo > hi) {
      setError("Enter a valid range (min ≤ max).");
      setResults([]);
      return;
    }
    const rangeSize = hi - lo + 1;
    if (unique && n > rangeSize) {
      setError(`Can't pick ${n} unique numbers from a range of only ${rangeSize}.`);
      setResults([]);
      return;
    }
    setError(null);
    if (unique) {
      const pool = Array.from({ length: rangeSize }, (_, i) => lo + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      setResults(pool.slice(0, n));
    } else {
      setResults(Array.from({ length: n }, () => lo + Math.floor(Math.random() * rangeSize)));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rng-min">Minimum</Label>
          <Input id="rng-min" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rng-max">Maximum</Label>
          <Input id="rng-max" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rng-count">How many</Label>
          <Input id="rng-count" type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="size-4 rounded border-input" />
          No duplicates
        </label>
        <Button onClick={generate}>
          <ShuffleIcon />
          Generate
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {results.length > 0 && (
        <Card>
          <CardContent className="flex flex-col gap-3 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {results.length} number{results.length === 1 ? "" : "s"}
              </span>
              <CopyButton value={results.join(", ")} label="" />
            </div>
            {results.length === 1 ? (
              <div className="text-center font-heading text-4xl font-semibold">{results[0].toLocaleString()}</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {results.map((n, i) => (
                  <span key={i} className="rounded-lg bg-muted px-2.5 py-1 font-mono text-sm">
                    {n.toLocaleString()}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
