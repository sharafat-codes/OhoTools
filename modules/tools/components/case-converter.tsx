"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

function toWords(s: string) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const conversions: { label: string; fn: (s: string) => string }[] = [
  { label: "UPPERCASE", fn: (s) => s.toUpperCase() },
  { label: "lowercase", fn: (s) => s.toLowerCase() },
  {
    label: "Title Case",
    fn: (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  },
  {
    label: "Sentence case",
    fn: (s) =>
      s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
  },
  {
    label: "camelCase",
    fn: (s) =>
      toWords(s)
        .map((w, i) =>
          i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join(""),
  },
  { label: "snake_case", fn: (s) => toWords(s).map((w) => w.toLowerCase()).join("_") },
  { label: "kebab-case", fn: (s) => toWords(s).map((w) => w.toLowerCase()).join("-") },
];

export function CaseConverter() {
  const [text, setText] = React.useState("");

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to convert…"
        rows={4}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setText("Hello World from ToolPilot")}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
      </div>
      <div className="flex flex-col gap-2">
        {conversions.map((c) => {
          const result = text ? c.fn(text) : "";
          return (
            <Card key={c.label}>
              <CardContent className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className="truncate text-sm">
                    {result || <span className="text-muted-foreground">—</span>}
                  </div>
                </div>
                {result && <CopyButton value={result} label="" />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
