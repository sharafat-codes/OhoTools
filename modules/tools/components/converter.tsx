"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeftRightIcon, CheckIcon, CopyIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ConversionView } from "@/modules/tools/conversions";

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "";
  const abs = Math.abs(n);
  let s = abs !== 0 && (abs < 1e-4 || abs >= 1e9) ? n.toExponential(4) : n.toPrecision(6);
  if (s.includes(".") && !s.includes("e")) s = s.replace(/\.?0+$/, "");
  return s;
}

function toCelsius(v: number, key: "c" | "f" | "k"): number {
  if (key === "c") return v;
  if (key === "f") return (v - 32) * (5 / 9);
  return v - 273.15;
}
function fromCelsius(c: number, key: "c" | "f" | "k"): number {
  if (key === "c") return c;
  if (key === "f") return c * (9 / 5) + 32;
  return c + 273.15;
}

export function Converter({ view }: { view: ConversionView }) {
  // Forward: from → to. Backward: to → from. Works for both linear and temp.
  const fwd = React.useCallback(
    (v: number) => (view.kind === "temp" ? fromCelsius(toCelsius(v, view.temp!.from), view.temp!.to) : v * view.factor!),
    [view],
  );
  const bwd = React.useCallback(
    (v: number) => (view.kind === "temp" ? fromCelsius(toCelsius(v, view.temp!.to), view.temp!.from) : v / view.factor!),
    [view],
  );

  const [from, setFrom] = React.useState(String(view.defaultValue));
  const [to, setTo] = React.useState(fmt(fwd(view.defaultValue)));
  const [copied, setCopied] = React.useState(false);

  function onFrom(raw: string) {
    setFrom(raw);
    const n = parseFloat(raw);
    setTo(raw.trim() === "" || !Number.isFinite(n) ? "" : fmt(fwd(n)));
  }
  function onTo(raw: string) {
    setTo(raw);
    const n = parseFloat(raw);
    setFrom(raw.trim() === "" || !Number.isFinite(n) ? "" : fmt(bwd(n)));
  }

  async function copyResult() {
    if (!to) return;
    try {
      await navigator.clipboard.writeText(to);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="from">{view.from.name}</Label>
          <div className="relative">
            <Input
              id="from"
              type="number"
              inputMode="decimal"
              value={from}
              onChange={(e) => onFrom(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              className="pr-14"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
              {view.from.symbol}
            </span>
          </div>
        </div>

        {/* Swap → jump to the reverse-direction page */}
        <div className="flex justify-center pb-1">
          {view.reverseSlug ? (
            <Button
              variant="outline"
              size="icon"
              title={`Swap — convert ${view.to.name} to ${view.from.name}`}
              aria-label={`Swap to convert ${view.to.name} to ${view.from.name}`}
              render={<Link href={`/tools/${view.reverseSlug}`} />}
            >
              <ArrowLeftRightIcon />
            </Button>
          ) : (
            <span className="pb-1.5 text-muted-foreground" aria-hidden>
              <ArrowLeftRightIcon className="size-5" />
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="to">{view.to.name}</Label>
          <div className="relative">
            <Input
              id="to"
              type="number"
              inputMode="decimal"
              value={to}
              onChange={(e) => onTo(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              className="pr-20"
            />
            <span className="pointer-events-none absolute inset-y-0 right-10 flex items-center text-sm text-muted-foreground">
              {view.to.symbol}
            </span>
            <button
              type="button"
              onClick={copyResult}
              title="Copy result"
              aria-label="Copy result"
              className="absolute inset-y-0 right-1.5 my-1 flex items-center rounded-md px-2 text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-90"
            >
              {copied ? <CheckIcon className="size-4 text-emerald-500" /> : <CopyIcon className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="py-4 text-center">
          <div className="text-sm text-muted-foreground">Formula</div>
          <div className="font-heading text-lg font-medium">{view.formula}</div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
              <th className="px-4 py-2 font-medium">{view.from.name}</th>
              <th className="px-4 py-2 font-medium">{view.to.name}</th>
            </tr>
          </thead>
          <tbody>
            {view.table.map((row) => {
              const active = parseFloat(from) === row.from;
              return (
                <tr
                  key={row.from}
                  onClick={() => onFrom(String(row.from))}
                  className={
                    "cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/50 " +
                    (active ? "bg-primary/5" : "")
                  }
                >
                  <td className="px-4 py-2">
                    {fmt(row.from)} {view.from.symbol}
                  </td>
                  <td className="px-4 py-2">
                    {fmt(row.to)} {view.to.symbol}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: type in either box to convert both ways, tap a row to reuse it, or use the copy button. Runs entirely in your
        browser — nothing is uploaded.
      </p>
    </div>
  );
}
