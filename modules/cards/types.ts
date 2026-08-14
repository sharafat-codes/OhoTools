// Shared card model for the animated card / invitation maker. v1 encodes the
// whole card into the share link (no DB) — including a small downscaled photo —
// so this type is the single source of truth for editor and public renderer.

export const CARD_THEMES = {
  festive: { name: "Festive", bg1: "#7c3aed", bg2: "#db2777", accent: "#fbbf24", text: "#ffffff" },
  midnight: { name: "Midnight", bg1: "#0f172a", bg2: "#4338ca", accent: "#38bdf8", text: "#ffffff" },
  sunset: { name: "Sunset", bg1: "#f97316", bg2: "#db2777", accent: "#fde68a", text: "#ffffff" },
  ocean: { name: "Ocean", bg1: "#0ea5e9", bg2: "#6366f1", accent: "#a7f3d0", text: "#ffffff" },
  rose: { name: "Rose", bg1: "#e11d48", bg2: "#9333ea", accent: "#fecdd3", text: "#ffffff" },
} as const;

export type CardTheme = keyof typeof CARD_THEMES;

export type TemplateId = "classic" | "elegant" | "playful" | "luxe" | "neon" | "romantic";

export const CARD_TEMPLATES: { id: TemplateId; name: string; pro?: boolean }[] = [
  { id: "classic", name: "Classic" },
  { id: "romantic", name: "Romantic" },
  { id: "elegant", name: "Elegant" },
  { id: "playful", name: "Playful" },
  { id: "luxe", name: "Golden Luxe", pro: true },
  { id: "neon", name: "Neon Glow", pro: true },
];

export type CardEffect = "confetti" | "hearts" | "stars";

export type Occasion = "birthday" | "wedding" | "engagement" | "anniversary";

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
    templates: ["classic", "elegant", "playful", "luxe", "neon"],
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
    templates: ["romantic", "elegant", "luxe", "neon"],
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
    templates: ["romantic", "elegant", "luxe", "neon"],
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
    templates: ["romantic", "elegant", "luxe", "neon"],
    toLabel: "Names",
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

/** A fresh card pre-filled for an occasion. */
export function defaultCard(occasion: Occasion = "birthday"): CardData {
  const o = OCCASIONS[occasion];
  return {
    occasion,
    template: o.template,
    to: occasion === "birthday" ? "Sarah" : "Aisha & Bilal",
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
const OCCASION_IDS: readonly string[] = ["birthday", "wedding", "engagement", "anniversary"];

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
  };
}
