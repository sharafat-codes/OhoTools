"use client";

import * as React from "react";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

export function JsonFormatter() {
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  function run(minify: boolean) {
    setOk(false);
    if (!input.trim()) {
      setError("Paste some JSON first.");
      setOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
      setError(null);
      setOk(true);
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"hello":"world","items":[1,2,3]}'
          rows={8}
          className="font-mono text-xs"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => run(false)}>Format</Button>
          <Button variant="outline" onClick={() => run(true)}>Minify</Button>
          <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError(null); setOk(false); }}>
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInput('{"name":"Ada Lovelace","age":36,"languages":["math","logic"],"active":true}')}>Try example</Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          <span>Invalid JSON: {error}</span>
        </div>
      )}

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-primary">
                <CheckCircle2Icon className="size-4" />
                Valid JSON
              </span>
              <CopyButton value={output} />
            </div>
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono">{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {ok && !output && (
        <p className="text-sm text-primary">Valid JSON.</p>
      )}
    </div>
  );
}
