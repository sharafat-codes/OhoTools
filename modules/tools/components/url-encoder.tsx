"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

type Mode = "encode" | "decode";

export function UrlEncoder() {
  const [mode, setMode] = React.useState<Mode>("encode");
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
      setOutput(m === "encode" ? encodeURIComponent(text) : decodeURIComponent(text));
      setError(null);
    } catch {
      setOutput("");
      setError("That isn't valid percent-encoded text.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit rounded-lg bg-muted p-0.5">
        {(["encode", "decode"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              convert(input, m);
            }}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors",
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
        placeholder={mode === "encode" ? "https://example.com/?q=a b&x=1" : "https%3A%2F%2Fexample.com"}
        rows={4}
        className="font-mono text-xs"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => { const s = "https://example.com/search?q=hello world&lang=en"; setInput(s); convert(s, mode); }}>Try example</Button>
        <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); setError(null); }}>Clear</Button>
      </div>

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
