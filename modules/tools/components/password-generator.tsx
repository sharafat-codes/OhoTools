"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SliderField } from "@/components/slider-field";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const SETS: Record<string, string> = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  number: "0123456789",
  symbol: "!@#$%^&*()-_=+[]{};:,.<>?",
};

const OPTION_LABELS: Record<string, string> = {
  lower: "Lowercase (a-z)",
  upper: "Uppercase (A-Z)",
  number: "Numbers (0-9)",
  symbol: "Symbols (!@#…)",
};

export function PasswordGenerator() {
  const [length, setLength] = React.useState(16);
  const [opts, setOpts] = React.useState({
    lower: true,
    upper: true,
    number: true,
    symbol: true,
  });
  const [password, setPassword] = React.useState("");

  function generate() {
    const pool = Object.entries(opts)
      .filter(([, on]) => on)
      .map(([k]) => SETS[k])
      .join("");
    if (!pool) {
      setPassword("");
      return;
    }
    const random = new Uint32Array(length);
    crypto.getRandomValues(random);
    let out = "";
    for (let i = 0; i < length; i++) out += pool[random[i] % pool.length];
    setPassword(out);
  }

  const activeSets = Object.values(opts).filter(Boolean).length;
  const strength =
    length >= 16 && activeSets >= 3
      ? { label: "Strong", cls: "bg-primary", w: "100%" }
      : length >= 12 && activeSets >= 2
        ? { label: "Good", cls: "bg-primary/70", w: "66%" }
        : { label: "Weak", cls: "bg-destructive", w: "33%" };

  return (
    <div className="flex flex-col gap-5">
      {password && (
        <Card>
          <CardContent className="flex items-center justify-between gap-2">
            <code className="truncate font-mono text-base">{password}</code>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-sm" onClick={generate} aria-label="Regenerate">
                <RefreshCwIcon />
              </Button>
              <CopyButton value={password} />
            </div>
          </CardContent>
        </Card>
      )}

      <SliderField label="Length" value={length} min={6} max={64} step={1} onChange={setLength} />

      <div className="grid gap-2 sm:grid-cols-2">
        {(Object.keys(SETS) as (keyof typeof opts)[]).map((key) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm"
          >
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
              className="size-4 accent-primary"
            />
            {OPTION_LABELS[key]}
          </label>
        ))}
      </div>

      {password && (
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full", strength.cls)} style={{ width: strength.w }} />
          </div>
          <span className="text-xs text-muted-foreground">{strength.label}</span>
        </div>
      )}

      <Button onClick={generate} disabled={activeSets === 0} className="w-fit">
        <RefreshCwIcon />
        Generate password
      </Button>
      {activeSets === 0 && (
        <p className="text-xs text-destructive">Select at least one character set.</p>
      )}
    </div>
  );
}
