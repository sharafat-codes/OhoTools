"use client";

import * as React from "react";
import { Code2Icon, CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SITE_URL as siteUrl } from "@/lib/site";
import { embedHeight } from "@/modules/tools/embed";

export function EmbedDialog({ slug, name }: { slug: string; name: string }) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const previewRef = React.useRef<HTMLIFrameElement>(null);

  const origin = siteUrl.replace(/\/$/, "");
  const height = embedHeight(slug);

  // Make the preview auto-fit its content, exactly like a real embed does, so
  // there's no inner scrollbar — it's true WYSIWYG.
  React.useEffect(() => {
    if (!open) return;
    function onMessage(e: MessageEvent) {
      if (e.origin !== origin) return;
      const data = e.data as { slug?: string; ohotoolHeight?: number };
      if (data?.slug === slug && data.ohotoolHeight && previewRef.current) {
        previewRef.current.style.height = `${data.ohotoolHeight}px`;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, origin, slug]);

  // The <p> attribution lives on the embedder's page (outside the iframe), so
  // its link to /tools/<slug> is a real inbound link — that's the point. The
  // <script> listens for the embed page's height messages and resizes to fit.
  const snippet = `<iframe id="ohotool-${slug}" src="${origin}/embed/${slug}" title="${name} — OhoTool" loading="lazy" scrolling="no" style="width:100%;max-width:520px;height:${height}px;border:1px solid #e5e7eb;border-radius:12px"></iframe>
<p style="max-width:520px;margin:8px 0 0;font:13px/1.5 system-ui,sans-serif;color:#6b7280">Powered by <a href="${origin}/tools/${slug}" target="_blank" rel="noopener">${name}</a> — free online tools by <a href="${origin}" target="_blank" rel="noopener">OhoTool</a></p>
<script>window.addEventListener("message",function(e){if(e.origin==="${origin}"&&e.data&&e.data.slug==="${slug}"&&e.data.ohotoolHeight){var f=document.getElementById("ohotool-${slug}");if(f){f.style.height=e.data.ohotoolHeight+"px";}}});</script>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Code2Icon />
        Embed this tool
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[88dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Embed {name}</DialogTitle>
            <DialogDescription>
              Paste this into your site where you want the tool to appear. It resizes to fit its content and stays free.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {/* Live preview — exactly what visitors will see */}
            <div className="rounded-xl border border-border bg-muted/30 p-2">
              <iframe
                ref={previewRef}
                src={`${origin}/embed/${slug}`}
                title={`${name} preview`}
                loading="lazy"
                scrolling="no"
                style={{ width: "100%", height, border: 0, borderRadius: 8 }}
              />
            </div>

            <textarea
              readOnly
              value={snippet}
              rows={7}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full resize-none rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed"
              aria-label="Embed code"
            />

            <Button onClick={copy}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "Copied!" : "Copy embed code"}
            </Button>

            <p className="text-xs text-muted-foreground">
              Keeping the &ldquo;Powered by OhoTool&rdquo; line is appreciated — it&rsquo;s how people discover the tools.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
