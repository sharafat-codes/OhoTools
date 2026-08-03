"use client";

import * as React from "react";
import { ShuffleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RandomPicker() {
  const [text, setText] = React.useState("");
  const [removePicked, setRemovePicked] = React.useState(false);
  const [winner, setWinner] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<string[]>([]);

  const items = text.split("\n").map((s) => s.trim()).filter(Boolean);

  function pick() {
    if (items.length === 0) return;
    const idx = Math.floor(Math.random() * items.length);
    const chosen = items[idx];
    setWinner(chosen);
    setHistory((h) => [chosen, ...h].slice(0, 20));
    if (removePicked) {
      const lines = text.split("\n");
      // remove the first line that matches the chosen value
      const at = lines.findIndex((l) => l.trim() === chosen);
      if (at >= 0) {
        lines.splice(at, 1);
        setText(lines.join("\n"));
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="picker-items">Items (one per line)</Label>
        <Textarea
          id="picker-items"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Enter names or items, one per line…"}
          className="min-h-48 text-sm"
        />
        <p className="text-xs text-muted-foreground">{items.length} items</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={pick} disabled={items.length === 0} className="w-fit">
          <ShuffleIcon className="size-4" />
          Pick random
        </Button>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={removePicked}
            onChange={(e) => setRemovePicked(e.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
          Remove after picking (no repeats)
        </label>
      </div>

      {winner && (
        <div className="animate-in fade-in-0 zoom-in-95 flex flex-col items-center gap-1 rounded-2xl border border-primary/30 bg-primary/5 py-8 text-center duration-300">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Winner</div>
          <div className="font-heading text-3xl font-semibold text-primary">{winner}</div>
        </div>
      )}

      {history.length > 1 && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Recent:</span> {history.slice(0, 10).join(", ")}
        </div>
      )}
    </div>
  );
}
