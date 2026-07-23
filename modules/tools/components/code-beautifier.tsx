"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";

const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const LANGS = [
  { value: "js", label: "JavaScript" },
  { value: "ts", label: "TypeScript" },
  { value: "json", label: "JSON" },
  { value: "css", label: "CSS / SCSS / LESS" },
  { value: "html", label: "HTML" },
];

const EXAMPLES: Record<string, string> = {
  js: "function greet(name){if(!name){return 'hi'}console.log('hello '+name);return {ok:true,name:name}}",
  ts: "interface User{id:number;name:string} const u:User={id:1,name:'Ada'};function get(u:User){return u.name}",
  json: '{"name":"OhoTool","tags":["qr","pdf"],"pricing":{"free":true,"pro":9}}',
  css: "body{margin:0;font-family:sans-serif}.btn{color:#fff;background:#0a0a0a;padding:8px 16px;border-radius:8px}",
  html: '<div class="card"><h1>Title</h1><p>Some <strong>text</strong> here.</p></div>',
};

export function CodeBeautifier() {
  const [lang, setLang] = React.useState("js");
  const [input, setInput] = React.useState("");
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function beautify() {
    if (!input.trim()) {
      setError("Paste some code first.");
      setOutput("");
      return;
    }
    try {
      const b = await import("js-beautify");
      const opts = { indent_size: 2 };
      let out: string;
      if (lang === "css") out = b.css(input, opts);
      else if (lang === "html") out = b.html(input, opts);
      else out = b.js(input, opts);
      setOutput(out);
      setError(null);
    } catch (e) {
      setError((e as Error).message || "Could not format that code.");
      setOutput("");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cb-in">Code</Label>
        <Textarea
          id="cb-in"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste minified or messy code…"
          className="min-h-32 font-mono text-xs"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cb-lang">Language</Label>
          <select id="cb-lang" value={lang} onChange={(e) => setLang(e.target.value)} className={selectClass}>
            {LANGS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <Button className="mb-0.5" onClick={beautify}>Beautify</Button>
        <Button variant="outline" size="sm" className="mb-0.5" onClick={() => { setInput(EXAMPLES[lang] ?? ""); setOutput(""); setError(null); }}>
          Try example
        </Button>
        <Button variant="ghost" size="sm" className="mb-0.5" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
          Clear
        </Button>
      </div>

      {error && <p className="text-sm text-destructive break-words">{error}</p>}

      {output && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="cb-out">Beautified</Label>
            <CopyButton value={output} label="" />
          </div>
          <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
            <code className="font-mono">{output}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
