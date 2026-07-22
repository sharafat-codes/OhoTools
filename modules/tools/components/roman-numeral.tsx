"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

const MAP: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRoman(n: number) {
  let out = "";
  for (const [v, s] of MAP) {
    while (n >= v) {
      out += s;
      n -= v;
    }
  }
  return out;
}

function fromRoman(s: string): number | null {
  const str = s.toUpperCase().trim();
  if (!/^[MDCLXVI]+$/.test(str)) return null;
  const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const cur = val[str[i]];
    const next = val[str[i + 1]] ?? 0;
    total += cur < next ? -cur : cur;
  }
  // Round-trip check to reject malformed numerals like "IIII" or "VX".
  if (toRoman(total) !== str) return null;
  return total;
}

export function RomanNumeral() {
  const [value, setValue] = React.useState("2026");

  const trimmed = value.trim();
  const isNumber = /^\d+$/.test(trimmed);

  let result: string | null = null;
  let resultLabel = "";
  let error: string | null = null;

  if (!trimmed) {
    // nothing
  } else if (isNumber) {
    const n = parseInt(trimmed, 10);
    if (n < 1 || n > 3999) error = "Enter a number between 1 and 3999.";
    else {
      result = toRoman(n);
      resultLabel = "Roman numeral";
    }
  } else {
    const n = fromRoman(trimmed);
    if (n === null) error = "That isn't a valid Roman numeral.";
    else {
      result = String(n);
      resultLabel = "Number";
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="roman">Number or Roman numeral</Label>
        <Input
          id="roman"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 2026 or MMXXVI"
          className="font-mono text-lg"
        />
        <p className="text-xs text-muted-foreground">
          Type a number (1–3999) to get the Roman numeral, or a Roman numeral to get the number — it auto-detects.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : result ? (
        <Card>
          <CardContent className="flex items-center justify-between gap-3 py-5">
            <div>
              <div className="text-xs text-muted-foreground">{resultLabel}</div>
              <div className="font-heading text-3xl font-semibold tracking-wide">{result}</div>
            </div>
            <CopyButton value={result} label="" />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
