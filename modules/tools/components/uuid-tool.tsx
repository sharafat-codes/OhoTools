"use client";

import * as React from "react";
import { RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

export function UuidTool() {
  const [count, setCount] = React.useState(5);
  const [uuids, setUuids] = React.useState<string[]>([]);

  function generate() {
    const n = Math.min(50, Math.max(1, count));
    setUuids(Array.from({ length: n }, () => crypto.randomUUID()));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="uuid-count">How many?</Label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-8 w-24 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <Button onClick={generate}>
          <RefreshCwIcon />
          Generate
        </Button>
      </div>

      {uuids.length > 0 && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {uuids.length} UUID{uuids.length === 1 ? "" : "s"}
              </span>
              <CopyButton value={uuids.join("\n")} label="Copy all" />
            </div>
            <div className="flex flex-col divide-y divide-border rounded-lg bg-muted">
              {uuids.map((u) => (
                <div key={u} className="flex items-center justify-between gap-2 px-3 py-2">
                  <code className="truncate font-mono text-xs">{u}</code>
                  <CopyButton value={u} label="" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
