"use client";

import * as React from "react";
import Link from "next/link";
import {
  DownloadIcon,
  FileImageIcon,
  FileTextIcon,
  LoaderCircleIcon,
  LockIcon,
  SaveIcon,
} from "lucide-react";
import { toast } from "sonner";

import { barcodeToDataUrl, barcodeToSvgString } from "@/modules/barcode/render";
import { saveBarcode } from "@/modules/barcode/actions";
import { downloadSvg, downloadPdf } from "@/modules/qr/export";
import { BARCODE_FORMATS, type BarcodeFormat } from "@/modules/barcode/constants";
import { downloadDataUrl, toFileStem } from "@/lib/download";
import { SliderField } from "@/components/slider-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FORMAT_ITEMS = BARCODE_FORMATS.map((f) => ({ value: f.value, label: f.label }));

export function BarcodeGenerator({ isPro }: { isPro: boolean }) {
  const [data, setData] = React.useState("ABC-12345");
  const [name, setName] = React.useState("");
  const [format, setFormat] = React.useState<BarcodeFormat>("code128");
  const [scale, setScale] = React.useState(3);
  const [height, setHeight] = React.useState(60);
  const [includeText, setIncludeText] = React.useState(true);

  const [preview, setPreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const current = BARCODE_FORMATS.find((f) => f.value === format);

  React.useEffect(() => {
    let cancelled = false;
    // Defer so setState isn't called synchronously in the effect body, and so
    // the browser-only render runs client-side.
    Promise.resolve().then(() => {
      if (cancelled) return;
      if (!data.trim()) {
        setPreview(null);
        setError(null);
        return;
      }
      try {
        setPreview(barcodeToDataUrl({ data, format, scale, height, includeText }));
        setError(null);
      } catch {
        setPreview(null);
        setError(
          `"${data}" isn't valid for ${current?.label ?? format}. Try the example: ${current?.example ?? ""}`,
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [data, format, scale, height, includeText, current]);

  function handleDownload() {
    if (!preview) return;
    downloadDataUrl(preview, `${toFileStem(name || data, "barcode")}.png`);
  }

  function downloadSvgFile() {
    try {
      downloadSvg(
        barcodeToSvgString({ data, format, scale, height, includeText }),
        `${toFileStem(name || data, "barcode")}.svg`,
      );
    } catch {
      toast.error("Couldn't export this barcode as SVG.");
    }
  }

  function downloadPdfFile() {
    if (preview) downloadPdf(preview, `${toFileStem(name || data, "barcode")}.pdf`);
  }

  async function handleSave() {
    if (!preview) {
      toast.error("Fix the barcode content first.");
      return;
    }
    setSaving(true);
    const res = await saveBarcode({
      name: name || undefined,
      data,
      format,
      scale,
      height,
      includeText,
    });
    setSaving(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Saved to your history.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Content & format</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label>Format</Label>
            <Select
              items={FORMAT_ITEMS}
              value={format}
              onValueChange={(v) => setFormat(v as BarcodeFormat)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BARCODE_FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bc-data">Content</Label>
            <Input
              id="bc-data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder={current?.example}
              aria-invalid={!!error}
            />
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Example: {current?.example}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="bc-name">Name (optional)</Label>
            <Input
              id="bc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Product SKU"
            />
          </div>

          <SliderField
            label="Scale"
            value={scale}
            min={1}
            max={8}
            step={1}
            suffix="×"
            onChange={setScale}
          />
          <SliderField
            label="Bar height"
            value={height}
            min={10}
            max={120}
            step={2}
            onChange={setHeight}
          />

          <label className="flex items-center gap-2 text-sm font-medium select-none">
            <input
              type="checkbox"
              checked={includeText}
              onChange={(e) => setIncludeText(e.target.checked)}
              className="size-4 accent-primary"
            />
            Show text below barcode
          </label>
        </CardContent>
      </Card>

      {/* Preview */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-4">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Barcode preview"
                  className="max-h-56 max-w-full object-contain"
                />
              ) : (
                <span className="text-center text-sm text-muted-foreground">
                  {error ? "Can't render — check the content." : "Enter content to preview your barcode."}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleDownload} disabled={!preview}>
                <DownloadIcon />
                Download PNG
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={downloadSvgFile} disabled={!preview || !isPro}>
                  {isPro ? <FileImageIcon /> : <LockIcon />}
                  SVG
                </Button>
                <Button variant="outline" onClick={downloadPdfFile} disabled={!preview || !isPro}>
                  {isPro ? <FileTextIcon /> : <LockIcon />}
                  PDF
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saving || !preview}
              >
                {saving ? <LoaderCircleIcon className="animate-spin" /> : <SaveIcon />}
                Save to history
              </Button>
              {!isPro && (
                <p className="text-center text-xs text-muted-foreground">
                  SVG &amp; PDF export are{" "}
                  <Link href="/dashboard/billing" className="font-medium text-primary hover:underline">
                    Pro
                  </Link>
                  .
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
