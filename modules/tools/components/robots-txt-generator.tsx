"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

export function RobotsTxtGenerator() {
  const [policy, setPolicy] = React.useState<"allow" | "disallow">("allow");
  const [userAgent, setUserAgent] = React.useState("*");
  const [disallow, setDisallow] = React.useState("/admin/\n/dashboard/\n/api/");
  const [crawlDelay, setCrawlDelay] = React.useState("");
  const [sitemap, setSitemap] = React.useState("https://example.com/sitemap.xml");

  const output = React.useMemo(() => {
    const lines: string[] = [`User-agent: ${userAgent.trim() || "*"}`];
    if (policy === "disallow") {
      lines.push("Disallow: /");
    } else {
      const paths = disallow.split("\n").map((s) => s.trim()).filter(Boolean);
      if (paths.length) for (const p of paths) lines.push(`Disallow: ${p}`);
      else lines.push("Disallow:");
    }
    if (crawlDelay.trim() && Number(crawlDelay) > 0) lines.push(`Crawl-delay: ${Number(crawlDelay)}`);
    let txt = lines.join("\n");
    if (sitemap.trim()) txt += `\n\nSitemap: ${sitemap.trim()}`;
    return `${txt}\n`;
  }, [policy, userAgent, disallow, crawlDelay, sitemap]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Crawler policy</Label>
          <div className="flex flex-col gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="policy" checked={policy === "allow"} onChange={() => setPolicy("allow")} />
              Allow all (block only the paths below)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="policy" checked={policy === "disallow"} onChange={() => setPolicy("disallow")} />
              Block the entire site
            </label>
          </div>
        </div>

        <div className="flex max-w-xs flex-col gap-1.5">
          <Label htmlFor="ua">User-agent</Label>
          <Input id="ua" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} placeholder="*" />
          <p className="text-xs text-muted-foreground">* means all crawlers.</p>
        </div>

        {policy === "allow" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dis">Disallow paths (one per line)</Label>
            <Textarea id="dis" value={disallow} onChange={(e) => setDisallow(e.target.value)} className="min-h-28 font-mono text-xs" />
          </div>
        )}

        <div className="flex max-w-xs flex-col gap-1.5">
          <Label htmlFor="cd">Crawl-delay (seconds, optional)</Label>
          <Input id="cd" type="number" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="e.g. 10" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sm">Sitemap URL (optional)</Label>
          <Input id="sm" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="robots-out">robots.txt</Label>
          <CopyButton value={output} label="" />
        </div>
        <pre id="robots-out" className="min-h-72 min-w-0 overflow-auto rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed">
          <code className="font-mono">{output}</code>
        </pre>
        <p className="text-xs text-muted-foreground">Save this as <code>robots.txt</code> in your site&apos;s root.</p>
      </div>
    </div>
  );
}
