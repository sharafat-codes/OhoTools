"use client";

import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { toCanvas } from "html-to-image";

import { CardStage } from "@/modules/cards/components/card-stage";
import type { CardData } from "@/modules/cards/types";

// Exported stills and videos used to be drawn from scratch — a gradient with
// the text on top — which meant they ignored `template` entirely. Someone who
// chose Mehndi Nights or Make a Wish downloaded a plain gradient, and every new
// design made that worse.
//
// So instead of re-implementing each design for export, the real component is
// mounted off-screen at export size and photographed. Every template is
// supported automatically, including ones added later, and what downloads is
// what the preview showed.

// 4:5 — the aspect the card stage is designed around, and what Instagram wants.
//
// These are CSS pixels, not output pixels. The designs size their type with
// container queries and clamp() ceilings, so laying the card out at 1080px wide
// would peg every heading at its maximum and export something noticeably
// smaller-typed than the preview. Laying out at phone-ish width and scaling the
// raster up keeps the proportions the person actually chose.
export const EXPORT_W = 540;
export const EXPORT_H = 675;
/** Output is EXPORT_W x EXPORT_SCALE wide — 1080x1350. */
export const EXPORT_SCALE = 2;

/**
 * Entrance animations are `both`-filled and settle within about 1.2s. Capturing
 * earlier catches the card mid-fade, with the name half transparent.
 */
const SETTLE_MS = 1400;

let seq = 0;

export async function captureCard(
  data: CardData,
  width = EXPORT_W,
  height = EXPORT_H,
): Promise<HTMLCanvasElement> {
  const id = `oho-card-capture-${++seq}`;

  // Hiding the card while it renders is fussier than it looks. It cannot be
  // display:none or visibility:hidden (no layout, and the designs size their
  // type with container queries, which need a real width), and it cannot be
  // pushed off-screen either: html-to-image copies the computed style onto the
  // clone, and that includes the LOGICAL inset properties. A negative `left`
  // is overridden by the options, but `inset-inline: -400px ...` is serialised
  // after it and wins on re-parse, so the clone lands outside its own viewport
  // and the capture comes back empty.
  //
  // So the card is laid out at the origin, at full size, inside a zero-sized
  // clipping wrapper. The wrapper is not part of the capture, so none of this
  // reaches the clone.
  const clip = document.createElement("div");
  clip.setAttribute("aria-hidden", "true");
  clip.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;overflow:hidden;pointer-events:none;z-index:-1";

  const host = document.createElement("div");
  host.id = id;
  host.style.cssText = [
    "position:relative",
    `width:${width}px`,
    `height:${height}px`,
    "overflow:hidden",
    // Web fonts are not embedded in the capture (see skipFonts below), so
    // anything inheriting the site font would fall back to a serif default in
    // the exported file. Inherit a system stack the capture can resolve.
    "font-family:system-ui,'Segoe UI',Roboto,Arial,sans-serif",
  ].join(";");

  // React owns this inner element only, so the stylesheet below can sit beside
  // it without React reconciling it away.
  const mount = document.createElement("div");
  mount.style.cssText = "position:relative;width:100%;height:100%";
  host.appendChild(mount);
  clip.appendChild(host);
  document.body.appendChild(clip);
  const root = createRoot(mount);
  root.render(createElement(CardStage, { data, cta: false, interactive: false, sound: false }));

  try {
    await document.fonts?.ready?.catch?.(() => {});
    await new Promise((r) => setTimeout(r, SETTLE_MS));

    // Every template ships its own <style> block, and html-to-image clones
    // those along with the markup. Inside the cloned document the entrance
    // animations start over from zero, and because they are `both`-filled the
    // snapshot is taken at their `from` keyframe — opacity 0, i.e. a blank
    // image. Freezing animations first is what makes the capture show anything
    // at all. Scoped by id so the live page keeps animating.
    const freeze = document.createElement("style");
    // The confetti burst is a canvas mid-flight: frozen, it is a scatter of
    // half-fallen shards across the card rather than anything festive. The
    // video draws its own falling particles over this still, so it is not
    // wanted there either.
    freeze.textContent =
      `#${id} *,#${id} *::before,#${id} *::after{animation:none !important;transition:none !important}` +
      `#${id} canvas{display:none !important}`;
    host.appendChild(freeze);

    return await toCanvas(host, {
      width,
      height,
      pixelRatio: EXPORT_SCALE,
      cacheBust: true,
      // The designs use system font stacks (Georgia, Trebuchet MS, Segoe
      // Script). Embedding web fonts means fetching and parsing every
      // stylesheet on the page, which is slow and fails on any cross-origin
      // sheet — not worth it for fonts nothing here depends on.
      skipFonts: true,
      // The host is already at the origin, in flow and unscaled, so nothing
      // about its position needs correcting on the clone.
      style: { margin: "0" },
    });
  } finally {
    root.unmount();
    clip.remove();
  }
}

/** The captured card as a PNG blob. */
export async function captureCardBlob(data: CardData, width?: number, height?: number): Promise<Blob> {
  const canvas = await captureCard(data, width, height);
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob((b) => res(b), "image/png"));
  if (!blob) throw new Error("Could not encode the image.");
  return blob;
}

/** `wedding-card-aisha-bilal`, so the file says what it is. */
export function cardFileBase(data: CardData): string {
  const who = (data.to || "card").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return `${data.occasion}-card-${who || "card"}`;
}
