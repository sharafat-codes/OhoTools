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

export const CARD_TEMPLATES = [
  { id: "classic", name: "Classic" },
  { id: "elegant", name: "Elegant" },
  { id: "playful", name: "Playful" },
] as const;

export type TemplateId = (typeof CARD_TEMPLATES)[number]["id"];
export type CardEffect = "confetti" | "hearts" | "stars";

export type CardData = {
  occasion: "birthday";
  template: TemplateId;
  to: string;
  from: string;
  message: string;
  theme: CardTheme;
  /** Small downscaled JPEG data URI (embedded in the link), optional. */
  photo?: string;
  music?: boolean;
  effect?: CardEffect;
};

export const DEFAULT_CARD: CardData = {
  occasion: "birthday",
  template: "classic",
  to: "Sarah",
  from: "Alex",
  message: "Wishing you the happiest of birthdays! May your year ahead be full of joy, laughter, and cake. 🎂",
  theme: "festive",
  music: false,
  effect: "confetti",
};

const TEMPLATE_IDS = CARD_TEMPLATES.map((t) => t.id) as readonly string[];
const EFFECTS: readonly string[] = ["confetti", "hearts", "stars"];

export function normalizeCard(input: Partial<CardData> | null | undefined): CardData {
  const d = input ?? {};
  const theme = (d.theme && d.theme in CARD_THEMES ? d.theme : "festive") as CardTheme;
  const template = (d.template && TEMPLATE_IDS.includes(d.template) ? d.template : "classic") as TemplateId;
  const effect = (d.effect && EFFECTS.includes(d.effect) ? d.effect : "confetti") as CardEffect;
  // Guard the embedded photo: must be a data image and small enough for a link.
  const photo =
    typeof d.photo === "string" && d.photo.startsWith("data:image/") && d.photo.length < 200_000
      ? d.photo
      : undefined;
  return {
    occasion: "birthday",
    template,
    to: (d.to ?? "").toString().slice(0, 60) || DEFAULT_CARD.to,
    from: (d.from ?? "").toString().slice(0, 60),
    message: (d.message ?? "").toString().slice(0, 400) || DEFAULT_CARD.message,
    theme,
    photo,
    music: Boolean(d.music),
    effect,
  };
}
