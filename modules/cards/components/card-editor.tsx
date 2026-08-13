"use client";

import * as React from "react";
import { CopyIcon, CheckIcon, ExternalLinkIcon, ImagePlusIcon, XIcon, SparklesIcon, DownloadIcon, LockIcon } from "lucide-react";

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

const inputCls =
  "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

// Downscale + center-crop to a small square JPEG so the photo fits in the link.
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

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* Controls */}
      <div className="order-2 flex flex-col gap-7 lg:order-1">
        {/* Content */}
        <Section label="Content">
          <Field label="Whose birthday is it?">
            <input value={data.to} maxLength={60} onChange={(e) => set("to", e.target.value)} placeholder="Name" className={inputCls} />
          </Field>
          <Field label="Your message" hint={`${data.message.length}/400`}>
            <textarea value={data.message} maxLength={400} rows={4} onChange={(e) => set("message", e.target.value)} className={inputCls + " resize-y"} />
          </Field>
          <Field label="From (optional)">
            <input value={data.from} maxLength={60} onChange={(e) => set("from", e.target.value)} placeholder="Your name" className={inputCls} />
          </Field>
        </Section>

        {/* Design */}
        <Section label="Design">
          <Field label="Style">
            <div className="flex flex-wrap gap-2">
              {CARD_TEMPLATES.map((tpl) => {
                const active = data.template === tpl.id;
                const locked = tpl.pro && !pro;
                const base = "inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ";
                const look = active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-card hover:border-primary/40 hover:bg-muted/40";
                if (locked) {
                  return (
                    <a key={tpl.id} href="/pricing" className={base + "border-border bg-card text-muted-foreground hover:border-primary/40"} title="Pro template">
                      {tpl.name} <LockIcon className="size-3.5" />
                    </a>
                  );
                }
                return (
                  <button key={tpl.id} type="button" onClick={() => set("template", tpl.id as TemplateId)} className={base + look}>
                    {tpl.name}
                    {tpl.pro && <SparklesIcon className="size-3.5 opacity-80" />}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Theme">
            <div className="flex flex-wrap gap-2.5">
              {(Object.keys(CARD_THEMES) as CardTheme[]).map((key) => {
                const th = CARD_THEMES[key];
                const active = data.theme === key && !data.custom;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { set("theme", key); if (data.custom) set("custom", undefined); }}
                    aria-label={th.name}
                    title={th.name}
                    className={"size-9 rounded-full ring-2 ring-offset-2 ring-offset-background transition " + (active ? "ring-primary" : "ring-transparent hover:ring-border")}
                    style={{ background: `linear-gradient(135deg, ${th.bg1}, ${th.bg2})` }}
                  />
                );
              })}
            </div>
          </Field>

          <Field label="Falling effect">
            <Segmented
              options={EFFECTS.map((e) => ({ id: e.id, label: e.label }))}
              value={data.effect ?? "confetti"}
              onChange={(v) => set("effect", v as CardEffect)}
            />
          </Field>
        </Section>

        {/* Extras */}
        <Section label="Extras">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {data.photo ? (
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.photo} alt="" className="size-11 rounded-full object-cover ring-2 ring-border" />
                <button type="button" onClick={() => set("photo", undefined)} className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                  <XIcon className="size-3.5" /> Remove photo
                </button>
              </div>
            ) : (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted/40">
                <ImagePlusIcon className="size-4" /> Add photo
                <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
              </label>
            )}
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={!!data.music} onChange={(e) => set("music", e.target.checked)} className="size-4 accent-primary" />
              Play music 🎵
            </label>
          </div>
          {photoError && <p className="text-xs text-red-500">{photoError}</p>}
        </Section>

        {/* Pro */}
        <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] to-transparent p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <SparklesIcon className="size-4 text-primary" /> Pro features
            </span>
            {!pro && <a href="/pricing" className="text-xs font-semibold text-primary hover:underline">Upgrade →</a>}
          </div>

          <div className={"flex flex-col gap-4 " + (pro ? "" : "opacity-70")}>
            <div className="flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2 font-medium">
                <input type="checkbox" disabled={!pro} checked={!!data.custom} onChange={(e) => set("custom", e.target.checked ? { bg1: cur.bg1, bg2: cur.bg2, accent: cur.accent } : undefined)} className="size-4 accent-primary" />
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

            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" disabled={!pro} checked={!!data.noWatermark} onChange={(e) => set("noWatermark", e.target.checked)} className="size-4 accent-primary" />
              Remove &quot;Made with OhoTool&quot; watermark
            </label>

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
      </div>

      {/* Sticky preview */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-6">
          <div className="mx-auto w-full max-w-[280px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[2.2rem] border-[6px] border-foreground/10 bg-neutral-900 shadow-2xl">
              <CardStage data={normalizeCard(data)} cta={false} sound={false} />
            </div>
          </div>

          {/* Actions */}
          <div className="mx-auto mt-5 flex w-full max-w-[280px] flex-col gap-2">
            <Button onClick={copy} disabled={!url} className="w-full">
              {copied ? <CheckIcon className="size-4 text-emerald-400" /> : <CopyIcon className="size-4" />}
              {copied ? "Link copied!" : "Copy share link"}
            </Button>
            <Button variant="outline" disabled={!url} render={<a href={url || "#"} target="_blank" rel="noopener noreferrer" />} className="w-full">
              <ExternalLinkIcon className="size-4" /> Open card
            </Button>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Share on WhatsApp or anywhere — opens as a full-screen animated card. Nothing is stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3>
      {children}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Segmented({ options, value, onChange }: { options: { id: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-lg bg-muted p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={"rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors " + (value === o.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          {o.label}
        </button>
      ))}
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
