// Shared card model for the animated card / invitation maker. v1 encodes the
// whole card into the share link (no DB), so this type is the single source of
// truth for both the editor and the public renderer.

export const CARD_THEMES = {
  festive: { name: "Festive", bg1: "#7c3aed", bg2: "#db2777", accent: "#fbbf24", text: "#ffffff" },
  midnight: { name: "Midnight", bg1: "#0f172a", bg2: "#4338ca", accent: "#38bdf8", text: "#ffffff" },
  sunset: { name: "Sunset", bg1: "#f97316", bg2: "#db2777", accent: "#fde68a", text: "#ffffff" },
  ocean: { name: "Ocean", bg1: "#0ea5e9", bg2: "#6366f1", accent: "#a7f3d0", text: "#ffffff" },
  rose: { name: "Rose", bg1: "#e11d48", bg2: "#9333ea", accent: "#fecdd3", text: "#ffffff" },
} as const;

export type CardTheme = keyof typeof CARD_THEMES;

export type CardData = {
  occasion: "birthday";
  template: "classic";
  to: string;
  from: string;
  message: string;
  theme: CardTheme;
};

export const DEFAULT_CARD: CardData = {
  occasion: "birthday",
  template: "classic",
  to: "Sarah",
  from: "Alex",
  message: "Wishing you the happiest of birthdays! May your year ahead be full of joy, laughter, and cake. 🎂",
  theme: "festive",
};

export function normalizeCard(input: Partial<CardData> | null | undefined): CardData {
  const d = input ?? {};
  const theme = (d.theme && d.theme in CARD_THEMES ? d.theme : "festive") as CardTheme;
  return {
    occasion: "birthday",
    template: "classic",
    to: (d.to ?? "").toString().slice(0, 60) || DEFAULT_CARD.to,
    from: (d.from ?? "").toString().slice(0, 60),
    message: (d.message ?? "").toString().slice(0, 400) || DEFAULT_CARD.message,
    theme,
  };
}
