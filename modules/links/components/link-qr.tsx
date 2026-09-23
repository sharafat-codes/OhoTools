"use client";

import * as React from "react";
import { DownloadIcon, LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { qrToPngDataUrl } from "@/modules/qr/render";

/**
 * Re-renders a dynamic link's QR code so it can be downloaded again later.
 *
 * Previously the PNG existed only on the create-success screen: leave the page
 * and the printable asset was gone, with no way to get it back. Because the code
 * encodes the short URL (never the destination), it can be regenerated from the
 * short URL alone at any time — and re-downloading it is safe, since the image
 * is identical to the original no matter how often the destination changes.
 */
export function LinkQr({ url, filename }: { url: string; filename: string }) {
  const [src, setSrc] = React.useState<string | null>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    qrToPngDataUrl({ data: url, fgColor: "#000000", bgColor: "#ffffff", size: 512, margin: 2, ecLevel: "M" })
      .then((d) => { if (alive) setSrc(d); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [url]);

  if (failed) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Could not render the QR code.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid size-40 place-items-center rounded-xl border border-border bg-white p-2">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={`QR code for ${url}`} className="size-full" />
        ) : (
          <LoaderCircleIcon className="size-5 animate-spin text-muted-foreground" />
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={!src}
        render={<a href={src ?? "#"} download={`${filename}.png`} />}
      >
        <DownloadIcon />
        Download PNG
      </Button>
      <p className="max-w-[16rem] text-center text-xs text-muted-foreground">
        Reprinting is never needed. This code always points here, and you change
        where it leads from the Manage screen.
      </p>
    </div>
  );
}
