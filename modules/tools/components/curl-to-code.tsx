"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Parsed = { url: string; method: string; headers: [string, string][]; data?: string };

// Tokenize a shell-style curl command, respecting single/double quotes and
// backslash line continuations. Good enough for the vast majority of pasted
// curl commands (not a full shell parser).
function tokenize(input: string): string[] {
  const s = input.replace(/\\\r?\n/g, " ").trim();
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++;
    if (i >= s.length) break;
    let tok = "";
    while (i < s.length && !/\s/.test(s[i])) {
      const c = s[i];
      if (c === "'" || c === '"') {
        i++;
        while (i < s.length && s[i] !== c) tok += s[i++];
        i++; // closing quote
      } else {
        tok += c;
        i++;
      }
    }
    tokens.push(tok);
  }
  return tokens;
}

function parseCurl(input: string): Parsed | null {
  const toks = tokenize(input);
  if (!toks.length) return null;
  let start = 0;
  if (toks[0] === "curl") start = 1;

  const p: Parsed = { url: "", method: "", headers: [] };
  for (let i = start; i < toks.length; i++) {
    const t = toks[i];
    if (t === "-X" || t === "--request") p.method = (toks[++i] ?? "").toUpperCase();
    else if (t === "-H" || t === "--header") {
      const h = toks[++i] ?? "";
      const ci = h.indexOf(":");
      if (ci > 0) p.headers.push([h.slice(0, ci).trim(), h.slice(ci + 1).trim()]);
    } else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary" || t === "--data-ascii") {
      p.data = toks[++i] ?? "";
    } else if (t === "--url") p.url = toks[++i] ?? "";
    else if (t.startsWith("-")) {
      /* ignore other flags (some take a value, but we keep it simple) */
    } else if (!p.url) p.url = t;
  }
  if (!p.method) p.method = p.data != null ? "POST" : "GET";
  return p.url ? p : null;
}

const s = (v: string) => JSON.stringify(v);

function toFetch(p: Parsed): string {
  let out = `fetch(${s(p.url)}, {\n  method: ${s(p.method)},`;
  if (p.headers.length) {
    const h = p.headers.map(([k, v]) => `    ${s(k)}: ${s(v)}`).join(",\n");
    out += `\n  headers: {\n${h}\n  },`;
  }
  if (p.data != null) out += `\n  body: ${s(p.data)},`;
  out += `\n})\n  .then((res) => res.json())\n  .then((data) => console.log(data));`;
  return out;
}

function toPython(p: Parsed): string {
  let out = `import requests\n\nurl = ${s(p.url)}\n`;
  if (p.headers.length) {
    const h = p.headers.map(([k, v]) => `    ${s(k)}: ${s(v)}`).join(",\n");
    out += `headers = {\n${h}\n}\n`;
  }
  if (p.data != null) out += `data = ${s(p.data)}\n`;
  out += `\nresponse = requests.request(${s(p.method)}, url`;
  if (p.headers.length) out += `, headers=headers`;
  if (p.data != null) out += `, data=data`;
  out += `)\nprint(response.json())`;
  return out;
}

function Output({ code }: { code: string }) {
  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <CopyButton value={code} label="" />
      </div>
      <pre className="min-w-0 overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

export function CurlToCode() {
  const [input, setInput] = React.useState(
    `curl -X POST "https://api.example.com/users" -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"name":"Alex"}'`,
  );

  const parsed = React.useMemo(() => parseCurl(input), [input]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="curl-in">Paste your cURL command</Label>
        <Textarea
          id="curl-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="curl -X POST https://api.example.com …"
          className="min-h-28 font-mono text-xs"
        />
      </div>

      {!parsed ? (
        <p className="text-sm text-muted-foreground">Paste a valid cURL command with a URL to generate code.</p>
      ) : (
        <Tabs defaultValue="js" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="js">JavaScript (fetch)</TabsTrigger>
            <TabsTrigger value="py">Python (requests)</TabsTrigger>
          </TabsList>
          <TabsContent value="js" className="mt-3">
            <Output code={toFetch(parsed)} />
          </TabsContent>
          <TabsContent value="py" className="mt-3">
            <Output code={toPython(parsed)} />
          </TabsContent>
        </Tabs>
      )}

      <p className="text-xs text-muted-foreground">
        Everything runs in your browser — your command and tokens are never sent anywhere.
      </p>
    </div>
  );
}
