"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export function CoinFlip() {
  const [side, setSide] = React.useState<"Heads" | "Tails" | null>(null);
  const [flipping, setFlipping] = React.useState(false);
  const [counts, setCounts] = React.useState({ Heads: 0, Tails: 0 });

  function flip() {
    if (flipping) return;
    setFlipping(true);
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    window.setTimeout(() => {
      setSide(result);
      setCounts((c) => ({ ...c, [result]: c[result] + 1 }));
      setFlipping(false);
    }, 700);
  }

  const total = counts.Heads + counts.Tails;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div
        className={
          "grid size-32 place-items-center rounded-full border-4 border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 text-2xl font-semibold text-primary shadow-inner " +
          (flipping ? "animate-spin" : "")
        }
      >
        {flipping ? "…" : (side ?? "Flip")}
      </div>

      <Button onClick={flip} disabled={flipping} className="w-40">
        {flipping ? "Flipping…" : "Flip the coin"}
      </Button>

      {total > 0 && (
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span>
            Heads: <span className="font-medium text-foreground">{counts.Heads}</span>
          </span>
          <span>
            Tails: <span className="font-medium text-foreground">{counts.Tails}</span>
          </span>
          <span>
            Total: <span className="font-medium text-foreground">{total}</span>
          </span>
        </div>
      )}
    </div>
  );
}
