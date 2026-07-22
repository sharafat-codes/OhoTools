"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function AspectRatioCalculator() {
  const [w, setW] = React.useState("1920");
  const [h, setH] = React.useState("1080");
  const [targetW, setTargetW] = React.useState("1280");
  const [targetH, setTargetH] = React.useState("720");

  const wn = num(w);
  const hn = num(h);
  const ratio = wn && hn ? wn / hn : null;

  let simplified: string | null = null;
  if (wn && hn && Number.isInteger(wn) && Number.isInteger(hn)) {
    const g = gcd(wn, hn);
    simplified = `${wn / g}:${hn / g}`;
  }

  const twn = num(targetW);
  const thn = num(targetH);
  const newHeight = ratio && twn ? Math.round(twn / ratio) : null;
  const newWidth = ratio && thn ? Math.round(thn * ratio) : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>Aspect ratio</Label>
        <div className="flex items-center gap-2">
          <Input type="number" value={w} onChange={(e) => setW(e.target.value)} aria-label="Width" className="w-28" />
          <span className="text-muted-foreground">:</span>
          <Input type="number" value={h} onChange={(e) => setH(e.target.value)} aria-label="Height" className="w-28" />
          {ratio && (
            <span className="ml-1 text-sm text-muted-foreground">
              = {simplified ? `${simplified} · ` : ""}
              {ratio.toFixed(3)}
            </span>
          )}
        </div>
      </div>

      {ratio && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex flex-col gap-2 py-4">
              <Label htmlFor="ar-tw">Scale to width</Label>
              <Input id="ar-tw" type="number" value={targetW} onChange={(e) => setTargetW(e.target.value)} />
              <div className="text-sm text-muted-foreground">
                Height ={" "}
                <span className="font-heading text-base font-semibold text-foreground">
                  {newHeight !== null ? newHeight.toLocaleString() : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-2 py-4">
              <Label htmlFor="ar-th">Scale to height</Label>
              <Input id="ar-th" type="number" value={targetH} onChange={(e) => setTargetH(e.target.value)} />
              <div className="text-sm text-muted-foreground">
                Width ={" "}
                <span className="font-heading text-base font-semibold text-foreground">
                  {newWidth !== null ? newWidth.toLocaleString() : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
