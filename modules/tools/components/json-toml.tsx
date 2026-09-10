"use client";

import * as React from "react";
import { parse, stringify } from "smol-toml";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function jsonToToml(input: string): { out: string; error?: string } {
  const t = input.trim();
  if (!t) return { out: "" };
  let obj: unknown;
  try {
    obj = JSON.parse(t);
  } catch (e) {
    return { out: "", error: `Invalid JSON — ${(e as Error).message}` };
  }
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return { out: "", error: "TOML needs a top-level object (a table). Wrap arrays or values in an object first." };
  }
  try {
    return { out: stringify(obj as Record<string, unknown>) };
  } catch (e) {
    return { out: "", error: `Could not convert to TOML — ${(e as Error).message}` };
  }
}

function tomlToJson(input: string): { out: string; error?: string } {
  const t = input.trim();
  if (!t) return { out: "" };
  try {
    return { out: JSON.stringify(parse(t), null, 2) };
  } catch (e) {
    return { out: "", error: `Invalid TOML — ${(e as Error).message}` };
  }
}

function Pane({
  from,
  to,
  placeholder,
  convert,
  sample,
}: {
  from: string;
  to: string;
  placeholder: string;
  convert: (v: string) => { out: string; error?: string };
  sample: string;
}) {
  const [input, setInput] = React.useState(sample);
  const res = React.useMemo(() => convert(input), [input, convert]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label>{from}</Label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="min-h-72 font-mono text-xs"
        />
        {res.error && <p className="text-sm text-destructive">{res.error}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>{to}</Label>
          {res.out && <CopyButton value={res.out} label="" />}
        </div>
        <pre className="min-h-72 min-w-0 overflow-auto rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed">
          <code className="font-mono">{res.out || "—"}</code>
        </pre>
      </div>
    </div>
  );
}

const JSON_SAMPLE = `{
  "title": "OhoTool",
  "owner": { "name": "Alex", "active": true },
  "ports": [8000, 8001],
  "database": { "server": "192.168.1.1", "enabled": true }
}`;

const TOML_SAMPLE = `title = "OhoTool"

[owner]
name = "Alex"
active = true

[database]
server = "192.168.1.1"
enabled = true`;

export function JsonToml() {
  return (
    <Tabs defaultValue="json-toml" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="json-toml">JSON → TOML</TabsTrigger>
        <TabsTrigger value="toml-json">TOML → JSON</TabsTrigger>
      </TabsList>
      <TabsContent value="json-toml" className="mt-4">
        <Pane from="JSON" to="TOML" placeholder='{ "key": "value" }' convert={jsonToToml} sample={JSON_SAMPLE} />
      </TabsContent>
      <TabsContent value="toml-json" className="mt-4">
        <Pane from="TOML" to="JSON" placeholder='key = "value"' convert={tomlToJson} sample={TOML_SAMPLE} />
      </TabsContent>
    </Tabs>
  );
}
