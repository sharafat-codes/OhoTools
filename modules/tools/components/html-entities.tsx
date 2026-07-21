"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

type Mode = "encode" | "decode";

function encodeEntities(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeEntities(s: string) {
  // A textarea decodes entities without executing markup.
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

export function HtmlEntities() {
  const [mode, setMode] = React.useState<Mode>("encode");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");

  function convert(text: string, m: Mode) {
    if (!text) {
      setOutput("");
      return;
    }
    setOutput(m === "encode" ? encodeEntities(text) : decodeEntities(text));
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
        placeholder={mode === "encode" ? '<div class="a">Tom & Jerry</div>' : "&lt;div&gt;Tom &amp; Jerry&lt;/div&gt;"}
        rows={5}
        className="font-mono text-xs"
      />

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
