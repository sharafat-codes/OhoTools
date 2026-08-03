"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

// Common English stop words to optionally exclude (useful for keyword-density /
// on-page SEO analysis, where filler words aren't meaningful keywords).
const STOP_WORDS = new Set(
  "a an and are as at be been being but by for from had has have he her his i if in into is it its me more most my no not of off on once only or other our out over own same she so some such than that the their them then there these they this those to too up very was we were what when where which who why will with you your".split(
    " ",
  ),
);

export function WordFrequency() {
  const [text, setText] = React.useState("");
  const [ignoreCase, setIgnoreCase] = React.useState(true);
  const [removeStop, setRemoveStop] = React.useState(false);
  const [minLen, setMinLen] = React.useState("1");

  const min = Math.max(parseInt(minLen) || 1, 1);

  const { rows, total } = React.useMemo(() => {
    const words = text.match(/[\p{L}\p{N}']+/gu) || [];
    const counts = new Map<string, number>();
    for (const raw of words) {
      const w = ignoreCase ? raw.toLowerCase() : raw;
      if (w.length < min) continue;
      if (removeStop && STOP_WORDS.has(w.toLowerCase())) continue;
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
    const rows = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    return { rows, total: words.length };
  }, [text, ignoreCase, min, removeStop]);

  const density = (c: number) => (total ? (c / total) * 100 : 0);
  const csv = "word,count,density%\n" + rows.map(([w, c]) => `${w},${c},${density(c).toFixed(2)}`).join("\n");
  const maxCount = rows[0]?.[1] ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="wf-text">Text</Label>
        <Textarea
          id="wf-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to analyze word frequency and keyword density…"
          className="min-h-32"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setText("the cat sat on the mat the cat ran after the dog the dog sat too")}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => setText("")}>Clear</Button>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} className="size-4 rounded border-input" />
          Ignore case
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={removeStop} onChange={(e) => setRemoveStop(e.target.checked)} className="size-4 rounded border-input" />
          Ignore common words
        </label>
        <label className="flex items-center gap-2">
          Min length
          <input
            type="number"
            min={1}
            value={minLen}
            onChange={(e) => setMinLen(e.target.value)}
            className="h-8 w-16 rounded-lg border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </label>
        <span className="text-muted-foreground">
          {total.toLocaleString()} words · {rows.length.toLocaleString()} unique
        </span>
      </div>

      {rows.length > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Frequency &amp; keyword density</span>
              <CopyButton value={csv} label="Copy CSV" />
            </div>
            <div className="max-h-80 overflow-y-auto">
              <div className="flex flex-col gap-1">
                {rows.slice(0, 200).map(([w, c]) => (
                  <div key={w} className="flex items-center gap-3 text-sm">
                    <span className="w-36 shrink-0 truncate font-mono">{w}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/80" style={{ width: `${(c / maxCount) * 100}%` }} />
                    </div>
                    <span className="w-14 shrink-0 text-right tabular-nums text-muted-foreground">{density(c).toFixed(1)}%</span>
                    <span className="w-10 shrink-0 text-right tabular-nums text-muted-foreground">{c}</span>
                  </div>
                ))}
              </div>
            </div>
            {rows.length > 200 && (
              <p className="mt-2 text-xs text-muted-foreground">Showing top 200 of {rows.length.toLocaleString()} words. Copy CSV for the full list.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
