// Data-driven unit-conversion pages. Each pair below becomes its own tool page
// (e.g. /tools/feet-to-cm) via the app/tools/[slug] dynamic route, and a
// generated DevTool entry so it flows through search, categories, the sitemap,
// and metadata like every other tool — no per-page boilerplate.
import { RulerIcon, WeightIcon, ThermometerIcon, type LucideIcon } from "lucide-react";

import type { DevTool } from "./registry";

type Category = "length" | "weight" | "temperature";
type TempKey = "c" | "f" | "k";

type Unit = {
  slug: string; // URL piece: "feet", "cm", "celsius"
  name: string; // "Feet"
  singular: string; // "foot"
  plural: string; // "feet"
  symbol: string; // "ft"
  toBase: number; // linear factor to the category base (ignored for temperature)
};

// Length base = meter, weight base = kilogram.
const U = {
  // length
  mm: { slug: "mm", name: "Millimeters", singular: "millimeter", plural: "millimeters", symbol: "mm", toBase: 0.001 },
  cm: { slug: "cm", name: "Centimeters", singular: "centimeter", plural: "centimeters", symbol: "cm", toBase: 0.01 },
  m: { slug: "meters", name: "Meters", singular: "meter", plural: "meters", symbol: "m", toBase: 1 },
  km: { slug: "km", name: "Kilometers", singular: "kilometer", plural: "kilometers", symbol: "km", toBase: 1000 },
  inch: { slug: "inches", name: "Inches", singular: "inch", plural: "inches", symbol: "in", toBase: 0.0254 },
  foot: { slug: "feet", name: "Feet", singular: "foot", plural: "feet", symbol: "ft", toBase: 0.3048 },
  yard: { slug: "yards", name: "Yards", singular: "yard", plural: "yards", symbol: "yd", toBase: 0.9144 },
  mile: { slug: "miles", name: "Miles", singular: "mile", plural: "miles", symbol: "mi", toBase: 1609.344 },
  // weight
  g: { slug: "grams", name: "Grams", singular: "gram", plural: "grams", symbol: "g", toBase: 0.001 },
  kg: { slug: "kg", name: "Kilograms", singular: "kilogram", plural: "kilograms", symbol: "kg", toBase: 1 },
  oz: { slug: "ounces", name: "Ounces", singular: "ounce", plural: "ounces", symbol: "oz", toBase: 0.028349523125 },
  lb: { slug: "lbs", name: "Pounds", singular: "pound", plural: "pounds", symbol: "lb", toBase: 0.45359237 },
  stone: { slug: "stone", name: "Stone", singular: "stone", plural: "stone", symbol: "st", toBase: 6.35029318 },
  // temperature (toBase unused — handled by formulas)
  c: { slug: "celsius", name: "Celsius", singular: "degree Celsius", plural: "degrees Celsius", symbol: "°C", toBase: 1 },
  f: { slug: "fahrenheit", name: "Fahrenheit", singular: "degree Fahrenheit", plural: "degrees Fahrenheit", symbol: "°F", toBase: 1 },
  k: { slug: "kelvin", name: "Kelvin", singular: "kelvin", plural: "kelvin", symbol: "K", toBase: 1 },
} satisfies Record<string, Unit>;

type UnitKey = keyof typeof U;

// The pairs we expose as pages, ordered by search demand. Each entry generates
// one page at /tools/{from.slug}-to-{to.slug}.
const PAIRS: { cat: Category; from: UnitKey; to: UnitKey }[] = [
  // length
  { cat: "length", from: "foot", to: "cm" },
  { cat: "length", from: "cm", to: "foot" },
  { cat: "length", from: "foot", to: "m" },
  { cat: "length", from: "m", to: "foot" },
  { cat: "length", from: "cm", to: "inch" },
  { cat: "length", from: "inch", to: "cm" },
  { cat: "length", from: "mm", to: "inch" },
  { cat: "length", from: "inch", to: "mm" },
  { cat: "length", from: "km", to: "mile" },
  { cat: "length", from: "mile", to: "km" },
  { cat: "length", from: "m", to: "yard" },
  { cat: "length", from: "yard", to: "m" },
  { cat: "length", from: "foot", to: "inch" },
  { cat: "length", from: "inch", to: "foot" },
  // weight
  { cat: "weight", from: "kg", to: "lb" },
  { cat: "weight", from: "lb", to: "kg" },
  { cat: "weight", from: "g", to: "oz" },
  { cat: "weight", from: "oz", to: "g" },
  { cat: "weight", from: "kg", to: "stone" },
  { cat: "weight", from: "stone", to: "kg" },
  { cat: "weight", from: "lb", to: "oz" },
  { cat: "weight", from: "oz", to: "lb" },
  // temperature
  { cat: "temperature", from: "c", to: "f" },
  { cat: "temperature", from: "f", to: "c" },
  { cat: "temperature", from: "c", to: "k" },
  { cat: "temperature", from: "k", to: "c" },
  { cat: "temperature", from: "f", to: "k" },
  { cat: "temperature", from: "k", to: "f" },
];

// --- conversion math -------------------------------------------------------

function toCelsius(v: number, key: TempKey): number {
  if (key === "c") return v;
  if (key === "f") return (v - 32) * (5 / 9);
  return v - 273.15; // kelvin
}
function fromCelsius(c: number, key: TempKey): number {
  if (key === "c") return c;
  if (key === "f") return c * (9 / 5) + 32;
  return c + 273.15; // kelvin
}

/** Convert `v` from one unit key to another (same category). */
export function convertValue(v: number, from: UnitKey, to: UnitKey, cat: Category): number {
  if (cat === "temperature") return fromCelsius(toCelsius(v, from as TempKey), to as TempKey);
  return (v * U[from].toBase) / U[to].toBase;
}

/** Compact, human-friendly number: ~6 significant figures, trailing zeros trimmed. */
export function fmt(n: number): string {
  if (!Number.isFinite(n)) return "";
  const abs = Math.abs(n);
  let s = abs !== 0 && (abs < 1e-4 || abs >= 1e9) ? n.toExponential(4) : n.toPrecision(6);
  if (s.includes(".") && !s.includes("e")) s = s.replace(/\.?0+$/, "");
  return s;
}

const TEMP_FORMULA: Record<string, string> = {
  "c-f": "°F = (°C × 9/5) + 32",
  "f-c": "°C = (°F − 32) × 5/9",
  "c-k": "K = °C + 273.15",
  "k-c": "°C = K − 273.15",
  "f-k": "K = (°F − 32) × 5/9 + 273.15",
  "k-f": "°F = (K − 273.15) × 9/5 + 32",
};

// Sample "from" values for the reference table, per category / unit.
function tableInputs(cat: Category, from: UnitKey): number[] {
  if (cat === "temperature") {
    if (from === "c") return [0, 20, 25, 37, 100];
    if (from === "f") return [0, 32, 68, 98.6, 212];
    return [0, 273.15, 300, 310, 373.15]; // kelvin
  }
  return [1, 5, 10, 25, 50, 100];
}

// A representative starting value so the page shows a real result on load.
function defaultInput(cat: Category, from: UnitKey): number {
  if (cat === "temperature") return from === "c" ? 20 : from === "f" ? 68 : 300;
  return 1;
}

// --- view model for the client component -----------------------------------

export type ConversionView = {
  slug: string;
  reverseSlug?: string; // opposite direction page, if it exists (for the swap button)
  from: { name: string; symbol: string; plural: string };
  to: { name: string; symbol: string; plural: string };
  kind: "linear" | "temp";
  factor?: number; // from→to multiplier (linear only)
  temp?: { from: TempKey; to: TempKey };
  formula: string;
  defaultValue: number;
  table: { from: number; to: number }[];
};

function findPair(slug: string) {
  return PAIRS.find((p) => `${U[p.from].slug}-to-${U[p.to].slug}` === slug);
}

/** Serializable data the <Converter> client component needs, or undefined. */
export function getConversionView(slug: string): ConversionView | undefined {
  const p = findPair(slug);
  if (!p) return undefined;
  const from = U[p.from];
  const to = U[p.to];
  const isTemp = p.cat === "temperature";
  const factor = isTemp ? undefined : from.toBase / to.toBase;
  const formula = isTemp
    ? TEMP_FORMULA[`${p.from}-${p.to}`]
    : `1 ${from.symbol} = ${fmt(from.toBase / to.toBase)} ${to.symbol}`;
  const table = tableInputs(p.cat, p.from).map((v) => ({
    from: v,
    to: convertValue(v, p.from, p.to, p.cat),
  }));
  const reverseSlug = `${to.slug}-to-${from.slug}`;
  return {
    slug,
    reverseSlug: findPair(reverseSlug) ? reverseSlug : undefined,
    from: { name: from.name, symbol: from.symbol, plural: from.plural },
    to: { name: to.name, symbol: to.symbol, plural: to.plural },
    kind: isTemp ? "temp" : "linear",
    factor,
    temp: isTemp ? { from: p.from as TempKey, to: p.to as TempKey } : undefined,
    formula,
    defaultValue: defaultInput(p.cat, p.from),
    table,
  };
}

// --- generated registry entries --------------------------------------------

const CAT_ICON: Record<Category, LucideIcon> = {
  length: RulerIcon,
  weight: WeightIcon,
  temperature: ThermometerIcon,
};

/** All conversion page slugs — used for generateStaticParams and the category. */
export const conversionSlugs: string[] = PAIRS.map((p) => `${U[p.from].slug}-to-${U[p.to].slug}`);

function siblings(cat: Category, self: string): string[] {
  return conversionSlugs.filter((s) => s !== self && findPair(s)?.cat === cat).slice(0, 3);
}

function buildTool(p: (typeof PAIRS)[number]): DevTool {
  const from = U[p.from];
  const to = U[p.to];
  const slug = `${from.slug}-to-${to.slug}`;
  const reverse = `${to.slug}-to-${from.slug}`;
  const isTemp = p.cat === "temperature";
  const factor = from.toBase / to.toBase;
  const ex = defaultInput(p.cat, p.from);
  const exResult = fmt(convertValue(ex, p.from, p.to, p.cat));

  const description = isTemp
    ? `Convert ${from.name} to ${to.name} instantly. ${TEMP_FORMULA[`${p.from}-${p.to}`]}. Free, accurate ${from.symbol} to ${to.symbol} converter with a reference table — runs in your browser.`
    : `Convert ${from.plural} to ${to.plural} instantly. 1 ${from.singular} = ${fmt(factor)} ${to.plural}. Free ${from.symbol} to ${to.symbol} converter with the formula and a reference table — runs in your browser.`;

  const intro = isTemp
    ? `Convert temperatures from ${from.name} to ${to.name} in one step using ${TEMP_FORMULA[`${p.from}-${p.to}`]}. Type a value in either box to convert both ways — the result updates as you type, entirely in your browser.`
    : `Convert ${from.plural} to ${to.plural} in one step. One ${from.singular} equals ${fmt(factor)} ${to.plural}, so you multiply the number of ${from.plural} by ${fmt(factor)}. Type in either box to convert both ways — the result updates instantly, entirely in your browser.`;

  const faqs = isTemp
    ? [
        {
          q: `How do you convert ${from.name} to ${to.name}?`,
          a: `Use ${TEMP_FORMULA[`${p.from}-${p.to}`]}. For example, ${ex}${from.symbol} = ${exResult}${to.symbol}.`,
        },
        {
          q: `What is ${ex}${from.symbol} in ${to.name}?`,
          a: `${ex}${from.symbol} is ${exResult}${to.symbol}.`,
        },
      ]
    : [
        {
          q: `How do I convert ${from.plural} to ${to.plural}?`,
          a: `Multiply the number of ${from.plural} by ${fmt(factor)}. For example, ${ex} ${from.plural} × ${fmt(factor)} = ${exResult} ${to.plural}.`,
        },
        {
          q: `How many ${to.plural} are in a ${from.singular}?`,
          a: `One ${from.singular} equals ${fmt(factor)} ${to.plural}.`,
        },
      ];

  const keywords = [
    `${from.plural} to ${to.plural}`,
    `${from.symbol} to ${to.symbol}`,
    `${from.plural} to ${to.symbol}`,
    `convert ${from.plural} to ${to.plural}`,
    `${from.plural} to ${to.plural} converter`,
  ];

  return {
    slug,
    name: `${from.name} to ${to.name}`,
    tagline: `Convert ${from.plural} (${from.symbol}) to ${to.plural} (${to.symbol}).`,
    description,
    keywords,
    icon: CAT_ICON[p.cat],
    intro,
    steps: [
      "Enter the value you want to convert.",
      "Read the converted result instantly — no button to press.",
      "Type in either box to convert both ways, or use the reference table for common values.",
    ],
    faqs,
    related: [reverse, ...siblings(p.cat, slug), "unit-converter"],
  };
}

/** Generated DevTool entries for every conversion pair. */
export const conversionTools: DevTool[] = PAIRS.map(buildTool);
