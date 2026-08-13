"use client";

import * as React from "react";
import { CopyIcon, CheckIcon, ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardStage } from "@/modules/cards/components/card-stage";
import { CARD_THEMES, DEFAULT_CARD, normalizeCard, type CardData, type CardTheme } from "@/modules/cards/types";
import { cardShareUrl } from "@/modules/cards/share";

export function CardEditor() {
  const [data, setData] = React.useState<CardData>(DEFAULT_CARD);
  const [origin, setOrigin] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => setOrigin(window.location.origin), []);

  const url = origin ? cardShareUrl(origin, normalizeCard(data)) : "";
  const set = <K extends keyof CardData>(k: K, v: CardData[K]) => setData((d) => ({ ...d, [k]: v }));

  function copy() {
    if (!url) return;
    navigator.clipboard.writeText(url).then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); },
      () => {},
    );
  }

  const inputCls = "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary/40";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Whose birthday is it?</span>
          <input value={data.to} maxLength={60} onChange={(e) => set("to", e.target.value)} placeholder="Name" className={inputCls} />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Your message</span>
          <textarea value={data.message} maxLength={400} rows={4} onChange={(e) => set("message", e.target.value)} className={inputCls + " resize-y"} />
          <span className="self-end text-xs text-muted-foreground">{data.message.length}/400</span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">From (optional)</span>
          <input value={data.from} maxLength={60} onChange={(e) => set("from", e.target.value)} placeholder="Your name" className={inputCls} />
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Theme</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CARD_THEMES) as CardTheme[]).map((key) => {
              const th = CARD_THEMES[key];
              const active = data.theme === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("theme", key)}
                  aria-label={th.name}
                  title={th.name}
                  className={"size-9 rounded-full ring-2 ring-offset-2 ring-offset-background transition " + (active ? "ring-primary" : "ring-transparent hover:ring-border")}
                  style={{ background: `linear-gradient(135deg, ${th.bg1}, ${th.bg2})` }}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Button onClick={copy} disabled={!url} className="min-w-36">
            {copied ? <CheckIcon className="size-4 text-emerald-400" /> : <CopyIcon className="size-4" />}
            {copied ? "Link copied!" : "Copy share link"}
          </Button>
          <Button variant="outline" disabled={!url} render={<a href={url || "#"} target="_blank" rel="noopener noreferrer" />}>
            <ExternalLinkIcon className="size-4" /> Open card
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Share the link on WhatsApp, SMS, or anywhere — it opens as a full-screen animated card. No sign-up, nothing stored on our servers.
        </p>
      </div>

      {/* Live preview */}
      <div className="flex flex-col gap-2">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-border shadow-lg">
          <CardStage data={normalizeCard(data)} cta={false} />
        </div>
        <p className="text-center text-xs text-muted-foreground">Live preview — tap Replay to watch it again.</p>
      </div>
    </div>
  );
}
