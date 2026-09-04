"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALES = ["", "thousand", "million", "billion", "trillion"];

function threeDigits(n: number): string {
  const parts: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  if (hundreds) parts.push(`${ONES[hundreds]} hundred`);
  if (rest) {
    if (rest < 20) parts.push(ONES[rest]);
    else {
      const t = Math.floor(rest / 10);
      const o = rest % 10;
      parts.push(o ? `${TENS[t]}-${ONES[o]}` : TENS[t]);
    }
  }
  return parts.join(" ");
}

function intToWords(n: number): string {
  if (n === 0) return "zero";
  const groups: number[] = [];
  let x = n;
  while (x > 0) {
    groups.push(x % 1000);
    x = Math.floor(x / 1000);
  }
  const words: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    words.push(threeDigits(groups[i]) + (SCALES[i] ? ` ${SCALES[i]}` : ""));
  }
  return words.join(" ");
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toWords(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === "") return "";
  const neg = trimmed.startsWith("-");
  const clean = trimmed.replace(/,/g, "").replace(/^[-+]/, "");
  if (!/^\d+(\.\d+)?$/.test(clean)) return "";
  const [intPart, decPart] = clean.split(".");
  const intN = Math.min(Number(intPart), 999_999_999_999_999);
  let out = intToWords(intN);
  if (decPart && /[1-9]/.test(decPart)) {
    const digits = decPart.split("").map((d) => ONES[Number(d)]).join(" ");
    out += ` point ${digits}`;
  }
  return (neg ? "negative " : "") + out;
}

function toCurrency(raw: string): string {
  const trimmed = raw.trim().replace(/,/g, "").replace(/^[-+]/, "");
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return "";
  const [intPart, decPartRaw = ""] = trimmed.split(".");
  const cents = Number((decPartRaw + "00").slice(0, 2));
  const dollars = Math.min(Number(intPart), 999_999_999_999_999);
  const dWord = `${cap(intToWords(dollars))} dollar${dollars === 1 ? "" : "s"}`;
  const cWord = cents ? ` and ${intToWords(cents)} cent${cents === 1 ? "" : "s"}` : "";
  return `${dWord}${cWord}`;
}

function Output({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-3 py-4">
        <p className="font-heading text-lg font-medium leading-snug">{value || "—"}</p>
        {value && (
          <Button variant="outline" size="sm" onClick={copy} className="shrink-0">
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function NumberToWords() {
  const [value, setValue] = React.useState("1234.56");

  return (
    <Tabs defaultValue="words" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="words">Words</TabsTrigger>
        <TabsTrigger value="currency">Currency (USD)</TabsTrigger>
      </TabsList>

      <div className="mt-4 flex flex-col gap-1.5">
        <Label htmlFor="ntw">Number</Label>
        <Input id="ntw" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 1234.56" />
      </div>

      <TabsContent value="words" className="mt-4">
        <Output value={cap(toWords(value))} />
      </TabsContent>
      <TabsContent value="currency" className="mt-4">
        <Output value={toCurrency(value)} />
      </TabsContent>
    </Tabs>
  );
}
