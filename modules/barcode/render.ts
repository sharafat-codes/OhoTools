import bwipjs from "bwip-js/browser";

import type { BarcodeInput } from "@/modules/barcode/validations";

export type BarcodeOptions = Pick<
  BarcodeInput,
  "data" | "format" | "scale" | "height" | "includeText"
>;

/**
 * Render a barcode to a PNG data URL using an offscreen canvas. Runs
 * client-side. Throws when the content is invalid for the chosen symbology
 * (e.g. EAN-13 requires 12–13 digits) — callers should catch and surface it.
 */
export function barcodeToDataUrl(opts: BarcodeOptions): string {
  const canvas = document.createElement("canvas");
  bwipjs.toCanvas(canvas, {
    bcid: opts.format,
    text: opts.data,
    scale: opts.scale,
    height: opts.height,
    includetext: opts.includeText,
    textxalign: "center",
    paddingwidth: 6,
    paddingheight: 6,
    backgroundcolor: "FFFFFF",
  });
  return canvas.toDataURL("image/png");
}

/** Render a barcode to an SVG string (vector). Throws on invalid content. */
export function barcodeToSvgString(opts: BarcodeOptions): string {
  return bwipjs.toSVG({
    bcid: opts.format,
    text: opts.data,
    scale: opts.scale,
    height: opts.height,
    includetext: opts.includeText,
    textxalign: "center",
    paddingwidth: 6,
    paddingheight: 6,
  });
}
