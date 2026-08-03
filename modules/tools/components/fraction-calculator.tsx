"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

const OPS = ["+", "−", "×", "÷"] as const;

function toInt(v: string): number | null {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

export function FractionCalculator() {
  const [n1, setN1] = React.useState("1");
  const [d1, setD1] = React.useState("2");
  const [op, setOp] = React.useState<(typeof OPS)[number]>("+");
  const [n2, setN2] = React.useState("1");
  const [d2, setD2] = React.useState("3");

  const a = toInt(n1);
  const b = toInt(d1);
  const c = toInt(n2);
  const e = toInt(d2);

  let result: { num: number; den: number } | null = null;
  let errorMsg: string | null = null;

  if (a !== null && b !== null && c !== null && e !== null) {
    if (b === 0 || e === 0) {
      errorMsg = "Denominators can't be zero.";
    } else {
      let num = 0;
      let den = 1;
      if (op === "+") {
        num = a * e + c * b;
        den = b * e;
      } else if (op === "−") {
        num = a * e - c * b;
        den = b * e;
      } else if (op === "×") {
        num = a * c;
        den = b * e;
      } else {
        // ÷
        if (c === 0) {
          errorMsg = "Can't divide by a fraction equal to zero.";
        } else {
          num = a * e;
          den = b * c;
        }
      }
      if (!errorMsg) {
        if (den < 0) {
          num = -num;
          den = -den;
        }
        const g = gcd(num, den);
        result = { num: num / g, den: den / g };
      }
    }
  }

  const decimal = result ? result.num / result.den : null;
  const whole = result ? Math.trunc(result.num / result.den) : 0;
  const remainder = result ? Math.abs(result.num % result.den) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Fraction top={n1} bottom={d1} onTop={setN1} onBottom={setD1} idBase="f1" />
        <select
          value={op}
          onChange={(ev) => setOp(ev.target.value as (typeof OPS)[number])}
          aria-label="Operation"
          className="rounded-lg border border-border bg-background px-3 py-2 text-lg"
        >
          {OPS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <Fraction top={n2} bottom={d2} onTop={setN2} onBottom={setD2} idBase="f2" />
      </div>

      {errorMsg ? (
        <p className="text-center text-sm text-destructive">{errorMsg}</p>
      ) : result ? (
        <Card className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
          <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
            <div className="text-sm text-muted-foreground">Result</div>
            <div className="flex items-center gap-3 font-heading text-3xl font-semibold">
              {result.den === 1 ? (
                <span>{result.num}</span>
              ) : (
                <span className="inline-flex flex-col items-center leading-none">
                  <span>{result.num}</span>
                  <span className="my-1 h-px w-full bg-foreground" />
                  <span>{result.den}</span>
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              = {decimal!.toFixed(4).replace(/\.?0+$/, "")}
              {result.den !== 1 && Math.abs(result.num) > result.den && (
                <>
                  {" "}
                  · {whole} {remainder}/{result.den}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-center text-sm text-muted-foreground">Enter two fractions to calculate.</p>
      )}
    </div>
  );
}

function Fraction({
  top,
  bottom,
  onTop,
  onBottom,
  idBase,
}: {
  top: string;
  bottom: string;
  onTop: (v: string) => void;
  onBottom: (v: string) => void;
  idBase: string;
}) {
  return (
    <div className="flex w-20 flex-col items-center gap-1">
      <Input id={`${idBase}-n`} type="number" value={top} onChange={(e) => onTop(e.target.value)} className="text-center" aria-label="Numerator" />
      <span className="h-px w-full bg-border" />
      <Input id={`${idBase}-d`} type="number" value={bottom} onChange={(e) => onBottom(e.target.value)} className="text-center" aria-label="Denominator" />
    </div>
  );
}
