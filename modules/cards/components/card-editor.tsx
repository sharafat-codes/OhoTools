"use client";

import * as React from "react";
import {
  CopyIcon, CheckIcon, ExternalLinkIcon, ImagePlusIcon, XIcon, SparklesIcon, DownloadIcon, LockIcon,
  TypeIcon, PaletteIcon, ImageIcon, CrownIcon, PartyPopperIcon, HeartIcon, StarIcon, FilmIcon, SaveIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/components/plan-provider";
import { isPro } from "@/lib/plans";
import { saveCard, updateCard, watchCardOpens } from "@/modules/cards/actions";
import { CardStage } from "@/modules/cards/components/card-stage";
import {
  CARD_THEMES, CARD_TEMPLATES, CARD_FONTS, OCCASIONS, defaultCard, normalizeCard, resolveTheme,
  type CardData, type CardTheme, type CardEffect, type TemplateId, type Occasion,
  type StyleElement, type ElemStyle, type FontKey,
} from "@/modules/cards/types";
import { cardShareUrl, encodeCard } from "@/modules/cards/share";

const EFFECTS: { id: CardEffect; label: string; Icon: typeof StarIcon }[] = [
  { id: "confetti", label: "Confetti", Icon: PartyPopperIcon },
  { id: "hearts", label: "Hearts", Icon: HeartIcon },
  { id: "stars", label: "Stars", Icon: StarIcon },
];

const STYLE_TARGETS: { id: "global" | StyleElement; label: string }[] = [
  { id: "global", label: "All text" },
  { id: "name", label: "Name" },
  { id: "message", label: "Message" },
  { id: "eyebrow", label: "Heading" },
  { id: "from", label: "From" },
];

const SIZE_OPTIONS: { v: number; label: string }[] = [
  { v: 0.8, label: "Small" },
  { v: 1, label: "Normal" },
  { v: 1.25, label: "Large" },
  { v: 1.5, label: "Extra large" },
];

// Mini visual for each template's picker chip.
const SWATCH: Record<TemplateId, { bg: string; accent: string; serif?: boolean; glow?: boolean }> = {
  classic: { bg: "linear-gradient(135deg,#7c3aed,#db2777)", accent: "#ffffff" },
  festival: { bg: "linear-gradient(165deg,#047857,#022c22)", accent: "#facc15", serif: true, glow: true },
  romantic: { bg: "linear-gradient(160deg,#e11d48,#9333ea)", accent: "#ffffff", serif: true },
  elegant: { bg: "radial-gradient(circle at 50% 30%,#2a2440,#0a0a0c)", accent: "#e7c873", serif: true },
  playful: { bg: "linear-gradient(135deg,#f97316,#db2777)", accent: "#ffffff" },
  luxe: { bg: "radial-gradient(circle at 50% 30%,#2b2410,#0a0a0c)", accent: "#e7c873", serif: true },
  neon: { bg: "radial-gradient(circle at 50% 40%,#10131f,#060711)", accent: "#38bdf8", glow: true },
};

const inputCls =
  "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

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

export function CardEditor({ occasion = "birthday", initialCard, cardId, initialShortCode, advanced = false }: { occasion?: Occasion; initialCard?: CardData; cardId?: string; initialShortCode?: string; advanced?: boolean }) {
  const [data, setData] = React.useState<CardData>(() => (initialCard ? normalizeCard(initialCard) : defaultCard(occasion)));
  const [origin, setOrigin] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [photoError, setPhotoError] = React.useState("");
  const [videoBusy, setVideoBusy] = React.useState(false);
  const [videoPct, setVideoPct] = React.useState(0);
  const [savedId, setSavedId] = React.useState<string | undefined>(cardId);
  const [shortCode, setShortCode] = React.useState<string | undefined>(initialShortCode);
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">("idle");
  const [styleTarget, setStyleTarget] = React.useState<"global" | StyleElement>("global");
  // "Notify me when opened" — optional email capture (also grows the list).
  const [notifyEmail, setNotifyEmail] = React.useState("");
  const [notifyMarketing, setNotifyMarketing] = React.useState(true);
  const [notifyState, setNotifyState] = React.useState<"idle" | "saving" | "done" | "dismissed">("idle");
  const [notifyError, setNotifyError] = React.useState("");

  const curStyle: ElemStyle = data.styles?.[styleTarget] ?? {};
  function setStyle(patch: Partial<ElemStyle>) {
    setData((d) => {
      const merged = { ...(d.styles?.[styleTarget] ?? {}), ...patch };
      const clean: ElemStyle = {};
      if (merged.font) clean.font = merged.font;
      if (merged.size) clean.size = merged.size;
      if (merged.color) clean.color = merged.color;
      if (merged.bold) clean.bold = true;
      if (merged.italic) clean.italic = true;
      const styles = { ...(d.styles ?? {}) };
      if (Object.keys(clean).length) styles[styleTarget] = clean;
      else delete styles[styleTarget];
      return { ...d, styles: Object.keys(styles).length ? styles : undefined };
    });
  }

  React.useEffect(() => setOrigin(window.location.origin), []);

  const encodedUrl = origin ? cardShareUrl(origin, normalizeCard(data)) : "";
  // Saved cards get a short link (/c/<code>) with open tracking; otherwise the
  // self-contained encoded link.
  const url = shortCode && origin ? `${origin}/c/${shortCode}` : encodedUrl;
  const set = <K extends keyof CardData>(k: K, v: CardData[K]) => setData((d) => ({ ...d, [k]: v }));

  const { data: sess } = useSession();
  const pro = isPro(((sess?.user as { plan?: string } | null)?.plan) ?? "FREE");
  const loggedIn = !!sess?.user;

  async function saveToAccount() {
    if (!loggedIn) {
      const here = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect=${encodeURIComponent(here)}`;
      return;
    }
    if (saveState === "saving") return;
    setSaveState("saving");
    setPhotoError("");
    const payload = { data: normalizeCard(data) };
    const res = savedId ? await updateCard(savedId, payload) : await saveCard(payload);
    if (res.ok) {
      setSavedId(res.id);
      setShortCode(res.shortCode);
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 2000);
    } else {
      setSaveState("idle");
      setPhotoError(res.error);
    }
  }
  async function notifySubmit() {
    if (notifyState === "saving") return;
    setNotifyError("");
    setNotifyState("saving");
    const res = await watchCardOpens({
      cardId: savedId,
      data: normalizeCard(data),
      email: notifyEmail,
      marketing: notifyMarketing,
    });
    if (res.ok) {
      setShortCode(res.shortCode); // share link becomes the tracked /c/<code>
      setNotifyState("done");
    } else {
      setNotifyState("idle");
      setNotifyError(res.error);
    }
  }
  const imageUrl = origin ? `${origin}/api/card/image?d=${encodeCard(normalizeCard(data))}` : "#";
  const cur = resolveTheme(normalizeCard(data));
  const occ = OCCASIONS[data.occasion];

  function copy() {
    if (!url) return;
    navigator.clipboard.writeText(url).then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); },
      () => {},
    );
  }

  async function downloadVideo() {
    if (videoBusy) return;
    setVideoBusy(true);
    setVideoPct(0);
    setPhotoError("");
    try {
      const { exportCardVideo } = await import("@/modules/cards/video");
      const blob = await exportCardVideo(normalizeCard(data), setVideoPct);
      const dl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const safe = (data.to || "card").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      a.href = dl;
      a.download = `birthday-${safe}.mp4`;
      a.click();
      URL.revokeObjectURL(dl);
    } catch {
      setPhotoError("Sorry — couldn't render the video. Please try again.");
    } finally {
      setVideoBusy(false);
    }
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
      <div className="order-2 flex flex-col gap-8 lg:order-1">
        {/* Content */}
        <Section icon={TypeIcon} label="Content">
          <Field label={occ.toLabel}>
            <input value={data.to} maxLength={60} onChange={(e) => set("to", e.target.value)} placeholder={occ.toPlaceholder} className={inputCls} />
          </Field>
          <Field label="Your message" hint={`${data.message.length}/400`}>
            <textarea value={data.message} maxLength={400} rows={4} onChange={(e) => set("message", e.target.value)} className={inputCls + " resize-y"} />
          </Field>
          <Field label="From (optional)">
            <input value={data.from} maxLength={60} onChange={(e) => set("from", e.target.value)} placeholder="Your name" className={inputCls} />
          </Field>
        </Section>

        {/* Design */}
        <Section icon={PaletteIcon} label="Design">
          <Field label="Style">
            <div className="grid grid-cols-3 gap-2.5">
              {CARD_TEMPLATES.filter((tpl) => occ.templates.includes(tpl.id)).map((tpl) => {
                const active = data.template === tpl.id;
                const locked = tpl.pro && !pro;
                const sw = SWATCH[tpl.id];
                const chipCls =
                  "group relative flex flex-col overflow-hidden rounded-xl border-2 text-center transition-all " +
                  (active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50");
                const inner = (
                  <>
                    <div className="grid h-14 place-items-center" style={{ background: sw.bg }}>
                      <span style={{ color: sw.accent, fontFamily: sw.serif ? "Georgia, serif" : "inherit", fontWeight: 800, fontSize: 17, textShadow: sw.glow ? `0 0 8px ${sw.accent}` : "none" }}>
                        Aa
                      </span>
                    </div>
                    <span className="flex items-center justify-center gap-1 bg-card px-1 py-1.5 text-xs font-medium">
                      {tpl.name}
                      {tpl.pro && !locked && <SparklesIcon className="size-3 text-primary" />}
                    </span>
                    {locked && (
                      <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-black/50 text-white">
                        <LockIcon className="size-3" />
                      </span>
                    )}
                  </>
                );
                return locked ? (
                  <a key={tpl.id} href="/pricing" className={chipCls} title="Unlock with Pro">{inner}</a>
                ) : (
                  <button key={tpl.id} type="button" onClick={() => set("template", tpl.id as TemplateId)} className={chipCls}>{inner}</button>
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
                    className={"grid size-10 place-items-center rounded-full text-white shadow-sm ring-2 ring-offset-2 ring-offset-background transition " + (active ? "ring-primary" : "ring-transparent hover:ring-border")}
                    style={{ background: `linear-gradient(135deg, ${th.bg1}, ${th.bg2})` }}
                  >
                    {active && <CheckIcon className="size-4 drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Falling effect">
            <div className="inline-flex rounded-xl bg-muted p-1">
              {EFFECTS.map((ef) => {
                const on = (data.effect ?? "confetti") === ef.id;
                return (
                  <button
                    key={ef.id}
                    type="button"
                    onClick={() => set("effect", ef.id)}
                    className={"inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors " + (on ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
                  >
                    <ef.Icon className="size-3.5" /> {ef.label}
                  </button>
                );
              })}
            </div>
          </Field>
        </Section>

        {/* Extras */}
        <Section icon={ImageIcon} label="Extras">
          <div className="flex items-center gap-3">
            {data.photo ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.photo} alt="" className="size-12 rounded-full object-cover ring-2 ring-primary/30" />
                <div className="text-sm">
                  <div className="font-medium">Photo added</div>
                  <button type="button" onClick={() => set("photo", undefined)} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <XIcon className="size-3" /> Remove
                  </button>
                </div>
              </>
            ) : (
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted/40">
                <ImagePlusIcon className="size-4" /> Add a photo
                <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
              </label>
            )}
          </div>
          {photoError && <p className="text-xs text-red-500">{photoError}</p>}

          <ToggleRow label="Play music" hint="Plays a birthday tune on the shared card" checked={!!data.music} onChange={(v) => set("music", v)} />
        </Section>

        {/* Pro */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.07] via-primary/[0.02] to-transparent p-4">
          <div className="mb-3.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              <CrownIcon className="size-4 text-primary" /> Pro features
            </span>
            {!pro && (
              <a href="/pricing" className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Upgrade</a>
            )}
          </div>

          <div className={"flex flex-col gap-3.5 " + (pro ? "" : "opacity-70")}>
            <div className="flex flex-col gap-2.5">
              <ToggleRow
                label="Custom colors"
                disabled={!pro}
                checked={!!data.custom}
                onChange={(v) => set("custom", v ? { bg1: cur.bg1, bg2: cur.bg2, accent: cur.accent } : undefined)}
              />
              {data.custom && (
                <div className="flex flex-wrap gap-3 pl-1">
                  <ColorField label="Color 1" value={data.custom.bg1} disabled={!pro} onChange={(v) => set("custom", { ...data.custom!, bg1: v })} />
                  <ColorField label="Color 2" value={data.custom.bg2} disabled={!pro} onChange={(v) => set("custom", { ...data.custom!, bg2: v })} />
                  <ColorField label="Accent" value={data.custom.accent} disabled={!pro} onChange={(v) => set("custom", { ...data.custom!, accent: v })} />
                </div>
              )}
            </div>

            <ToggleRow label="Remove watermark" disabled={!pro} checked={!!data.noWatermark} onChange={(v) => set("noWatermark", v)} />

            {pro ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" disabled={!origin || videoBusy} render={<a href={imageUrl} download />}>
                    <DownloadIcon className="size-4" /> Image
                  </Button>
                  <Button variant="outline" disabled={videoBusy} onClick={downloadVideo}>
                    <FilmIcon className="size-4" /> {videoBusy ? `Rendering… ${videoPct}%` : "Video (MP4)"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">The first video render loads a small engine (~30 MB), so it can take a moment.</p>
              </div>
            ) : (
              <Button variant="outline" render={<a href="/pricing" />} className="self-start">
                <DownloadIcon className="size-4" /> Download image &amp; video
              </Button>
            )}
          </div>
        </div>

        {/* Advanced text styling (dashboard, Pro) */}
        {advanced && (
          <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] to-transparent p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <TypeIcon className="size-4 text-primary" /> Fonts &amp; text
                <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">PRO</span>
              </span>
              {!pro && <a href="/pricing" className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90">Upgrade</a>}
            </div>

            <div className={pro ? "" : "pointer-events-none opacity-60"}>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {STYLE_TARGETS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setStyleTarget(t.id)}
                    className={"rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors " + (styleTarget === t.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40")}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Font">
                  <select value={curStyle.font ?? "default"} onChange={(e) => setStyle({ font: e.target.value === "default" ? undefined : (e.target.value as FontKey) })} className={inputCls}>
                    {Object.entries(CARD_FONTS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                  </select>
                </Field>
                <Field label="Size">
                  <select value={String(curStyle.size ?? 1)} onChange={(e) => { const v = Number(e.target.value); setStyle({ size: v === 1 ? undefined : v }); }} className={inputCls}>
                    {SIZE_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
                  </select>
                </Field>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Color</span>
                  <input type="color" value={curStyle.color ?? "#ffffff"} onChange={(e) => setStyle({ color: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-border bg-card" />
                  {curStyle.color && <button type="button" onClick={() => setStyle({ color: undefined })} className="text-xs text-muted-foreground hover:text-foreground">Reset</button>}
                </div>
                <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium">
                  <input type="checkbox" checked={!!curStyle.bold} onChange={(e) => setStyle({ bold: e.target.checked || undefined })} className="size-4 accent-primary" /> Bold
                </label>
                <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium">
                  <input type="checkbox" checked={!!curStyle.italic} onChange={(e) => setStyle({ italic: e.target.checked || undefined })} className="size-4 accent-primary" /> Italic
                </label>
              </div>
              <p className="mt-2.5 text-xs text-muted-foreground">
                Editing <b>{STYLE_TARGETS.find((t) => t.id === styleTarget)?.label}</b>. &quot;All text&quot; applies everywhere; per-element choices override it.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky preview */}
      <div className="order-1 lg:order-2">
        <div className="lg:sticky lg:top-6">
          <div className="mx-auto w-full max-w-[280px]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[2.4rem] border-[7px] border-neutral-800 bg-neutral-900 shadow-2xl ring-1 ring-black/5">
              <div className="absolute left-1/2 top-2 z-30 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/25" />
              <CardStage data={normalizeCard(data)} cta={false} sound={false} />
            </div>
          </div>

          <div className="mx-auto mt-5 flex w-full max-w-[280px] flex-col gap-2">
            <Button onClick={copy} disabled={!url} className="w-full">
              {copied ? <CheckIcon className="size-4 text-emerald-400" /> : <CopyIcon className="size-4" />}
              {copied ? "Link copied!" : "Copy share link"}
            </Button>
            <Button variant="outline" disabled={!url} render={<a href={url || "#"} target="_blank" rel="noopener noreferrer" />} className="w-full">
              <ExternalLinkIcon className="size-4" /> Open card
            </Button>
            <Button variant="outline" onClick={saveToAccount} disabled={saveState === "saving"} className="w-full">
              {saveState === "saved" ? <CheckIcon className="size-4 text-emerald-500" /> : <SaveIcon className="size-4" />}
              {saveState === "saved"
                ? "Saved to your cards"
                : saveState === "saving"
                  ? "Saving…"
                  : !loggedIn
                    ? "Sign in to save"
                    : savedId
                      ? "Save changes"
                      : "Save to my cards"}
            </Button>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Share on WhatsApp or anywhere — opens as a full-screen animated card.
            </p>

            {/* Optional: get notified when the card is opened (grows the list). */}
            {notifyState === "done" ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckIcon className="mr-1 inline size-3.5" />
                Done — we&apos;ll email you the moment it&apos;s opened.
              </div>
            ) : notifyState !== "dismissed" ? (
              <div className="rounded-xl border border-border bg-card p-3 text-left">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold">💌 Know when it&apos;s opened</p>
                  <button type="button" onClick={() => setNotifyState("dismissed")} aria-label="Dismiss" className="text-muted-foreground hover:text-foreground">
                    <XIcon className="size-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Optional — we&apos;ll email you the moment your card is opened.</p>
                <div className="mt-2 flex gap-1.5">
                  <input
                    type="email"
                    inputMode="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && notifySubmit()}
                    placeholder="you@email.com"
                    className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                  <Button onClick={notifySubmit} disabled={notifyState === "saving"} className="shrink-0">
                    {notifyState === "saving" ? "…" : "Notify me"}
                  </Button>
                </div>
                {notifyError && <p className="mt-1 text-xs text-red-500">{notifyError}</p>}
                <label className="mt-2 flex cursor-pointer items-start gap-1.5 text-xs text-muted-foreground">
                  <input type="checkbox" checked={notifyMarketing} onChange={(e) => setNotifyMarketing(e.target.checked)} className="mt-0.5 size-3.5 shrink-0 accent-primary" />
                  Also send me new templates &amp; seasonal cards (unsubscribe anytime)
                </label>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, label, children }: { icon: typeof TypeIcon; label: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </h3>
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

function ToggleRow({ label, hint, checked, onChange, disabled }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <Switch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

function Switch({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={"relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors " + (checked ? "bg-primary" : "bg-muted") + (disabled ? " cursor-not-allowed opacity-50" : "")}
    >
      <span className={"inline-block size-5 transform rounded-full bg-white shadow transition-transform " + (checked ? "translate-x-[22px]" : "translate-x-0.5")} />
    </button>
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
