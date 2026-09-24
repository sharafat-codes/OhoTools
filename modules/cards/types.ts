// Shared card model for the animated card / invitation maker. v1 encodes the
// whole card into the share link (no DB) — including a small downscaled photo —
// so this type is the single source of truth for editor and public renderer.

import type { CSSProperties } from "react";

export const CARD_THEMES = {
  festive: { name: "Festive", bg1: "#7c3aed", bg2: "#db2777", accent: "#fbbf24", text: "#ffffff" },
  midnight: { name: "Midnight", bg1: "#0f172a", bg2: "#4338ca", accent: "#38bdf8", text: "#ffffff" },
  sunset: { name: "Sunset", bg1: "#f97316", bg2: "#db2777", accent: "#fde68a", text: "#ffffff" },
  ocean: { name: "Ocean", bg1: "#0ea5e9", bg2: "#6366f1", accent: "#a7f3d0", text: "#ffffff" },
  rose: { name: "Rose", bg1: "#e11d48", bg2: "#9333ea", accent: "#fecdd3", text: "#ffffff" },
  emerald: { name: "Emerald", bg1: "#047857", bg2: "#022c22", accent: "#facc15", text: "#ffffff" },
  marigold: { name: "Marigold", bg1: "#9a3412", bg2: "#581c87", accent: "#fde047", text: "#ffffff" },
  christmas: { name: "Christmas", bg1: "#7f1d1d", bg2: "#14532d", accent: "#fbbf24", text: "#ffffff" },
  newyear: { name: "New Year", bg1: "#0b1020", bg2: "#1e1b4b", accent: "#fde047", text: "#ffffff" },
} as const;

export type CardTheme = keyof typeof CARD_THEMES;

export type TemplateId =
  | "classic" | "elegant" | "playful" | "luxe" | "neon" | "romantic" | "festival"
  | "botanical" | "monogram" | "mehndi" | "editorial"
  | "wish" | "polaroid" | "retro";

// NOTE: the tool explainers in modules/tools/extras.ts quote how many designs
// each occasion offers and how many of them are Pro. Adding or moving a
// template here makes that prose wrong — update it in the same change.
export const CARD_TEMPLATES: { id: TemplateId; name: string; pro?: boolean }[] = [
  { id: "classic", name: "Classic" },
  { id: "festival", name: "Festival" },
  { id: "romantic", name: "Romantic" },
  { id: "elegant", name: "Elegant" },
  { id: "playful", name: "Playful" },
  { id: "botanical", name: "Botanical" },
  { id: "wish", name: "Make a Wish", pro: true },
  { id: "polaroid", name: "Polaroid", pro: true },
  { id: "retro", name: "Retro Pop", pro: true },
  { id: "monogram", name: "Gold Monogram", pro: true },
  { id: "mehndi", name: "Mehndi Nights", pro: true },
  { id: "editorial", name: "Editorial", pro: true },
  { id: "luxe", name: "Golden Luxe", pro: true },
  { id: "neon", name: "Neon Glow", pro: true },
];

export type CardEffect = "confetti" | "hearts" | "stars";

// ── Pro: per-element text styling (dashboard editor) ─────────────────────────
// Built-in font stacks only (no external fonts → fast, private, CSP-safe).
export const CARD_FONTS = {
  default: { name: "Default", stack: "" },
  sans: { name: "Sans", stack: "system-ui, 'Segoe UI', Arial, sans-serif" },
  serif: { name: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  rounded: { name: "Rounded", stack: "'Trebuchet MS', 'Segoe UI', system-ui, sans-serif" },
  mono: { name: "Mono", stack: "ui-monospace, 'Courier New', monospace" },
  script: { name: "Script", stack: "'Segoe Script', 'Brush Script MT', cursive" },
} as const;
export type FontKey = keyof typeof CARD_FONTS;

export type ElemStyle = {
  font?: FontKey;
  size?: number; // em multiplier of the element's responsive size (0.6–1.8)
  color?: string; // hex
  bold?: boolean;
  italic?: boolean;
};

export type StyleElement = "name" | "message" | "eyebrow" | "from";
export type CardStyles = Partial<Record<"global" | StyleElement, ElemStyle>>;

/** Inline style for a text element = global overrides merged with element ones. */
export function elemStyle(data: CardData, el: StyleElement): CSSProperties | undefined {
  const s = data.styles;
  if (!s) return undefined;
  const eff: ElemStyle = { ...(s.global ?? {}), ...(s[el] ?? {}) };
  const st: CSSProperties = {};
  if (eff.font && eff.font !== "default" && CARD_FONTS[eff.font]) st.fontFamily = CARD_FONTS[eff.font].stack;
  if (eff.color) {
    st.color = eff.color;
    // Override gradient/clip headlines so the chosen color actually shows.
    st.WebkitTextFillColor = eff.color;
    st.background = "none";
  }
  if (eff.bold) st.fontWeight = 800;
  if (eff.italic) st.fontStyle = "italic";
  if (eff.size && eff.size !== 1) st.fontSize = `${eff.size}em`;
  return Object.keys(st).length ? st : undefined;
}

export type Occasion =
  | "birthday" | "wedding" | "engagement" | "anniversary" | "eid" | "diwali" | "christmas" | "newyear"
  | "valentine" | "baby-shower" | "graduation" | "save-the-date";

export const OCCASIONS: Record<Occasion, {
  label: string;
  eyebrow: string;
  title: (to: string) => string;
  message: string;
  effect: CardEffect;
  theme: CardTheme;
  template: TemplateId;
  templates: TemplateId[];
  toLabel: string;
  toPlaceholder: string;
}> = {
  birthday: {
    label: "Birthday",
    eyebrow: "Happy Birthday",
    title: (to) => `Happy Birthday, ${to}!`,
    message: "Wishing you the happiest of birthdays! May your year ahead be full of joy, laughter, and cake. 🎂",
    effect: "confetti",
    theme: "festive",
    template: "classic",
    templates: ["classic", "elegant", "playful", "wish", "polaroid", "retro", "luxe", "neon"],
    toLabel: "Whose birthday is it?",
    toPlaceholder: "Name",
  },
  wedding: {
    label: "Wedding",
    eyebrow: "You're Invited",
    title: (to) => `Wedding Invitation — ${to}`,
    message: "With joyful hearts, we invite you to share in our happiness as we celebrate our wedding. Your presence would mean the world to us. 💍",
    effect: "hearts",
    theme: "rose",
    template: "romantic",
    templates: ["romantic", "botanical", "monogram", "mehndi", "editorial", "elegant", "luxe", "neon"],
    toLabel: "Couple's names",
    toPlaceholder: "Aisha & Bilal",
  },
  engagement: {
    label: "Engagement",
    eyebrow: "We're Engaged",
    title: (to) => `Engagement — ${to}`,
    message: "We're getting married! Please join us to celebrate our engagement and the beginning of our forever. 💕",
    effect: "hearts",
    theme: "rose",
    template: "romantic",
    templates: ["romantic", "botanical", "monogram", "mehndi", "editorial", "elegant", "luxe", "neon"],
    toLabel: "Couple's names",
    toPlaceholder: "Aisha & Bilal",
  },
  anniversary: {
    label: "Anniversary",
    eyebrow: "Happy Anniversary",
    title: (to) => `Happy Anniversary, ${to}!`,
    message: "Cheers to another year of love, laughter, and beautiful memories together. Here's to many more. 🥂",
    effect: "hearts",
    theme: "midnight",
    template: "elegant",
    templates: ["romantic", "botanical", "monogram", "editorial", "polaroid", "elegant", "luxe", "neon"],
    toLabel: "Names",
    toPlaceholder: "Aisha & Bilal",
  },
  eid: {
    label: "Eid",
    eyebrow: "Eid Mubarak",
    title: (to) => `Eid Mubarak, ${to}!`,
    message:
      "May this blessed Eid fill your home with joy, your heart with peace, and your days with countless blessings. Eid Mubarak to you and your loved ones! 🌙",
    effect: "stars",
    theme: "emerald",
    template: "festival",
    templates: ["festival", "mehndi", "monogram", "elegant", "luxe", "neon"],
    toLabel: "Who is it for?",
    toPlaceholder: "Name",
  },
  diwali: {
    label: "Diwali",
    eyebrow: "Happy Diwali",
    title: (to) => `Happy Diwali, ${to}!`,
    message:
      "Wishing you a Diwali full of light, laughter, and love. May the festival of lights brighten your life with happiness, health, and prosperity! 🪔",
    effect: "stars",
    theme: "marigold",
    template: "festival",
    templates: ["festival", "mehndi", "monogram", "elegant", "luxe", "neon"],
    toLabel: "Who is it for?",
    toPlaceholder: "Name",
  },
  christmas: {
    label: "Christmas",
    eyebrow: "Merry Christmas",
    title: (to) => `Merry Christmas, ${to}!`,
    message:
      "Wishing you a Christmas full of warmth, joy, and precious moments with the people you love. May your days be merry and bright! 🎄",
    effect: "stars",
    theme: "christmas",
    template: "festival",
    templates: ["festival", "elegant", "luxe", "neon"],
    toLabel: "Who is it for?",
    toPlaceholder: "Name",
  },
  newyear: {
    label: "New Year",
    eyebrow: "Happy New Year",
    title: (to) => `Happy New Year, ${to}!`,
    message:
      "Cheers to new beginnings! Wishing you a year ahead filled with happiness, health, success, and dreams come true. 🎉",
    effect: "confetti",
    theme: "newyear",
    template: "festival",
    templates: ["festival", "elegant", "luxe", "neon"],
    toLabel: "Who is it for?",
    toPlaceholder: "Name",
  },
  valentine: {
    label: "Valentine's",
    eyebrow: "Happy Valentine's Day",
    title: (to) => `Happy Valentine's Day, ${to}!`,
    message:
      "You make every day brighter. Thank you for being my favorite person — Happy Valentine's Day! ❤️",
    effect: "hearts",
    theme: "rose",
    template: "romantic",
    templates: ["romantic", "botanical", "editorial", "polaroid", "elegant", "luxe", "neon"],
    toLabel: "Who is it for?",
    toPlaceholder: "My Love",
  },
  "baby-shower": {
    label: "Baby Shower",
    eyebrow: "Baby Shower",
    title: (to) => `Baby Shower — ${to}`,
    message:
      "We're expecting! Please join us to celebrate the upcoming arrival of our little one. Your love and presence would mean so much. 👶",
    effect: "confetti",
    theme: "ocean",
    template: "playful",
    templates: ["playful", "botanical", "elegant", "romantic", "classic"],
    toLabel: "Parents-to-be",
    toPlaceholder: "Emma & Jack",
  },
  graduation: {
    label: "Graduation",
    eyebrow: "Congratulations",
    title: (to) => `Congratulations, ${to}!`,
    message:
      "Congratulations on your graduation! All your hard work has paid off — here's to your bright future ahead. 🎓",
    effect: "confetti",
    theme: "midnight",
    template: "elegant",
    templates: ["elegant", "editorial", "monogram", "polaroid", "classic", "luxe", "neon"],
    toLabel: "Graduate's name",
    toPlaceholder: "Name",
  },
  "save-the-date": {
    label: "Save the Date",
    eyebrow: "Save the Date",
    title: (to) => `Save the Date — ${to}`,
    message:
      "We're getting married! Save the date — a formal invitation will follow. We can't wait to celebrate this day with you. 💍",
    effect: "hearts",
    theme: "rose",
    template: "romantic",
    templates: ["romantic", "botanical", "monogram", "mehndi", "editorial", "elegant", "luxe", "neon"],
    toLabel: "Couple's names",
    toPlaceholder: "Aisha & Bilal",
  },
};

export type CardData = {
  occasion: Occasion;
  template: TemplateId;
  to: string;
  from: string;
  message: string;
  theme: CardTheme;
  /** Small downscaled JPEG data URI (embedded in the link), optional. */
  photo?: string;
  music?: boolean;
  effect?: CardEffect;
  /** Pro: custom colors that override the theme. */
  custom?: { bg1: string; bg2: string; accent: string };
  /** Pro: hide the "Made with OhoTool" watermark on the shared card. */
  noWatermark?: boolean;
  /** Pro: per-element text styling (font, size, color, bold, italic). */
  styles?: CardStyles;
  /** Optional event details for invitations (date/time/venue) — rides in the link. */
  event?: CardEvent;
  /** Collect RSVPs on the shared card (only works on saved cards with a short link). */
  rsvp?: boolean;
};

/** Structured event details for an invitation. `date` is YYYY-MM-DD, `time` is HH:MM. */
export type CardEvent = {
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
};

type ResolvedTheme = { bg1: string; bg2: string; accent: string; text: string };

/** The effective colors for a card — custom (Pro) overrides the preset theme. */
export function resolveTheme(d: CardData): ResolvedTheme {
  if (d.custom) {
    return { bg1: d.custom.bg1, bg2: d.custom.bg2, accent: d.custom.accent, text: "#ffffff" };
  }
  return CARD_THEMES[d.theme];
}

const HEX = /^#[0-9a-fA-F]{6}$/;
const FONT_KEYS = Object.keys(CARD_FONTS);

function cleanElem(e: unknown): ElemStyle | undefined {
  if (!e || typeof e !== "object") return undefined;
  const r = e as Record<string, unknown>;
  const out: ElemStyle = {};
  if (typeof r.font === "string" && FONT_KEYS.includes(r.font)) out.font = r.font as FontKey;
  if (typeof r.size === "number" && r.size >= 0.6 && r.size <= 1.8) out.size = r.size;
  if (typeof r.color === "string" && HEX.test(r.color)) out.color = r.color;
  if (r.bold === true) out.bold = true;
  if (r.italic === true) out.italic = true;
  return Object.keys(out).length ? out : undefined;
}

function cleanEvent(input: unknown): CardEvent | undefined {
  if (!input || typeof input !== "object") return undefined;
  const r = input as Record<string, unknown>;
  const str = (v: unknown, n: number) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, n) : undefined;
  const out: CardEvent = {
    date: str(r.date, 10),
    time: str(r.time, 5),
    venue: str(r.venue, 120),
    address: str(r.address, 200),
  };
  return out.date || out.time || out.venue || out.address ? out : undefined;
}

function cleanStyles(input: unknown): CardStyles | undefined {
  if (!input || typeof input !== "object") return undefined;
  const r = input as Record<string, unknown>;
  const out: CardStyles = {};
  (["global", "name", "message", "eyebrow", "from"] as const).forEach((k) => {
    const c = cleanElem(r[k]);
    if (c) out[k] = c;
  });
  return Object.keys(out).length ? out : undefined;
}

/** A fresh card pre-filled for an occasion. */
const DEFAULT_TO: Record<Occasion, string> = {
  birthday: "Sarah",
  wedding: "Aisha & Bilal",
  engagement: "Aisha & Bilal",
  anniversary: "Aisha & Bilal",
  eid: "Ahmed",
  diwali: "Priya",
  christmas: "Friend",
  newyear: "Friend",
  valentine: "My Love",
  "baby-shower": "Emma & Jack",
  graduation: "Sarah",
  "save-the-date": "Aisha & Bilal",
};

export function defaultCard(occasion: Occasion = "birthday"): CardData {
  const o = OCCASIONS[occasion];
  return {
    occasion,
    template: o.template,
    to: DEFAULT_TO[occasion],
    from: occasion === "birthday" ? "Alex" : "",
    message: o.message,
    theme: o.theme,
    music: false,
    effect: o.effect,
  };
}

export const DEFAULT_CARD: CardData = defaultCard("birthday");

const TEMPLATE_IDS = CARD_TEMPLATES.map((t) => t.id) as readonly string[];
const EFFECTS: readonly string[] = ["confetti", "hearts", "stars"];
const OCCASION_IDS: readonly string[] = ["birthday", "wedding", "engagement", "anniversary", "eid", "diwali", "christmas", "newyear", "valentine", "baby-shower", "graduation", "save-the-date"];

export function normalizeCard(input: Partial<CardData> | null | undefined): CardData {
  const d = input ?? {};
  const occasion = (d.occasion && OCCASION_IDS.includes(d.occasion) ? d.occasion : "birthday") as Occasion;
  const occ = OCCASIONS[occasion];
  const theme = (d.theme && d.theme in CARD_THEMES ? d.theme : occ.theme) as CardTheme;
  let template = (d.template && TEMPLATE_IDS.includes(d.template) ? d.template : occ.template) as TemplateId;
  if (!occ.templates.includes(template)) template = occ.template;
  const effect = (d.effect && EFFECTS.includes(d.effect) ? d.effect : occ.effect) as CardEffect;
  const photo =
    typeof d.photo === "string" && d.photo.startsWith("data:image/") && d.photo.length < 200_000
      ? d.photo
      : undefined;
  const custom =
    d.custom && HEX.test(d.custom.bg1 ?? "") && HEX.test(d.custom.bg2 ?? "") && HEX.test(d.custom.accent ?? "")
      ? { bg1: d.custom.bg1, bg2: d.custom.bg2, accent: d.custom.accent }
      : undefined;
  return {
    occasion,
    template,
    to: (d.to ?? "").toString().slice(0, 60) || defaultCard(occasion).to,
    from: (d.from ?? "").toString().slice(0, 60),
    message: (d.message ?? "").toString().slice(0, 400) || occ.message,
    theme,
    photo,
    music: Boolean(d.music),
    effect,
    custom,
    noWatermark: Boolean(d.noWatermark),
    styles: cleanStyles(d.styles),
    event: cleanEvent(d.event),
    rsvp: Boolean(d.rsvp),
  };
}
