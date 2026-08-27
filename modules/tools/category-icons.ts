import {
  SparklesIcon,
  FilmIcon,
  AudioLinesIcon,
  CropIcon,
  NotebookPenIcon,
  CodeIcon,
  GlobeIcon,
  ArrowLeftRightIcon,
  FileTextIcon,
  CalculatorIcon,
  TypeIcon,
  DicesIcon,
  RulerIcon,
  Gamepad2Icon,
  PartyPopperIcon,
  type LucideIcon,
} from "lucide-react";

// One icon per tool category, keyed by the registry category name. Shared by the
// homepage showcase and the dashboard category list so the two stay in sync and
// every category reads as visually distinct (no repeated "sparkle" icon).
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  AI: SparklesIcon,
  "Video & GIF": FilmIcon,
  Audio: AudioLinesIcon,
  "Image Editing": CropIcon,
  Productivity: NotebookPenIcon,
  Developer: CodeIcon,
  "Web & SEO": GlobeIcon,
  Converters: ArrowLeftRightIcon,
  PDF: FileTextIcon,
  Calculators: CalculatorIcon,
  Text: TypeIcon,
  Generators: DicesIcon,
  "Unit Conversions": RulerIcon,
  "Games & Tests": Gamepad2Icon,
  "Cards & Invitations": PartyPopperIcon,
};

/** Resolve a category's icon, falling back to the AI sparkle for anything new. */
export function categoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? SparklesIcon;
}
