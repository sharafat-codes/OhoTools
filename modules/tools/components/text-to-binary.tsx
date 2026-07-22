"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

type Mode = "encode" | "decode";

function textToBinary(text: string) {
  return Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(bin: string) {
  const groups = bin.trim().split(/\s+/).filter(Boolean);
  const bytes = groups.map((g) => {
    if (!/^[01]{1,8}$/.test(g)) throw new Error("Each group must be 1–8 binary digits.");
    return parseInt(g, 2);
  });
  return new TextDecoder().decode(Uint8Array.from(bytes));
}

export function TextToBinary() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function convert(text: string, m: Mode) {
    if (!text.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      setOutput(m === "encode" ? textToBinary(text) : binaryToText(text));
      setError(null);
    } catch (e) {
      setOutput("");
      setError((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit rounded-lg bg-muted p-0.5 text-sm">
        {(
          [
            { k: "encode", label: "Text → Binary" },
            { k: "decode", label: "Binary → Text" },
          ] as const
        ).map((m) => (
          <button
            key={m.k}
            onClick={() => {
              setMode(m.k);
              convert(input, m.k);
            }}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              mode === m.k ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          convert(e.target.value, mode);
        }}
        placeholder={mode === "encode" ? "Hello" : "01001000 01101001"}
        rows={4}
        className="font-mono text-xs"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-end">
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
