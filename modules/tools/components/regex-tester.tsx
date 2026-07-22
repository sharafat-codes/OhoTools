"use client";

import * as React from "react";
import { AlertCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const FLAG_LIST = [
  { key: "g", label: "global" },
  { key: "i", label: "ignore case" },
  { key: "m", label: "multiline" },
  { key: "s", label: "dotall" },
] as const;

type FlagKey = (typeof FLAG_LIST)[number]["key"];

export function RegexTester() {
  const [pattern, setPattern] = React.useState("");
  const [text, setText] = React.useState("");
  const [flags, setFlags] = React.useState<Record<FlagKey, boolean>>({
    g: true,
    i: false,
    m: false,
    s: false,
  });

  const flagStr = FLAG_LIST.filter((f) => flags[f.key]).map((f) => f.key).join("");

  let error: string | null = null;
  const matches: { match: string; index: number; groups: string[] }[] = [];

  if (pattern) {
    try {
      const re = new RegExp(pattern, flagStr);
      if (text) {
        if (flags.g) {
          for (const m of text.matchAll(re)) {
            matches.push({ match: m[0], index: m.index ?? 0, groups: m.slice(1) });
          }
        } else {
          const m = re.exec(text);
          if (m) matches.push({ match: m[0], index: m.index ?? 0, groups: m.slice(1) });
        }
      }
    } catch (e) {
      error = (e as Error).message;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="re-pattern">Regular expression</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">/</span>
          <Input
            id="re-pattern"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\\b\\w+@\\w+\\.\\w+\\b"
            className="font-mono"
            aria-invalid={!!error}
          />
          <span className="text-muted-foreground">/{flagStr}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {FLAG_LIST.map((f) => (
          <label key={f.key} className="flex items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              checked={flags[f.key]}
              onChange={(e) => setFlags((s) => ({ ...s, [f.key]: e.target.checked }))}
              className="size-4 accent-primary"
            />
            <span className="font-mono">{f.key}</span>
            <span className="text-muted-foreground">{f.label}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="re-text">Test string</Label>
        <Textarea
          id="re-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Text to search…"
          rows={5}
          className="font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => { setPattern("\\w+@\\w+\\.\\w+"); setText("Contact ada@example.com or email the team at hello@toolpilot.dev."); }}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => { setPattern(""); setText(""); }}>Clear</Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {pattern && !error && (
        <Card>
          <CardContent className="flex flex-col gap-2">
            <span className={cn("text-sm", matches.length ? "text-primary" : "text-muted-foreground")}>
              {matches.length} match{matches.length === 1 ? "" : "es"}
            </span>
            {matches.map((m, i) => (
              <div key={i} className="rounded-lg bg-muted p-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <code className="font-mono break-all">{m.match || "(empty)"}</code>
                  <span className="ml-2 shrink-0 text-muted-foreground">@ {m.index}</span>
                </div>
                {m.groups.length > 0 && (
                  <div className="mt-1 text-muted-foreground">
                    {m.groups.map((g, gi) => (
                      <span key={gi} className="mr-2">
                        ${gi + 1}: <code className="font-mono">{g ?? "—"}</code>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
