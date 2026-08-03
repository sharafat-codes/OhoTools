"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const SIDES = [4, 6, 8, 10, 12, 20];

// Pip layout for a standard six-sided die (positions on a 3×3 grid).
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Die({ value, sides }: { value: number; sides: number }) {
  if (sides === 6) {
    const on = new Set(PIPS[value] ?? []);
    return (
      <div className="grid size-14 grid-cols-3 grid-rows-3 gap-1 rounded-xl border border-border bg-card p-2 shadow-sm">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className={"size-2 self-center justify-self-center rounded-full " + (on.has(i) ? "bg-primary" : "bg-transparent")} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid size-14 place-items-center rounded-xl border border-border bg-card text-xl font-semibold text-primary shadow-sm">
      {value}
    </div>
  );
}

export function DiceRoller() {
  const [count, setCount] = React.useState(2);
  const [sides, setSides] = React.useState(6);
  const [rolls, setRolls] = React.useState<number[]>([]);
  const [rolling, setRolling] = React.useState(false);

  function roll() {
    if (rolling) return;
    setRolling(true);
    window.setTimeout(() => {
      setRolls(Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides)));
      setRolling(false);
    }, 300);
  }

  const total = rolls.reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dice-count">Number of dice</Label>
          <input
            id="dice-count"
            type="number"
            min={1}
            max={12}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
            className="w-28 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dice-sides">Sides</Label>
          <select
            id="dice-sides"
            value={sides}
            onChange={(e) => setSides(parseInt(e.target.value))}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {SIDES.map((s) => (
              <option key={s} value={s}>
                d{s}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={roll} disabled={rolling}>
          {rolling ? "Rolling…" : "Roll dice"}
        </Button>
      </div>

      {rolls.length > 0 && (
        <div className="flex flex-col gap-3 animate-in fade-in-0 duration-200">
          <div className="flex flex-wrap gap-2">
            {rolls.map((r, i) => (
              <Die key={i} value={r} sides={sides} />
            ))}
          </div>
          {rolls.length > 1 && (
            <p className="text-sm text-muted-foreground">
              Total: <span className="font-medium text-foreground">{total}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
