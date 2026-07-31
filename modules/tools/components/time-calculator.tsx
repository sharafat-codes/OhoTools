"use client";

import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function num(v: string) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

function fmt(totalSeconds: number) {
  const neg = totalSeconds < 0;
  let s = Math.abs(Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  return `${neg ? "−" : ""}${h}h ${m}m ${s}s`;
}

const fieldClass =
  "h-9 w-20 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type HMS = { h: string; m: string; s: string };
const zero: HMS = { h: "", m: "", s: "" };

function Row({ value, onChange, label }: { value: HMS; onChange: (v: HMS) => void; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input type="number" inputMode="numeric" placeholder="0" aria-label={`${label} hours`} className={fieldClass} value={value.h} onChange={(e) => onChange({ ...value, h: e.target.value })} />
        <span className="text-sm text-muted-foreground">h</span>
        <input type="number" inputMode="numeric" placeholder="0" aria-label={`${label} minutes`} className={fieldClass} value={value.m} onChange={(e) => onChange({ ...value, m: e.target.value })} />
        <span className="text-sm text-muted-foreground">m</span>
        <input type="number" inputMode="numeric" placeholder="0" aria-label={`${label} seconds`} className={fieldClass} value={value.s} onChange={(e) => onChange({ ...value, s: e.target.value })} />
        <span className="text-sm text-muted-foreground">s</span>
      </div>
    </div>
  );
}

function secondsOf(v: HMS) {
  return num(v.h) * 3600 + num(v.m) * 60 + num(v.s);
}

function AddSubtract() {
  const [a, setA] = React.useState<HMS>(zero);
  const [b, setB] = React.useState<HMS>(zero);
  const [op, setOp] = React.useState<"+" | "-">("+");
  const total = op === "+" ? secondsOf(a) + secondsOf(b) : secondsOf(a) - secondsOf(b);

  return (
    <div className="flex flex-col gap-5 pt-4">
      <Row value={a} onChange={setA} label="Time A" />
      <div className="flex gap-2">
        {(["+", "-"] as const).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOp(o)}
            className={
              "size-9 rounded-lg border text-sm font-medium transition-colors " +
              (op === o ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/40")
            }
          >
            {o === "+" ? "+" : "−"}
          </button>
        ))}
      </div>
      <Row value={b} onChange={setB} label="Time B" />
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="text-sm text-muted-foreground">Result</div>
        <div className="font-heading text-2xl font-semibold tabular-nums">{fmt(total)}</div>
      </div>
    </div>
  );
}

function Duration() {
  const [start, setStart] = React.useState("09:00");
  const [end, setEnd] = React.useState("17:30");

  const parse = (t: string) => {
    const [h, m] = t.split(":").map((x) => parseInt(x, 10));
    if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
    return h * 3600 + m * 60;
  };
  const s = parse(start);
  const e = parse(end);
  let total: number | null = null;
  if (s !== null && e !== null) {
    total = e - s;
    if (total < 0) total += 24 * 3600; // across midnight
  }

  return (
    <div className="flex flex-col gap-5 pt-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dur-start">Start time</Label>
          <Input id="dur-start" type="time" value={start} onChange={(ev) => setStart(ev.target.value)} className="w-40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dur-end">End time</Label>
          <Input id="dur-end" type="time" value={end} onChange={(ev) => setEnd(ev.target.value)} className="w-40" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="text-sm text-muted-foreground">Duration</div>
        <div className="font-heading text-2xl font-semibold tabular-nums">
          {total === null ? "—" : fmt(total)}
        </div>
      </div>
    </div>
  );
}

export function TimeCalculator() {
  return (
    <Tabs defaultValue="add">
      <TabsList>
        <TabsTrigger value="add">Add / Subtract</TabsTrigger>
        <TabsTrigger value="duration">Duration</TabsTrigger>
      </TabsList>
      <TabsContent value="add">
        <AddSubtract />
      </TabsContent>
      <TabsContent value="duration">
        <Duration />
      </TabsContent>
    </Tabs>
  );
}
