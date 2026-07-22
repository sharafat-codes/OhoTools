"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CURRENCIES = ["$", "€", "£", "₹", "¥"];
const PRESETS = [10, 15, 18, 20, 25];

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export function TipCalculator() {
  const [bill, setBill] = React.useState("50");
  const [tipPct, setTipPct] = React.useState(18);
  const [people, setPeople] = React.useState("1");
  const [cur, setCur] = React.useState("$");

  const b = num(bill);
  const p = Math.max(parseInt(people) || 1, 1);

  const tip = b !== null ? (b * tipPct) / 100 : null;
  const total = b !== null && tip !== null ? b + tip : null;
  const money = (v: number) =>
    `${cur}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tip-bill">Bill amount</Label>
          <div className="flex items-center gap-2">
            <select
              value={cur}
              onChange={(e) => setCur(e.target.value)}
              aria-label="Currency"
              className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Input id="tip-bill" type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="flex-1" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tip-people">Split between</Label>
          <Input id="tip-people" type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Tip</Label>
          <span className="text-sm text-muted-foreground">{tipPct}%</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((pct) => (
            <Button
              key={pct}
              variant={tipPct === pct ? "default" : "outline"}
              size="sm"
              onClick={() => setTipPct(pct)}
            >
              {pct}%
            </Button>
          ))}
          <div className="flex items-center gap-1">
            <Input
              type="number"
              min={0}
              value={tipPct}
              onChange={(e) => setTipPct(Math.max(parseFloat(e.target.value) || 0, 0))}
              className="h-8 w-20"
              aria-label="Custom tip percent"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      {b !== null && tip !== null && total !== null ? (
        <Card>
          <CardContent className="flex flex-col gap-3 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tip amount</span>
              <span className="font-heading text-lg font-semibold">{money(tip)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-heading text-lg font-semibold">{money(total)}</span>
            </div>
            {p > 1 && (
              <div className={cn("flex items-center justify-between border-t border-border pt-3")}>
                <span className="text-sm font-medium">Per person ({p})</span>
                <span className="font-heading text-2xl font-semibold">{money(total / p)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Enter a bill amount to calculate the tip.</p>
      )}
    </div>
  );
}
