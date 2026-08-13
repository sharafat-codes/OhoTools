"use client";

import * as React from "react";
import { CopyIcon, CheckIcon, ExternalLinkIcon, ImagePlusIcon, XIcon, SparklesIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/components/plan-provider";
import { isPro } from "@/lib/plans";
import { CardStage } from "@/modules/cards/components/card-stage";
import {
  CARD_THEMES, CARD_TEMPLATES, DEFAULT_CARD, normalizeCard, resolveTheme,
  type CardData, type CardTheme, type CardEffect, type TemplateId,
} from "@/modules/cards/types";
import { cardShareUrl, encodeCard } from "@/modules/cards/share";

const EFFECTS: { id: CardEffect; label: string }[] = [
  { id: "confetti", label: "Confetti" },
  { id: "hearts", label: "Hearts" },
  { id: "stars", label: "Stars" },
];

// Downscale + center-crop to a small square JPEG so the photo fits inside the
// shareable link (no upload / storage needed).
function fileToAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = 224;
        const canvas = document.createElement("canvas");
        canvas.width = S;
        canvas.height = S;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        const scale = Math.max(S / img.width, S / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function CardEditor() {
  const [data, setData] = React.useState<CardData>(DEFAULT_CARD);
  const [origin, setOrigin] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [photoError, setPhotoError] = React.useState("");

  React.useEffect(() => setOrigin(window.location.origin), []);

  const url = origin ? cardShareUrl(origin, normalizeCard(data)) : "";
  const set = <K extends keyof CardData>(k: K, v: CardData[K]) => setData((d) => ({ ...d, [k]: v }));

  const { data: sess } = useSession();
  const pro = isPro(((sess?.user as { plan?: string } | null)?.plan) ?? "FREE");
  const imageUrl = origin ? `${origin}/api/card/image?d=${encodeCard(normalizeCard(data))}` : "#";
  const cur = resolveTheme(normalizeCard(data));

  function copy() {
    if (!url) return;
    navigator.clipboard.writeText(url).then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); },
      () => {},
    );
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    try {
      const avatar = await fileToAvatar(file);
      if (avatar.length > 180_000) {
        setPhotoError("That image is too detailed to fit in a share link. Try a simpler photo.");
        return;
      }
      set("photo", avatar);
    } catch {
      setPhotoError("Couldn't read that image. Try another file.");
    } finally {
      e.target.value = "";
    }
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

        {/* Template */}
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Style</span>
          <div className="flex flex-wrap gap-2">
            {CARD_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => set("template", tpl.id as TemplateId)}
                className={"rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " + (data.template === tpl.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40")}
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Theme</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CARD_THEMES) as CardTheme[]).map((key) => {
              const th = CARD_THEMES[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("theme", key)}
                  aria-label={th.name}
                  title={th.name}
                  className={"size-9 rounded-full ring-2 ring-offset-2 ring-offset-background transition " + (data.theme === key ? "ring-primary" : "ring-transparent hover:ring-border")}
                  style={{ background: `linear-gradient(135deg, ${th.bg1}, ${th.bg2})` }}
                />
              );
            })}
          </div>
        </div>

        {/* Effect */}
        <div className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Falling effect</span>
          <div className="flex flex-wrap gap-2">
            {EFFECTS.map((ef) => (
              <button
                key={ef.id}
                type="button"
                onClick={() => set("effect", ef.id)}
                className={"rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " + ((data.effect ?? "confetti") === ef.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40")}
              >
                {ef.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo + music */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {data.photo ? (
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.photo} alt="" className="size-10 rounded-full object-cover ring-2 ring-border" />
                <button type="button" onClick={() => set("photo", undefined)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <XIcon className="size-3.5" /> Remove photo
                </button>
              </div>
            ) : (
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40">
                <ImagePlusIcon className="size-4" /> Add photo
                <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
              </label>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <input type="checkbox" checked={!!data.music} onChange={(e) => set("music", e.target.checked)} className="accent-primary" />
            Play music 🎵
          </label>
        </div>
        {photoError && <p className="text-xs text-red-500">{photoError}</p>}

        {/* Pro features */}
        <div className="rounded-xl border border-border bg-muted/20 p-3.5">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <SparklesIcon className="size-4 text-primary" /> Pro features
            </span>
            {!pro && (
              <a href="/pricing" className="text-xs font-medium text-primary hover:underline">Upgrade to unlock →</a>
            )}
          </div>

          <div className={"flex flex-col gap-3 " + (pro ? "" : "opacity-60")}>
            {/* Custom colors */}
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  disabled={!pro}
                  checked={!!data.custom}
                  onChange={(e) => set("custom", e.target.checked ? { bg1: cur.bg1, bg2: cur.bg2, accent: cur.accent } : undefined)}
                  className="accent-primary"
                />
                Custom colors
              </label>
              {data.custom && (
                <div className="flex flex-wrap gap-3 pl-6">
                  <ColorField label="Color 1" value={data.custom.bg1} disabled={!pro} onChange={(v) => set("custom", { ...data.custom!, bg1: v })} />
                  <ColorField label="Color 2" value={data.custom.bg2} disabled={!pro} onChange={(v) => set("custom", { ...data.custom!, bg2: v })} />
                  <ColorField label="Accent" value={data.custom.accent} disabled={!pro} onChange={(v) => set("custom", { ...data.custom!, accent: v })} />
                </div>
              )}
            </div>

            {/* Remove watermark */}
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" disabled={!pro} checked={!!data.noWatermark} onChange={(e) => set("noWatermark", e.target.checked)} className="accent-primary" />
              Remove &quot;Made with OhoTool&quot; watermark
            </label>

            {/* Download */}
            {pro ? (
              <Button variant="outline" disabled={!origin} render={<a href={imageUrl} download />} className="self-start">
                <DownloadIcon className="size-4" /> Download as image
              </Button>
            ) : (
              <Button variant="outline" render={<a href="/pricing" />} className="self-start">
                <DownloadIcon className="size-4" /> Download as image (Pro)
              </Button>
            )}
          </div>
        </div>

        {/* Actions */}
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
          <CardStage data={normalizeCard(data)} cta={false} sound={false} />
        </div>
        <p className="text-center text-xs text-muted-foreground">Live preview — tap Replay to watch it again.</p>
      </div>
    </div>
  );
}

function ColorField({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <label className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
      <input
        type="color"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 cursor-pointer rounded border border-border bg-card"
      />
      {label}
    </label>
  );
}
