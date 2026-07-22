"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function WordCounter() {
  const [text, setText] = React.useState("");

  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(?:\s|$)/g)?.length ?? 0) : 0;
  const paragraphs = trimmed
    ? trimmed.split(/\n+/).filter((p) => p.trim()).length
    : 0;
  const readingTime = Math.max(words ? 1 : 0, Math.ceil(words / 200));

  const stats = [
    { label: "Words", value: words },
    { label: "Characters", value: characters },
    { label: "Characters (no spaces)", value: charactersNoSpaces },
    { label: "Sentences", value: sentences },
    { label: "Paragraphs", value: paragraphs },
    { label: "Reading time", value: `${readingTime} min` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing or paste your text…"
        rows={8}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setText("The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!")}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <div className="font-heading text-2xl font-semibold tabular-nums">
                {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
              </div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
