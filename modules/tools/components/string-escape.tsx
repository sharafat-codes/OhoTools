"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

type Mode = "escape" | "unescape";

function escapeStr(s: string) {
  // JSON.stringify handles quotes, backslashes, tabs, newlines, etc.
  return JSON.stringify(s).slice(1, -1);
}
function unescapeStr(s: string) {
  return JSON.parse(`"${s.replace(/"/g, '\\"')}"`) as string;
}

export function StringEscape() {
  const [mode, setMode] = React.useState<Mode>("escape");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function convert(text: string, m: Mode) {
    if (!text) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      setOutput(m === "escape" ? escapeStr(text) : unescapeStr(text));
      setError(null);
    } catch {
      setOutput("");
      setError("That isn't a valid escaped string.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit rounded-lg bg-muted p-0.5 text-sm">
        {(["escape", "unescape"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              convert(input, m);
            }}
            className={cn(
              "rounded-md px-3 py-1 font-medium capitalize transition-colors",
              mode === m ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <Textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          convert(e.target.value, mode);
        }}
        placeholder={mode === "escape" ? 'She said "hi"\nnext line' : 'She said \\"hi\\"\\nnext line'}
        rows={4}
        className="font-mono text-xs"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm capitalize text-muted-foreground">{mode}d</span>
              <CopyButton value={output} />
            </div>
            <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono break-all whitespace-pre-wrap">{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
