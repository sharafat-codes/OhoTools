"use client";

import * as React from "react";
import { parse, stringify } from "yaml";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

type Mode = "json2yaml" | "yaml2json";

const EXAMPLE_JSON = `{
  "name": "OhoTool",
  "version": 2,
  "features": ["qr", "barcode", "api"],
  "pricing": { "free": true, "pro": 9 }
}`;

export function JsonYaml() {
  const [mode, setMode] = React.useState<Mode>("json2yaml");
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
      if (m === "json2yaml") {
        setOutput(stringify(JSON.parse(text)));
      } else {
        setOutput(JSON.stringify(parse(text), null, 2));
      }
      setError(null);
    } catch (e) {
      setOutput("");
      setError((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex w-fit rounded-lg bg-muted p-0.5">
        {(
          [
            { id: "json2yaml", label: "JSON → YAML" },
            { id: "yaml2json", label: "YAML → JSON" },
          ] as { id: Mode; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setMode(t.id);
              convert(input, t.id);
            }}
            className={cn(
              "rounded-md px-3 py-1 text-sm font-medium transition-colors",
              mode === t.id ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          convert(e.target.value, mode);
        }}
        placeholder={mode === "json2yaml" ? "Paste JSON…" : "Paste YAML…"}
        rows={8}
        className="font-mono text-xs"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const sample =
              mode === "json2yaml" ? EXAMPLE_JSON : "name: OhoTool\nversion: 2\nfeatures:\n  - qr\n  - barcode\n  - api";
            setInput(sample);
            convert(sample, mode);
          }}
        >
          Try example
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
          Clear
        </Button>
      </div>

      {error && <p className="text-sm text-destructive break-words">{error}</p>}

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{mode === "json2yaml" ? "YAML" : "JSON"}</span>
              <CopyButton value={output} />
            </div>
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono">{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
