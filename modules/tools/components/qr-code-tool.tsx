"use client";

import * as React from "react";
import Link from "next/link";
import { DownloadIcon, SparklesIcon } from "lucide-react";

import { qrToPngDataUrl } from "@/modules/qr/render";
import { downloadDataUrl, toFileStem } from "@/lib/download";
import { ColorField } from "@/components/color-field";
import { SliderField } from "@/components/slider-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export function QrCodeTool() {
  const [data, setData] = React.useState("https://");
  const [fg, setFg] = React.useState("#000000");
  const [bg, setBg] = React.useState("#ffffff");
  const [size, setSize] = React.useState(512);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!data.trim()) {
        if (!cancelled) setPreview(null);
        return;
      }
      try {
        const url = await qrToPngDataUrl({
          data,
          fgColor: fg,
          bgColor: bg,
          size,
          margin: 2,
          ecLevel: "M",
        });
        if (!cancelled) setPreview(url);
      } catch {
        if (!cancelled) setPreview(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [data, fg, bg, size]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-[1fr_220px]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="qr-data">Content</Label>
            <Input
              id="qr-data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="https://example.com or any text"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField label="Foreground" value={fg} onChange={setFg} />
            <ColorField label="Background" value={bg} onChange={setBg} />
          </div>
          <SliderField label="Size" value={size} min={128} max={1024} step={16} suffix="px" onChange={setSize} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="QR code preview" className="size-full object-contain p-3" />
            ) : (
              <span className="p-4 text-center text-xs text-muted-foreground">Enter content to preview.</span>
            )}
          </div>
          <Button
            onClick={() => preview && downloadDataUrl(preview, `${toFileStem(data, "qrcode")}.png`)}
            disabled={!preview}
          >
            <DownloadIcon />
            Download PNG
          </Button>
        </div>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2">
            <SparklesIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Want a <strong className="text-foreground">logo</strong>, a{" "}
              <strong className="text-foreground">dynamic QR</strong> you can edit
              after printing, <strong className="text-foreground">scan analytics</strong>,
              SVG/PDF export, and saved history? It&apos;s free.
            </p>
          </div>
          <Button size="sm" render={<Link href="/signup" />}>
            Unlock with a free account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
