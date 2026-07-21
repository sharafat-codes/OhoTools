"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const BASES = [
  { base: 2, label: "Binary", pattern: /^[01]+$/ },
  { base: 8, label: "Octal", pattern: /^[0-7]+$/ },
  { base: 10, label: "Decimal", pattern: /^[0-9]+$/ },
  { base: 16, label: "Hexadecimal", pattern: /^[0-9a-fA-F]+$/ },
];

export function NumberBase() {
  const [value, setValue] = React.useState("");
  const [base, setBase] = React.useState(10);

  const cfg = BASES.find((b) => b.base === base)!;
  const clean = value.trim().replace(/^0x/i, "").replace(/^0b/i, "");

  let results: { label: string; base: number; value: string }[] | null = null;
  let error: string | null = null;

  if (clean) {
    if (!cfg.pattern.test(clean)) {
      error = `Not a valid ${cfg.label.toLowerCase()} number.`;
    } else {
      const n = parseInt(clean, base);
      if (!Number.isSafeInteger(n)) {
        error = "Number is too large to convert precisely.";
      } else {
        results = BASES.map((b) => ({
          label: b.label,
          base: b.base,
          value: b.base === 16 ? n.toString(16).toUpperCase() : n.toString(b.base),
        }));
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="nb-value">Value</Label>
          <Input
            id="nb-value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
            className="font-mono"
          />
        </div>
        <div className="inline-flex rounded-lg bg-muted p-0.5">
          {BASES.map((b) => (
            <button
              key={b.base}
              onClick={() => setBase(b.base)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                base === b.base ? "bg-background shadow-sm" : "text-muted-foreground",
              )}
            >
              {b.label.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {results && (
        <div className="flex flex-col gap-2">
          {results.map((r) => (
            <Card key={r.base}>
              <CardContent className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">
                    {r.label} (base {r.base})
                  </div>
                  <code className="block truncate font-mono text-sm">{r.value}</code>
                </div>
                <CopyButton value={r.value} label="" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
