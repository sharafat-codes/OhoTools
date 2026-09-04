import { conversionSlugs } from "@/modules/tools/conversions";

// Tools that make sense as standalone embeds on someone else's site: fully
// client-side, no login/quota, no file uploads, genuinely useful in isolation.
// Calculators and unit converters are what bloggers actually embed, so those
// are the focus. (AI, PDF, image-editing, and file-upload tools are excluded.)
export const EMBED_DEDICATED_SLUGS = [
  // Calculators
  "bmi-calculator",
  "calorie-calculator",
  "bmr-calculator",
  "compound-interest-calculator",
  "loan-calculator",
  "percentage-calculator",
  "age-calculator",
  "tip-calculator",
  "discount-calculator",
  "ideal-weight-calculator",
  "gpa-calculator",
  "fraction-calculator",
  "gst-vat-calculator",
  "aspect-ratio-calculator",
  "time-calculator",
  "sales-tax-calculator",
  "average-calculator",
  // Generators & utilities
  "qr-code",
  "password-generator",
  "hash-generator",
  "bcrypt-generator",
  "uuid-generator",
  "lorem-ipsum",
  "color-converter",
  "color-contrast-checker",
  "word-counter",
  "case-converter",
  "random-number-generator",
  "password-strength-checker",
] as const;

const dedicatedSet = new Set<string>(EMBED_DEDICATED_SLUGS);
const conversionSet = new Set<string>(conversionSlugs);

// Every slug that has an /embed/<slug> page: the curated dedicated tools plus
// all unit conversions (they share one component, so they're free to include).
export const embeddableSlugs: string[] = [...EMBED_DEDICATED_SLUGS, ...conversionSlugs];

export function isEmbeddable(slug: string): boolean {
  return dedicatedSet.has(slug) || conversionSet.has(slug);
}

export function isEmbedConversion(slug: string): boolean {
  return conversionSet.has(slug);
}

// A sensible starting iframe height. The embed page auto-resizes via postMessage
// once loaded, so this only needs to be close enough to avoid a big initial jump.
const TALL: Record<string, number> = {
  "qr-code": 680,
  "calorie-calculator": 640,
  "bmr-calculator": 620,
  "compound-interest-calculator": 600,
  "loan-calculator": 600,
  "invoice-generator": 720,
  "password-generator": 560,
  "password-strength-checker": 560,
};

export function embedHeight(slug: string): number {
  if (conversionSet.has(slug)) return 380;
  return TALL[slug] ?? 520;
}
