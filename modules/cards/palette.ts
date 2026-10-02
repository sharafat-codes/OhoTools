import { resolveTheme, type CardData, type TemplateId } from "@/modules/cards/types";

/**
 * The colours the invitation website below a card should wear.
 *
 * Preset themes (CARD_THEMES) only describe the handful of gradient templates.
 * The premium templates paint their own worlds — near-black and gold, ivory
 * and sage, cream marble — and ignore the theme entirely. If the page beneath
 * them read the theme, a moody dark-floral opening would scroll straight into
 * hot pink. So each template declares the backdrop its sections continue onto,
 * and whether text on it should be light or dark.
 */
export type SitePalette = {
  /** CSS background for the whole site body. */
  bg: string;
  accent: string;
  /** "light" = light text on a dark backdrop; "dark" = dark text on a light one. */
  ink: "light" | "dark";
};

const TEMPLATE_PALETTE: Record<TemplateId, SitePalette> = {
  classic:      { bg: "linear-gradient(180deg,#5b21b6 0%,#7c3aed 45%,#be185d 100%)", accent: "#fde68a", ink: "light" },
  festival:     { bg: "linear-gradient(180deg,#022c22 0%,#047857 50%,#022c22 100%)", accent: "#facc15", ink: "light" },
  romantic:     { bg: "linear-gradient(180deg,#881337 0%,#be123c 45%,#6b21a8 100%)", accent: "#fecdd3", ink: "light" },
  elegant:      { bg: "radial-gradient(ellipse at 50% 0%,#2a2440,#0a0a0c 70%)", accent: "#e7c873", ink: "light" },
  playful:      { bg: "linear-gradient(180deg,#c2410c 0%,#f97316 45%,#db2777 100%)", accent: "#fff7ed", ink: "light" },
  luxe:         { bg: "radial-gradient(ellipse at 50% 0%,#2b2410,#0a0a0c 70%)", accent: "#e7c873", ink: "light" },
  neon:         { bg: "radial-gradient(ellipse at 50% 0%,#10131f,#060711 70%)", accent: "#38bdf8", ink: "light" },
  botanical:    { bg: "linear-gradient(180deg,#fdfbf7 0%,#eef1e6 100%)", accent: "#5f7a55", ink: "dark" },
  monogram:     { bg: "radial-gradient(ellipse at 50% 0%,#1d2437,#0d101a 70%)", accent: "#d9b96c", ink: "light" },
  mehndi:       { bg: "linear-gradient(180deg,#0f4436 0%,#1c2a24 55%,#3d0f1c 100%)", accent: "#e9c46a", ink: "light" },
  editorial:    { bg: "linear-gradient(180deg,#faf7f2 0%,#f2ece2 100%)", accent: "#8a6a3f", ink: "dark" },
  wish:         { bg: "radial-gradient(ellipse at 50% 100%,#4a2f18,#0c0805 70%)", accent: "#ffb84d", ink: "light" },
  polaroid:     { bg: "linear-gradient(180deg,#f2e7d5 0%,#e4d3b7 100%)", accent: "#9c4531", ink: "dark" },
  retro:        { bg: "linear-gradient(180deg,#fdf6e3 0%,#f7e9c9 100%)", accent: "#c62f3b", ink: "dark" },
  darkfloral:   { bg: "linear-gradient(180deg,#0a0c0b 0%,#2a1020 45%,#0f1a15 100%)", accent: "#d9b96c", ink: "light" },
  marble:       { bg: "linear-gradient(180deg,#fbfaf7 0%,#e9e3d8 100%)", accent: "#9a7a3f", ink: "dark" },
  stringlights: { bg: "linear-gradient(180deg,#1a130d 0%,#2e2116 50%,#120d09 100%)", accent: "#ffc861", ink: "light" },
};

export function sitePalette(d: CardData): SitePalette {
  // A Pro custom colour set is the one case where the host chose the palette
  // deliberately, so it wins over the template's default.
  if (d.custom) {
    const t = resolveTheme(d);
    return { bg: `linear-gradient(180deg,${t.bg1} 0%,${t.bg2} 100%)`, accent: t.accent, ink: "light" };
  }
  return TEMPLATE_PALETTE[d.template] ?? TEMPLATE_PALETTE.romantic;
}
