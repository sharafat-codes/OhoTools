"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}
function fmt(n: number) {
  return Number(n.toFixed(4)).toString();
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-heading text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function PxRemConverter() {
  const [base, setBase] = React.useState("16");
  const [px, setPx] = React.useState("24");
  const [rem, setRem] = React.useState("1.5");

  const b = num(base) && num(base)! > 0 ? num(base)! : 16;
  const pxVal = num(px);
  const remVal = num(rem);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex max-w-xs flex-col gap-1.5">
        <Label htmlFor="base">Root font size (px)</Label>
        <Input id="base" type="number" value={base} onChange={(e) => setBase(e.target.value)} />
        <p className="text-xs text-muted-foreground">Browsers default to 16px. 1rem = this value.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="px">Pixels (px)</Label>
            <Input id="px" type="number" value={px} onChange={(e) => setPx(e.target.value)} />
          </div>
          <Result label="in rem" value={pxVal !== null ? `${fmt(pxVal / b)} rem` : "—"} />
          <Result label="in em" value={pxVal !== null ? `${fmt(pxVal / b)} em` : "—"} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rem">rem</Label>
            <Input id="rem" type="number" value={rem} onChange={(e) => setRem(e.target.value)} />
          </div>
          <Result label="in pixels" value={remVal !== null ? `${fmt(remVal * b)} px` : "—"} />
        </div>
      </div>
    </div>
  );
}
