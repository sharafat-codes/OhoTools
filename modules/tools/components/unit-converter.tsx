"use client";

import * as React from "react";
import { ArrowRightLeftIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

// Each factor converts 1 unit -> base unit.
const FACTOR_CATEGORIES: Record<string, Record<string, number>> = {
  Length: {
    Meters: 1,
    Kilometers: 1000,
    Centimeters: 0.01,
    Millimeters: 0.001,
    Miles: 1609.344,
    Yards: 0.9144,
    Feet: 0.3048,
    Inches: 0.0254,
    "Nautical miles": 1852,
  },
  Mass: {
    Kilograms: 1,
    Grams: 0.001,
    Milligrams: 1e-6,
    "Metric tons": 1000,
    Pounds: 0.45359237,
    Ounces: 0.028349523125,
    Stones: 6.35029318,
  },
  Volume: {
    Liters: 1,
    Milliliters: 0.001,
    "Cubic meters": 1000,
    "Gallons (US)": 3.785411784,
    "Quarts (US)": 0.946352946,
    "Pints (US)": 0.473176473,
    "Cups (US)": 0.2365882365,
    "Fluid oz (US)": 0.0295735295625,
    Tablespoons: 0.0147867648,
    Teaspoons: 0.0049289216,
  },
  Area: {
    "Square meters": 1,
    "Square kilometers": 1e6,
    "Square centimeters": 1e-4,
    Hectares: 1e4,
    "Square miles": 2589988.110336,
    Acres: 4046.8564224,
    "Square yards": 0.83612736,
    "Square feet": 0.09290304,
    "Square inches": 0.00064516,
  },
  Speed: {
    "Meters/second": 1,
    "Kilometers/hour": 0.2777777778,
    "Miles/hour": 0.44704,
    Knots: 0.5144444444,
    "Feet/second": 0.3048,
  },
  "Digital storage": {
    Bytes: 1,
    Kilobytes: 1024,
    Megabytes: 1024 ** 2,
    Gigabytes: 1024 ** 3,
    Terabytes: 1024 ** 4,
    Bits: 1 / 8,
    Kilobits: 1024 / 8,
    Megabits: 1024 ** 2 / 8,
    Gigabits: 1024 ** 3 / 8,
  },
  Time: {
    Seconds: 1,
    Milliseconds: 0.001,
    Minutes: 60,
    Hours: 3600,
    Days: 86400,
    Weeks: 604800,
    Years: 31557600,
  },
};

const TEMP_UNITS = ["Celsius", "Fahrenheit", "Kelvin"];

function tempToBase(v: number, unit: string) {
  // base = Celsius
  if (unit === "Fahrenheit") return (v - 32) * (5 / 9);
  if (unit === "Kelvin") return v - 273.15;
  return v;
}
function tempFromBase(c: number, unit: string) {
  if (unit === "Fahrenheit") return c * (9 / 5) + 32;
  if (unit === "Kelvin") return c + 273.15;
  return c;
}

const CATEGORIES = [...Object.keys(FACTOR_CATEGORIES), "Temperature"];

function unitsFor(cat: string) {
  return cat === "Temperature" ? TEMP_UNITS : Object.keys(FACTOR_CATEGORIES[cat]);
}

function toBase(cat: string, v: number, unit: string) {
  return cat === "Temperature" ? tempToBase(v, unit) : v * FACTOR_CATEGORIES[cat][unit];
}
function fromBase(cat: string, base: number, unit: string) {
  return cat === "Temperature" ? tempFromBase(base, unit) : base / FACTOR_CATEGORIES[cat][unit];
}

function fmt(n: number) {
  if (!Number.isFinite(n)) return "—";
  if (n !== 0 && (Math.abs(n) < 1e-4 || Math.abs(n) >= 1e15)) return n.toExponential(4);
  return Number(n.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 8 });
}

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function UnitConverter() {
  const [cat, setCat] = React.useState("Length");
  const [value, setValue] = React.useState("1");
  const [from, setFrom] = React.useState("Meters");
  const [to, setTo] = React.useState("Feet");

  const units = unitsFor(cat);

  function onCat(next: string) {
    setCat(next);
    const u = unitsFor(next);
    setFrom(u[0]);
    setTo(u[1] ?? u[0]);
  }

  const parsed = parseFloat(value);
  const base = Number.isFinite(parsed) ? toBase(cat, parsed, from) : null;
  const result = base !== null ? fromBase(cat, base, to) : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="uc-cat">Category</Label>
        <select id="uc-cat" value={cat} onChange={(e) => onCat(e.target.value)} className={selectClass}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="uc-value">Value</Label>
          <Input id="uc-value" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass} aria-label="From unit">
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="icon-sm"
          className="mb-1 shrink-0 self-center sm:mb-2"
          aria-label="Swap units"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          <ArrowRightLeftIcon />
        </Button>

        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="uc-result">Result</Label>
          <div className="flex items-center gap-2">
            <Input id="uc-result" readOnly value={result !== null ? fmt(result) : "—"} className="flex-1 font-mono" />
            <CopyButton value={result !== null ? String(Number(result.toPrecision(8))) : ""} label="" />
          </div>
          <select value={to} onChange={(e) => setTo(e.target.value)} className={selectClass} aria-label="To unit">
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {base !== null && (
        <Card>
          <CardContent className="py-2">
            <div className="mb-2 text-xs text-muted-foreground">
              {fmt(parsed)} {from} in every {cat.toLowerCase()} unit
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
              {units.map((u) => (
                <div key={u} className="flex items-baseline justify-between gap-2 border-b border-border/40 py-1 text-sm last:border-0">
                  <span className="text-muted-foreground">{u}</span>
                  <span className="font-mono">{fmt(fromBase(cat, base, u))}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
