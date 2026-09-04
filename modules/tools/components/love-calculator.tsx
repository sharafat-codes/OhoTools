"use client";

import * as React from "react";
import { HeartIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Deterministic, just-for-fun score: the same two names always give the same
// result (order-independent), so it's shareable and repeatable. Not science. 💘
function score(a: string, b: string): number {
  const key = [a.trim().toLowerCase(), b.trim().toLowerCase()].sort().join("♥");
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) >>> 0;
  }
  return (h % 100) + 1; // 1–100
}

function message(pct: number): string {
  if (pct >= 90) return "A match made in heaven! 💞";
  if (pct >= 75) return "Strong sparks — this one's got real potential! ✨";
  if (pct >= 55) return "A sweet connection worth nurturing. 💗";
  if (pct >= 35) return "There's something here — give it time. 🙂";
  if (pct >= 15) return "Opposites can attract… with a little effort. 🤔";
  return "Maybe better as friends! 🤝";
}

export function LoveCalculator() {
  const [a, setA] = React.useState("");
  const [b, setB] = React.useState("");
  const [result, setResult] = React.useState<number | null>(null);

  const ready = a.trim() !== "" && b.trim() !== "";

  function calc() {
    if (ready) setResult(score(a, b));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="love-a">Your name</Label>
          <Input id="love-a" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. Alex" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="love-b">Their name</Label>
          <Input id="love-b" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. Sam" />
        </div>
      </div>

      <Button onClick={calc} disabled={!ready}>
        <HeartIcon /> Calculate love
      </Button>

      {result !== null && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
          <div className="relative grid size-28 place-items-center">
            <HeartIcon className="size-28 text-primary/15" />
            <span className="absolute font-heading text-3xl font-semibold text-primary">{result}%</span>
          </div>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${result}%` }} />
          </div>
          <p className="font-medium">
            {a.trim()} &amp; {b.trim()}
          </p>
          <p className="text-sm text-muted-foreground">{message(result)}</p>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Just for fun — the result is a playful calculation based on the two names, not a real prediction. 💘
      </p>
    </div>
  );
}
