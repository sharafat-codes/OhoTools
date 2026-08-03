// Data-driven image-format converter pages (jpg-to-png, png-to-webp, …). Like
// the unit conversions: one table generates a client-side <canvas> converter,
// a DevTool entry, and a page served by the app/tools/[slug] dynamic route.
import { ImageIcon } from "lucide-react";

import type { DevTool } from "./registry";

type Fmt = {
  slug: string; // url piece + file extension, e.g. "jpg"
  name: string; // "JPG"
  full: string; // "JPEG"
  mime: string; // canvas encode/decode mime
};

const F = {
  jpg: { slug: "jpg", name: "JPG", full: "JPEG", mime: "image/jpeg" },
  png: { slug: "png", name: "PNG", full: "PNG", mime: "image/png" },
  webp: { slug: "webp", name: "WebP", full: "WebP", mime: "image/webp" },
  avif: { slug: "avif", name: "AVIF", full: "AVIF", mime: "image/avif" },
} satisfies Record<string, Fmt>;

type FmtKey = keyof typeof F;

// Only high-search pairs whose TARGET encodes via canvas.toBlob (png/jpeg/webp).
// AVIF is a decode-only source (browsers can't reliably encode AVIF on canvas).
const PAIRS: { from: FmtKey; to: FmtKey }[] = [
  { from: "jpg", to: "png" },
  { from: "png", to: "jpg" },
  { from: "jpg", to: "webp" },
  { from: "webp", to: "jpg" },
  { from: "png", to: "webp" },
  { from: "webp", to: "png" },
  { from: "avif", to: "jpg" },
  { from: "avif", to: "png" },
];

export type ImageFormatView = {
  slug: string;
  from: { name: string; full: string };
  to: { name: string; full: string; mime: string; ext: string };
};

function findPair(slug: string) {
  return PAIRS.find((p) => `${F[p.from].slug}-to-${F[p.to].slug}` === slug);
}

/** Serializable data the client converter needs, or undefined for an unknown slug. */
export function getImageFormatView(slug: string): ImageFormatView | undefined {
  const p = findPair(slug);
  if (!p) return undefined;
  const from = F[p.from];
  const to = F[p.to];
  return {
    slug,
    from: { name: from.name, full: from.full },
    to: { name: to.name, full: to.full, mime: to.mime, ext: to.slug },
  };
}

export const imageFormatSlugs: string[] = PAIRS.map((p) => `${F[p.from].slug}-to-${F[p.to].slug}`);

function siblings(self: string): string[] {
  return imageFormatSlugs.filter((s) => s !== self).slice(0, 3);
}

function buildTool(p: (typeof PAIRS)[number]): DevTool {
  const from = F[p.from];
  const to = F[p.to];
  const slug = `${from.slug}-to-${to.slug}`;
  const reverse = `${to.slug}-to-${from.slug}`;
  const losesAlpha = to.mime === "image/jpeg";

  return {
    slug,
    name: `${from.name} to ${to.name}`,
    tagline: `Convert ${from.name} images to ${to.name}.`,
    description: `Free ${from.name} to ${to.name} converter. Convert ${from.full} images to ${to.full} right in your browser — fast and private, with no upload, no watermark, and no sign-up.`,
    keywords: [
      `${from.slug} to ${to.slug}`,
      `convert ${from.name} to ${to.name}`,
      `${from.name} to ${to.name} converter`,
      `${from.slug} to ${to.slug} online`,
      `${from.name.toLowerCase()} to ${to.name.toLowerCase()}`,
    ],
    icon: ImageIcon,
    intro: `Convert ${from.full} images to ${to.full} instantly. Drop a ${from.name} file and it's converted in your browser, ready to download as ${to.name} — nothing is uploaded and there's no watermark.${
      losesAlpha ? ` Note that ${to.name} has no transparency, so transparent areas become a white background.` : ""
    }`,
    steps: [
      `Drop or select your ${from.name} image.`,
      `It converts to ${to.name} automatically.`,
      `Download the ${to.name} file.`,
    ],
    faqs: [
      {
        q: `Is the ${from.name} to ${to.name} converter free?`,
        a: "Yes — it's completely free with no watermark and no sign-up, and it runs entirely in your browser.",
      },
      losesAlpha
        ? {
            q: `Will I lose transparency converting to ${to.name}?`,
            a: `${to.name} images can't store transparency, so any transparent areas are filled with a white background. Convert to PNG or WebP if you need to keep transparency.`,
          }
        : {
            q: "Are my images uploaded to a server?",
            a: "No — the conversion happens locally in your browser, so your images never leave your device.",
          },
    ],
    related: [reverse, ...siblings(slug), "image-converter"].filter((s, i, a) => a.indexOf(s) === i),
  };
}

/** Generated DevTool entries for every image-format pair. */
export const imageFormatTools: DevTool[] = PAIRS.map(buildTool);
