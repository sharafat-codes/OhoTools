"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

const TEMPLATES: Record<string, string> = {
  Node: "# Node\nnode_modules/\nnpm-debug.log*\nyarn-error.log\n.pnpm-debug.log*\n.env\n.env.local\ndist/\ncoverage/",
  "Next.js": "# Next.js\n.next/\nout/\nbuild/\n.vercel\nnext-env.d.ts",
  Python: "# Python\n__pycache__/\n*.py[cod]\n*.egg-info/\n.venv/\nvenv/\n.env\n.pytest_cache/\n.mypy_cache/",
  Java: "# Java\n*.class\ntarget/\n*.jar\n*.war\n.gradle/\nbuild/",
  Go: "# Go\n*.exe\n*.test\n*.out\nbin/\nvendor/",
  Rust: "# Rust\n/target\nCargo.lock",
  PHP: "# PHP\n/vendor/\ncomposer.phar\n.env",
  Laravel: "# Laravel\n/vendor\n/node_modules\n.env\n/public/storage\n/storage/*.key",
  macOS: "# macOS\n.DS_Store\n.AppleDouble\n._*\n.Spotlight-V100\n.Trashes",
  Windows: "# Windows\nThumbs.db\nehthumbs.db\nDesktop.ini\n$RECYCLE.BIN/",
  Linux: "# Linux\n*~\n.directory\n.Trash-*",
  "VS Code": "# VS Code\n.vscode/*\n!.vscode/settings.json\n!.vscode/extensions.json",
  JetBrains: "# JetBrains\n.idea/\n*.iml\n*.iws",
};
const KEYS = Object.keys(TEMPLATES);

export function GitignoreGenerator() {
  const [sel, setSel] = React.useState<string[]>(["Node", "Next.js", "macOS"]);
  function toggle(k: string) {
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
  }
  const output = KEYS.filter((k) => sel.includes(k)).map((k) => TEMPLATES[k]).join("\n\n");

  function download() {
    const b = new Blob([output], { type: "text/plain" });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = ".gitignore";
    a.click();
    URL.revokeObjectURL(u);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Pick your languages, frameworks &amp; tools</span>
        <div className="flex flex-wrap gap-1.5">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => toggle(k)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                sel.includes(k) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40",
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {output && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">.gitignore</span>
              <div className="flex gap-2">
                <CopyButton value={output} />
                <Button variant="outline" size="sm" onClick={download}>Download</Button>
              </div>
            </div>
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono whitespace-pre-wrap">{output}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
