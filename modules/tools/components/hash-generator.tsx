"use client";

import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function HashGenerator() {
  const [text, setText] = React.useState("");
  const [hashes, setHashes] = React.useState<Record<string, string>>({});

  async function compute(value: string) {
    if (!value) {
      setHashes({});
      return;
    }
    const data = new TextEncoder().encode(value);
    const out: Record<string, string> = {};
    for (const algo of ALGOS) {
      out[algo] = toHex(await crypto.subtle.digest(algo, data));
    }
    setHashes(out);
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          void compute(e.target.value);
        }}
        placeholder="Text to hash…"
        rows={4}
      />

      {ALGOS.map((algo) => (
        <Card key={algo}>
          <CardContent className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">{algo}</div>
              <code className="block truncate font-mono text-xs">
                {hashes[algo] || <span className="text-muted-foreground">—</span>}
              </code>
            </div>
            {hashes[algo] && <CopyButton value={hashes[algo]} label="" />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
