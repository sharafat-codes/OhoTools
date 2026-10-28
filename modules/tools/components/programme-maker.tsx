"use client";

import * as React from "react";
import {
  ArrowDownIcon, ArrowUpIcon, DownloadIcon, ImagePlusIcon, Loader2Icon, PlusIcon, PrinterIcon, XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ── Data ─────────────────────────────────────────────────────────────────────

type Item = { id: number; time: string; text: string; note: string };
type StyleId = "classic" | "elegant" | "modern" | "crest" | "minimal";
type Paper = "a4" | "a5";

type Preset = {
  id: string;
  label: string;
  organisation: string;
  title: string;
  heading: string;
  items: string[];
  style: StyleId;
};

// The school-function preset is the order of proceedings exactly as it was
// sent to us; the others are the same idea for other events.
const PRESETS: Preset[] = [
  {
    id: "school",
    label: "School function",
    organisation: "Your School Name",
    title: "Annual Day Celebration",
    heading: "Order of Proceedings",
    style: "crest",
    items: [
      "Religious Observances", "National Anthem", "School Anthem", "Welcome Address",
      "Introduction of the Chief Guest", "Address by the Principal", "Address by the Chief Guest",
      "Guest Speeches", "Cultural Performances", "Special Performances", "Vote of Thanks", "Closing Remarks",
    ],
  },
  {
    id: "prize",
    label: "Prize giving",
    organisation: "Your School Name",
    title: "Annual Prize Giving",
    heading: "Programme",
    style: "classic",
    items: [
      "Arrival of the Chief Guest", "Lighting of the Traditional Oil Lamp", "National Anthem", "School Anthem",
      "Welcome Speech", "Principal's Report", "Distribution of Prizes", "Address by the Chief Guest",
      "Cultural Item", "Vote of Thanks", "National Anthem",
    ],
  },
  {
    id: "wedding",
    label: "Wedding",
    organisation: "",
    title: "Aisha & Bilal",
    heading: "Wedding Programme",
    style: "elegant",
    items: [
      "Arrival of Guests", "Arrival of the Groom", "Arrival of the Bride", "Ceremony",
      "Exchange of Rings", "Photographs", "Dinner", "Speeches & Toasts", "First Dance", "Send-off",
    ],
  },
  {
    id: "nikah",
    label: "Nikah",
    organisation: "",
    title: "Nikah of Aisha & Bilal",
    heading: "Order of Ceremony",
    style: "elegant",
    items: [
      "Arrival of Guests", "Recitation from the Holy Quran", "Khutbah-tun-Nikah", "Ijab-o-Qubool",
      "Signing of the Nikah Nama", "Dua", "Distribution of Dates & Sweets", "Dinner",
    ],
  },
  {
    id: "conference",
    label: "Conference / meeting",
    organisation: "Organisation Name",
    title: "Annual Conference 2026",
    heading: "Agenda",
    style: "modern",
    items: [
      "Registration & Welcome Coffee", "Opening Remarks", "Keynote Address", "Panel Discussion", "Break",
      "Breakout Sessions", "Lunch", "Workshop", "Closing Remarks", "Networking",
    ],
  },
  {
    id: "service",
    label: "Religious service",
    organisation: "",
    title: "Thanksgiving Service",
    heading: "Order of Service",
    style: "classic",
    items: ["Opening Prayer", "Hymn", "Scripture Reading", "Sermon", "Hymn", "Prayers", "Blessing", "Closing Hymn"],
  },
];

const STYLES: { id: StyleId; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "elegant", label: "Elegant" },
  { id: "modern", label: "Modern" },
  { id: "crest", label: "Crest" },
  { id: "minimal", label: "Minimal" },
];

const ACCENTS = ["#1e3a8a", "#7f1d1d", "#14532d", "#6b21a8", "#9a6b1f", "#111827"];

// A4 and A5 at 96 px/in — the page is laid out at real size, then scaled to
// fit the preview and captured at 2x for the PDF.
const PAGE = { a4: { w: 794, h: 1123, pt: [595.28, 841.89] }, a5: { w: 559, h: 794, pt: [419.53, 595.28] } } as const;

// ── Component ────────────────────────────────────────────────────────────────

export function ProgrammeMaker() {
  const idRef = React.useRef(100);
  const toItems = (texts: string[]): Item[] => texts.map((text) => ({ id: idRef.current++, time: "", text, note: "" }));

  const first = PRESETS[0];
  const [preset, setPreset] = React.useState(first.id);
  const [organisation, setOrganisation] = React.useState(first.organisation);
  const [title, setTitle] = React.useState(first.title);
  const [heading, setHeading] = React.useState(first.heading);
  const [items, setItems] = React.useState<Item[]>(() => first.items.map((text, i) => ({ id: i + 1, time: "", text, note: "" })));
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [venue, setVenue] = React.useState("");
  const [organisedBy, setOrganisedBy] = React.useState("");
  const [showTimes, setShowTimes] = React.useState(false);
  const [numbered, setNumbered] = React.useState(true);
  const [style, setStyle] = React.useState<StyleId>(first.style);
  const [accent, setAccent] = React.useState(ACCENTS[0]);
  const [paper, setPaper] = React.useState<Paper>("a4");
  const [logo, setLogo] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function applyPreset(id: string) {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPreset(id);
    setOrganisation(p.organisation);
    setTitle(p.title);
    setHeading(p.heading);
    setItems(toItems(p.items));
    setStyle(p.style);
  }

  const update = (id: number, key: keyof Item, value: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  const add = () => setItems((prev) => [...prev, { id: idRef.current++, time: "", text: "", note: "" }]);
  const remove = (id: number) => setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
  const move = (i: number, d: -1 | 1) =>
    setItems((prev) => {
      const j = i + d;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // The logo is downscaled in the browser and kept as a data URL — never uploaded.
  async function pickLogo(file: File | undefined) {
    if (!file) return;
    try {
      const bmp = await createImageBitmap(file);
      const s = Math.min(1, 400 / Math.max(bmp.width, bmp.height));
      const c = document.createElement("canvas");
      c.width = Math.round(bmp.width * s);
      c.height = Math.round(bmp.height * s);
      c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
      setLogo(c.toDataURL("image/png"));
    } catch {
      setError("Couldn't read that image. Try a PNG or JPG.");
    }
  }

  // ── Preview scaling ──
  const frameRef = React.useRef<HTMLDivElement>(null);
  const pageRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(0.5);
  const size = PAGE[paper];
  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / size.w)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [size.w]);

  async function downloadPdf() {
    if (!pageRef.current) return;
    setBusy(true);
    setError(null);
    try {
      const [{ toPng }, { PDFDocument }] = await Promise.all([import("html-to-image"), import("pdf-lib")]);
      // Captured from the real-size page, so the PDF matches the preview —
      // including Sinhala, Tamil, Urdu or any other script the browser can show.
      const png = await toPng(pageRef.current, { pixelRatio: 2.5, cacheBust: true, backgroundColor: "#ffffff" });
      const doc = await PDFDocument.create();
      doc.setTitle(title || heading);
      doc.setCreator("OhoTool Programme Maker");
      const [w, h] = size.pt;
      const page = doc.addPage([w, h]);
      const img = await doc.embedPng(await (await fetch(png)).arrayBuffer());
      page.drawImage(img, { x: 0, y: 0, width: w, height: h });
      const bytes = await doc.save();
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${(title || "programme").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "programme"}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("Sorry — couldn't build the PDF. Try Print instead and choose “Save as PDF”.");
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "h-9";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* ── Controls ── */}
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <Label>Start from</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                aria-pressed={preset === p.id}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  preset === p.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="pm-org">School / organisation</Label>
            <Input id="pm-org" value={organisation} onChange={(e) => setOrganisation(e.target.value)} placeholder="Optional" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-title">Event name</Label>
            <Input id="pm-title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-heading">Heading</Label>
            <Input id="pm-heading" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Programme" className={inputCls} />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Items</Label>
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={numbered} onChange={(e) => setNumbered(e.target.checked)} /> Numbered</label>
              <label className="flex items-center gap-1.5"><input type="checkbox" checked={showTimes} onChange={(e) => setShowTimes(e.target.checked)} /> Times</label>
            </div>
          </div>
          <ol className="flex flex-col gap-2">
            {items.map((it, i) => (
              <li key={it.id} className="flex items-start gap-1.5">
                <span className="mt-2 w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                {showTimes && (
                  <Input aria-label={`Time for item ${i + 1}`} value={it.time} onChange={(e) => update(it.id, "time", e.target.value)} placeholder="10:00" className="h-9 w-20 shrink-0" />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Input aria-label={`Item ${i + 1}`} value={it.text} onChange={(e) => update(it.id, "text", e.target.value)} placeholder="Item" className={inputCls} />
                  {it.note !== "" || it.text.toLowerCase().includes("address") || it.text.toLowerCase().includes("speech") ? (
                    <Input aria-label={`Detail for item ${i + 1}`} value={it.note} onChange={(e) => update(it.id, "note", e.target.value)} placeholder="Speaker or detail (optional)" className="h-8 text-xs" />
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-0.5">
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUpIcon /></Button>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><ArrowDownIcon /></Button>
                  <Button type="button" variant="ghost" size="icon-sm" onClick={() => remove(it.id)} disabled={items.length === 1} aria-label="Remove"><XIcon /></Button>
                </div>
              </li>
            ))}
          </ol>
          <Button type="button" variant="outline" size="sm" onClick={add} className="self-start">
            <PlusIcon /> Add item
          </Button>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-date">Date</Label>
            <Input id="pm-date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Leave blank to write by hand" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-time">Time</Label>
            <Input id="pm-time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 9:00 a.m." className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-venue">Venue</Label>
            <Input id="pm-venue" value={venue} onChange={(e) => setVenue(e.target.value)} className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-by">Organised by</Label>
            <Input id="pm-by" value={organisedBy} onChange={(e) => setOrganisedBy(e.target.value)} className={inputCls} />
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">Any field left empty prints as a dotted line, ready to fill in by hand.</p>
        </section>

        <section className="flex flex-col gap-3">
          <Label>Style</Label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                aria-pressed={style === s.id}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  style === s.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAccent(c)}
                  aria-label={`Colour ${c}`}
                  className={cn("size-7 rounded-full ring-offset-2 ring-offset-background", accent === c && "ring-2 ring-primary")}
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 text-sm">
              {(["a4", "a5"] as const).map((p) => (
                <button key={p} type="button" onClick={() => setPaper(p)} className={cn("rounded-md px-2.5 py-1", paper === p ? "bg-muted font-medium" : "text-muted-foreground")}>
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm hover:border-primary/50">
              <ImagePlusIcon className="size-4" /> {logo ? "Change logo" : "Add logo / crest"}
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => pickLogo(e.target.files?.[0])} />
            </label>
            {logo && (
              <button type="button" onClick={() => setLogo(null)} className="text-xs text-muted-foreground hover:text-foreground">Remove logo</button>
            )}
          </div>
        </section>

        <div className="flex flex-wrap gap-2">
          <Button onClick={downloadPdf} disabled={busy}>
            {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon />} Download PDF
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <PrinterIcon /> Print
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {/* ── Preview ── */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div ref={frameRef} className="w-full">
          <div className="pm-print-frame mx-auto overflow-hidden rounded-md shadow-xl ring-1 ring-black/5" style={{ width: size.w * scale, height: size.h * scale }}>
            <div className="pm-print-scale" style={{ width: size.w, height: size.h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              <ProgrammePage
                ref={pageRef}
                style={style}
                accent={accent}
                paper={paper}
                logo={logo}
                organisation={organisation}
                title={title}
                heading={heading}
                items={items}
                numbered={numbered}
                showTimes={showTimes}
                fields={[["Date", date], ["Time", time], ["Venue", venue], ["Organised by", organisedBy]]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Print: only the page, at real size, on its own sheet. */}
      <style>{`
@media print {
  @page { size: ${paper === "a4" ? "A4" : "A5"}; margin: 0; }
  body * { visibility: hidden !important; }
  #pm-page, #pm-page * { visibility: visible !important; }
  #pm-page { position: fixed !important; left: 0; top: 0; }
  .pm-print-scale { transform: none !important; }
}`}</style>
    </div>
  );
}

// ── The printable page ───────────────────────────────────────────────────────

const ProgrammePage = React.forwardRef<HTMLDivElement, {
  style: StyleId;
  accent: string;
  paper: Paper;
  logo: string | null;
  organisation: string;
  title: string;
  heading: string;
  items: Item[];
  numbered: boolean;
  showTimes: boolean;
  fields: [string, string][];
}>(function ProgrammePage(p, ref) {
  const { w, h } = PAGE[p.paper];
  const small = p.paper === "a5";
  const k = small ? 0.72 : 1; // type scale for A5
  const serif = p.style === "classic" || p.style === "elegant" || p.style === "crest";
  const centered = p.style !== "modern";
  const rows = p.items.filter((it) => it.text.trim());
  // Size the list to the sheet: a short programme gets larger type and more
  // air so it fills the page; a long one tightens so it still fits on one.
  const n = Math.max(1, rows.length);
  const density = n <= 6 ? 1.35 : n <= 9 ? 1.2 : n <= 12 ? 1.08 : n <= 15 ? 0.92 : 0.82;

  return (
    <div
      id="pm-page"
      ref={ref}
      style={{
        width: w,
        height: h,
        background: "#fff",
        color: "#1f2937",
        fontFamily: serif ? "Georgia, 'Times New Roman', 'Noto Serif', 'Noto Serif Sinhala', 'Noto Serif Tamil', serif" : "Inter, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Sinhala', 'Noto Sans Tamil', sans-serif",
        position: "relative",
        boxSizing: "border-box",
        padding: (small ? 40 : 64) * (p.style === "minimal" ? 1.1 : 1),
        display: "flex",
        flexDirection: "column",
        textAlign: centered ? "center" : "left",
      }}
    >
      {/* Frames */}
      {p.style === "classic" && (
        <>
          <div style={{ position: "absolute", inset: small ? 14 : 22, border: `3px double ${p.accent}` }} />
          <div style={{ position: "absolute", inset: small ? 22 : 34, border: `1px solid ${p.accent}55` }} />
        </>
      )}
      {p.style === "elegant" && (
        <div style={{ position: "absolute", inset: small ? 16 : 26, border: `1px solid ${p.accent}`, borderRadius: 4 }}>
          {[{ top: -7, left: -7 }, { top: -7, right: -7 }, { bottom: -7, left: -7 }, { bottom: -7, right: -7 }].map((pos, i) => (
            <span key={i} style={{ position: "absolute", width: 14, height: 14, background: "#fff", border: `1px solid ${p.accent}`, transform: "rotate(45deg)", ...pos }} />
          ))}
        </div>
      )}
      {p.style === "crest" && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: small ? 10 : 16, background: p.accent }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: small ? 10 : 16, background: p.accent }} />
          <div style={{ position: "absolute", inset: small ? 20 : 32, border: `1.5px solid ${p.accent}` }} />
        </>
      )}
      {p.style === "modern" && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: small ? 10 : 16, background: p.accent }} />}

      <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        {/* Header */}
        {p.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.logo} alt="" style={{ height: 72 * k, width: "auto", objectFit: "contain", margin: centered ? "0 auto 10px" : "0 0 10px", display: "block" }} />
        )}
        {p.organisation.trim() && (
          <div style={{ fontSize: 15 * k, letterSpacing: "0.14em", textTransform: "uppercase", color: p.accent, fontWeight: 700 }}>{p.organisation}</div>
        )}
        {p.title.trim() && (
          <div style={{ marginTop: 8 * k, fontSize: (p.style === "elegant" ? 32 : 28) * k, fontWeight: p.style === "elegant" ? 400 : 700, fontStyle: p.style === "elegant" ? "italic" : "normal", lineHeight: 1.2, color: "#111827" }}>
            {p.title}
          </div>
        )}
        <div style={{ margin: `${18 * k}px ${centered ? "auto" : "0"} ${8 * k}px`, display: "flex", alignItems: "center", gap: 12, justifyContent: centered ? "center" : "flex-start" }}>
          {centered && <span style={{ height: 1, width: 56 * k, background: p.accent }} />}
          <span style={{ fontSize: 20 * k, letterSpacing: p.style === "modern" ? "0.02em" : "0.24em", textTransform: "uppercase", fontWeight: 700, color: p.accent, fontFamily: p.style === "modern" ? "inherit" : undefined }}>
            {p.heading || "Programme"}
          </span>
          {centered && <span style={{ height: 1, width: 56 * k, background: p.accent }} />}
        </div>

        {/* Items */}
        <ol style={{ listStyle: "none", margin: `${14 * k}px 0 0`, padding: 0, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 * k * density * density }}>
          {rows.map((it, i) => (
            <li
              key={it.id}
              style={{
                display: "grid",
                gridTemplateColumns: `${p.showTimes ? `${78 * k * density}px ` : ""}${p.numbered ? `${32 * k * density}px ` : ""}1fr`,
                alignItems: "baseline",
                columnGap: 10 * k,
                textAlign: "left",
                maxWidth: centered ? 520 * k : "none",
                width: "100%",
                margin: centered ? "0 auto" : 0,
                paddingBottom: 9 * k * density,
                borderBottom: p.style === "minimal" ? "none" : `1px dotted ${p.accent}40`,
              }}
            >
              {p.showTimes && <span style={{ fontSize: 14 * k * density, color: p.accent, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{it.time}</span>}
              {p.numbered && <span style={{ fontSize: 15 * k * density, color: p.accent, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{i + 1}.</span>}
              <span style={{ fontSize: 16.5 * k * density, lineHeight: 1.35 }}>
                {it.text}
                {it.note.trim() && <span style={{ display: "block", fontSize: 12.5 * k, color: "#6b7280", fontStyle: "italic" }}>{it.note}</span>}
              </span>
            </li>
          ))}
        </ol>

        {/* Details — blanks become dotted lines to fill by hand */}
        <div style={{ marginTop: 22 * k, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 28 * k, rowGap: 12 * k, textAlign: "left", fontSize: 14 * k }}>
          {p.fields.map(([label, value]) => (
            <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontWeight: 700, color: p.accent, whiteSpace: "nowrap" }}>{label}:</span>
              {value.trim() ? (
                <span>{value}</span>
              ) : (
                <span style={{ flex: 1, borderBottom: "1.5px dotted #9ca3af", height: 14 * k }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
