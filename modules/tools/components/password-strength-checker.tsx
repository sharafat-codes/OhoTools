"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LEVELS = [
  { label: "Very weak", color: "bg-red-500", text: "text-red-500" },
  { label: "Weak", color: "bg-orange-500", text: "text-orange-500" },
  { label: "Fair", color: "bg-amber-500", text: "text-amber-500" },
  { label: "Strong", color: "bg-lime-500", text: "text-lime-500" },
  { label: "Very strong", color: "bg-emerald-500", text: "text-emerald-500" },
];

function charsetSize(pw: string) {
  let size = 0;
  if (/[a-z]/.test(pw)) size += 26;
  if (/[A-Z]/.test(pw)) size += 26;
  if (/[0-9]/.test(pw)) size += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) size += 33;
  return size;
}

function humanTime(seconds: number) {
  if (seconds < 1) return "instantly";
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [365, "day"],
    [100, "year"],
    [Infinity, "century"],
  ];
  let value = seconds;
  let name = "second";
  for (const [factor, label] of units) {
    if (value < factor) {
      name = label;
      break;
    }
    value /= factor;
    name = label;
  }
  const rounded = Math.round(value);
  if (rounded > 1000) return "thousands of years";
  return `${rounded.toLocaleString()} ${name}${rounded === 1 ? "" : "s"}`;
}

export function PasswordStrengthChecker() {
  const [pw, setPw] = React.useState("");
  const [show, setShow] = React.useState(false);

  const size = charsetSize(pw);
  const entropy = pw.length > 0 && size > 0 ? pw.length * Math.log2(size) : 0;

  let levelIdx = 0;
  if (entropy >= 128) levelIdx = 4;
  else if (entropy >= 60) levelIdx = 3;
  else if (entropy >= 40) levelIdx = 2;
  else if (entropy >= 28) levelIdx = 1;
  const level = LEVELS[levelIdx];

  // Offline fast attack: ~1e10 guesses/sec, average half the space.
  const seconds = pw ? Math.pow(2, entropy) / 1e10 / 2 : 0;

  const tips: string[] = [];
  if (pw && pw.length < 12) tips.push("Use at least 12–16 characters — length matters most.");
  if (pw && !/[A-Z]/.test(pw)) tips.push("Add uppercase letters.");
  if (pw && !/[0-9]/.test(pw)) tips.push("Add numbers.");
  if (pw && !/[^a-zA-Z0-9]/.test(pw)) tips.push("Add symbols.");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="psc">Password</Label>
        <div className="relative">
          <Input
            id="psc"
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Type or paste a password to test"
            className="pr-10 font-mono"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          </button>
        </div>
      </div>

      {pw && (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex h-2 gap-1">
              {LEVELS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-full transition-colors",
                    i <= levelIdx ? level.color : "bg-muted",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className={cn("font-medium", level.text)}>{level.label}</span>
              <span className="text-muted-foreground">{Math.round(entropy)} bits of entropy</span>
            </div>
          </div>

          <Card>
            <CardContent className="py-4">
              <div className="text-xs text-muted-foreground">Estimated time to crack (offline attack)</div>
              <div className="font-heading text-xl font-semibold">{humanTime(seconds)}</div>
            </CardContent>
          </Card>

          {tips.length > 0 && (
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </>
      )}

      <p className="text-xs text-muted-foreground">
        Your password is analyzed entirely in your browser and never sent anywhere. This is an
        estimate — real-world strength also depends on avoiding common words and reuse.
      </p>
    </div>
  );
}
