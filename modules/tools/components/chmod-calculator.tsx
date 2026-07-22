"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const ROLES = ["Owner", "Group", "Others"] as const;
const BITS = [
  { label: "Read", value: 4 },
  { label: "Write", value: 2 },
  { label: "Execute", value: 1 },
] as const;

function symbolFor(d: number) {
  return (d & 4 ? "r" : "-") + (d & 2 ? "w" : "-") + (d & 1 ? "x" : "-");
}

export function ChmodCalculator() {
  const [digits, setDigits] = React.useState<[number, number, number]>([7, 5, 5]);

  const octal = digits.join("");
  const symbolic = digits.map(symbolFor).join("");

  function toggle(roleIdx: number, bit: number, checked: boolean) {
    setDigits((prev) => {
      const next = [...prev] as [number, number, number];
      next[roleIdx] = checked ? next[roleIdx] | bit : next[roleIdx] & ~bit;
      return next;
    });
  }

  function setOctal(value: string) {
    const clean = value.replace(/[^0-7]/g, "").slice(0, 3);
    if (clean.length === 3) {
      setDigits([Number(clean[0]), Number(clean[1]), Number(clean[2])]);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left">
              <th className="p-2.5 font-medium"></th>
              {BITS.map((b) => (
                <th key={b.value} className="p-2.5 text-center font-medium">{b.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role, roleIdx) => (
              <tr key={role} className="border-b border-border last:border-0">
                <td className="p-2.5 font-medium">{role}</td>
                {BITS.map((b) => (
                  <td key={b.value} className="p-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={(digits[roleIdx] & b.value) !== 0}
                      onChange={(e) => toggle(roleIdx, b.value, e.target.checked)}
                      className="size-4 accent-primary"
                      aria-label={`${role} ${b.label}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="octal" className="text-sm font-medium">Octal</label>
          <Input
            id="octal"
            value={octal}
            onChange={(e) => setOctal(e.target.value)}
            className="w-24 font-mono text-lg"
            inputMode="numeric"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Symbolic</span>
          <code className="font-mono text-lg">{symbolic}</code>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-3">
          <code className="font-mono text-sm">chmod {octal} filename</code>
          <CopyButton value={`chmod ${octal} filename`} label="" />
        </CardContent>
      </Card>
    </div>
  );
}
