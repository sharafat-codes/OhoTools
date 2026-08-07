"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Each tool is code-split so an embed ships only its own tool's JS, never all
// of them. ssr:false is fine here — embed pages are noindex, so we don't need
// the tool server-rendered; the canonical /tools/<slug> page is the SEO target.
const loading = () => <div className="h-40 animate-pulse rounded-xl bg-muted/50" />;
const d = (loader: () => Promise<{ default: ComponentType }>) => dynamic(loader, { ssr: false, loading });

const MAP: Record<string, ComponentType> = {
  "bmi-calculator": d(() => import("./bmi-calculator").then((m) => ({ default: m.BmiCalculator }))),
  "calorie-calculator": d(() => import("./calorie-calculator").then((m) => ({ default: m.CalorieCalculator }))),
  "bmr-calculator": d(() => import("./bmr-calculator").then((m) => ({ default: m.BmrCalculator }))),
  "compound-interest-calculator": d(() =>
    import("./compound-interest-calculator").then((m) => ({ default: m.CompoundInterestCalculator })),
  ),
  "loan-calculator": d(() => import("./loan-calculator").then((m) => ({ default: m.LoanCalculator }))),
  "percentage-calculator": d(() => import("./percentage-calculator").then((m) => ({ default: m.PercentageCalculator }))),
  "age-calculator": d(() => import("./age-calculator").then((m) => ({ default: m.AgeCalculator }))),
  "tip-calculator": d(() => import("./tip-calculator").then((m) => ({ default: m.TipCalculator }))),
  "discount-calculator": d(() => import("./discount-calculator").then((m) => ({ default: m.DiscountCalculator }))),
  "ideal-weight-calculator": d(() => import("./ideal-weight-calculator").then((m) => ({ default: m.IdealWeightCalculator }))),
  "gpa-calculator": d(() => import("./gpa-calculator").then((m) => ({ default: m.GpaCalculator }))),
  "fraction-calculator": d(() => import("./fraction-calculator").then((m) => ({ default: m.FractionCalculator }))),
  "gst-vat-calculator": d(() => import("./gst-vat-calculator").then((m) => ({ default: m.GstVatCalculator }))),
  "aspect-ratio-calculator": d(() => import("./aspect-ratio-calculator").then((m) => ({ default: m.AspectRatioCalculator }))),
  "time-calculator": d(() => import("./time-calculator").then((m) => ({ default: m.TimeCalculator }))),
  "qr-code": d(() => import("./qr-code-tool").then((m) => ({ default: m.QrCodeTool }))),
  "password-generator": d(() => import("./password-generator").then((m) => ({ default: m.PasswordGenerator }))),
  "hash-generator": d(() => import("./hash-generator").then((m) => ({ default: m.HashGenerator }))),
  "bcrypt-generator": d(() => import("./bcrypt-generator").then((m) => ({ default: m.BcryptGenerator }))),
  "uuid-generator": d(() => import("./uuid-tool").then((m) => ({ default: m.UuidTool }))),
  "lorem-ipsum": d(() => import("./lorem-ipsum").then((m) => ({ default: m.LoremIpsum }))),
  "color-converter": d(() => import("./color-converter").then((m) => ({ default: m.ColorConverter }))),
  "color-contrast-checker": d(() => import("./color-contrast-checker").then((m) => ({ default: m.ColorContrastChecker }))),
  "word-counter": d(() => import("./word-counter").then((m) => ({ default: m.WordCounter }))),
  "case-converter": d(() => import("./case-converter").then((m) => ({ default: m.CaseConverter }))),
  "random-number-generator": d(() => import("./random-number-generator").then((m) => ({ default: m.RandomNumberGenerator }))),
  "password-strength-checker": d(() => import("./password-strength-checker").then((m) => ({ default: m.PasswordStrengthChecker }))),
};

export function EmbedTool({ slug }: { slug: string }) {
  const Tool = MAP[slug];
  if (!Tool) return null;
  return <Tool />;
}
