"use client";

import * as React from "react";
import { CopyIcon, CheckIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const SAMPLE = `# Hello, Markdown!

Write **Markdown** on the left and see it *rendered* live on the right.

## Features
- Lists, **bold**, and *italic*
- [Links](https://ohotool.com)
- \`inline code\` and code blocks

\`\`\`js
console.log("hello world");
\`\`\`

> Blockquotes work too.

| Tool | Free |
| ---- | ---- |
| OhoTool | Yes |
`;

// Preview prose styling (no typography plugin in this project).
const PROSE =
  "text-sm leading-relaxed [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_p]:text-muted-foreground [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-2 [&_table]:w-full [&_table]:text-left [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_img]:max-w-full [&_hr]:my-4 [&_hr]:border-border";

export function MarkdownEditor() {
  const [md, setMd] = React.useState(SAMPLE);
  const [parse, setParse] = React.useState<((s: string) => string) | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    import("marked").then(({ marked }) => {
      if (alive) setParse(() => (s: string) => String(marked.parse(s, { async: false })));
    });
    return () => { alive = false; };
  }, []);

  const html = React.useMemo(() => (parse ? parse(md) : ""), [md, parse]);

  function copyHtml() {
    navigator.clipboard.writeText(html).then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1500); },
      () => {},
    );
  }
  function download(content: string, name: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  const words = md.trim() ? md.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-1 text-xs font-medium text-muted-foreground">Markdown</div>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            spellCheck={false}
            className="h-96 w-full resize-y rounded-xl border border-border bg-card p-4 font-mono text-sm outline-none focus:border-primary/40"
          />
        </div>
        <div className="flex flex-col">
          <div className="mb-1 text-xs font-medium text-muted-foreground">Preview</div>
          <div className="h-96 w-full overflow-auto rounded-xl border border-border bg-card p-4">
            <div className={PROSE} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={copyHtml}>
          {copied ? <CheckIcon className="size-4 text-emerald-500" /> : <CopyIcon className="size-4" />}
          {copied ? "Copied HTML" : "Copy HTML"}
        </Button>
        <Button variant="outline" onClick={() => download(md, "document.md", "text/markdown")}>
          <DownloadIcon className="size-4" /> Download .md
        </Button>
        <Button variant="outline" onClick={() => download(html, "document.html", "text/html")}>
          <DownloadIcon className="size-4" /> Download .html
        </Button>
        <button type="button" onClick={() => setMd("")} className="ml-auto text-xs text-muted-foreground hover:text-foreground">
          Clear
        </button>
        <span className="text-xs text-muted-foreground">{words} words · {md.length} chars</span>
      </div>
    </div>
  );
}
