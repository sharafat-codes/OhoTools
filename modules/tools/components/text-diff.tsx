"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Op = { type: "equal" | "add" | "remove"; line: string };

function diffLines(a: string[], b: string[]): Op[] {
  const n = a.length;
  const m = b.length;
  // LCS length table
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: "equal", line: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", line: a[i] });
      i++;
    } else {
      ops.push({ type: "add", line: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ type: "remove", line: a[i++] });
  while (j < m) ops.push({ type: "add", line: b[j++] });
  return ops;
}

export function TextDiff() {
  const [left, setLeft] = React.useState("");
  const [right, setRight] = React.useState("");

  const show = left !== "" || right !== "";
  const ops = show ? diffLines(left.split("\n"), right.split("\n")) : [];
  const added = ops.filter((o) => o.type === "add").length;
  const removed = ops.filter((o) => o.type === "remove").length;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Textarea
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          placeholder="Original text…"
          rows={8}
          className="font-mono text-xs"
        />
        <Textarea
          value={right}
          onChange={(e) => setRight(e.target.value)}
          placeholder="Changed text…"
          rows={8}
          className="font-mono text-xs"
        />
      </div>

      {show && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-4 text-xs">
              <span className="text-primary">+{added} added</span>
              <span className="text-destructive">−{removed} removed</span>
            </div>
            <div className="overflow-x-auto rounded-lg bg-muted p-2 font-mono text-xs">
              {ops.map((op, i) => (
                <div
                  key={i}
                  className={cn(
                    "whitespace-pre-wrap px-1",
                    op.type === "add" && "bg-primary/15 text-foreground",
                    op.type === "remove" && "bg-destructive/15 text-foreground",
                    op.type === "equal" && "text-muted-foreground",
                  )}
                >
                  <span className="select-none text-muted-foreground">
                    {op.type === "add" ? "+ " : op.type === "remove" ? "− " : "  "}
                  </span>
                  {op.line || " "}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
