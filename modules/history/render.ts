import { qrToPngDataUrl } from "@/modules/qr/render";
import { barcodeToDataUrl } from "@/modules/barcode/render";
import type { HistoryItem } from "@/modules/history/types";

/**
 * Regenerate a saved asset to a PNG data URL (client-side). `full` uses the
 * saved resolution for downloads; otherwise a smaller thumbnail is produced.
 */
export async function renderHistoryItem(
  item: HistoryItem,
  opts?: { full?: boolean },
): Promise<string> {
  if (item.kind === "qr") {
    return qrToPngDataUrl({
      data: item.data,
      fgColor: item.fgColor,
      bgColor: item.bgColor,
      size: opts?.full ? item.size : 256,
      margin: item.margin,
      ecLevel: item.ecLevel,
      moduleStyle: item.moduleStyle,
      gradient: item.gradient,
      fgColor2: item.fgColor2,
      logo: item.logo,
    });
  }
  return barcodeToDataUrl({
    data: item.data,
    format: item.format,
    scale: opts?.full ? item.scale : 2,
    height: item.height,
    includeText: item.includeText,
  });
}
