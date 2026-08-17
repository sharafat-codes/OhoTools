"use client";

import * as React from "react";
import Link from "next/link";
import {
  DownloadIcon,
  FileImageIcon,
  FileTextIcon,
  ImagePlusIcon,
  LoaderCircleIcon,
  LockIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { qrToPngDataUrl, qrToSvgString, type EyeStyle, type GradientType } from "@/modules/qr/render";
import { downloadPdf, downloadSvg } from "@/modules/qr/export";
import { saveQRCode } from "@/modules/qr/actions";
import type {
  QRErrorLevel,
  QRModuleStyle,
} from "@/modules/qr/validations";
import { downloadDataUrl, toFileStem } from "@/lib/download";
import { SliderField } from "@/components/slider-field";
import { ColorField } from "@/components/color-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EC_ITEMS: { value: QRErrorLevel; label: string }[] = [
  { value: "L", label: "Low — 7%" },
  { value: "M", label: "Medium — 15%" },
  { value: "Q", label: "Quartile — 25%" },
  { value: "H", label: "High — 30%" },
];

const STYLE_ITEMS: { value: QRModuleStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
];

const EYE_ITEMS: { value: EyeStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "circle", label: "Circle" },
];

const GRAD_ITEMS: { value: GradientType; label: string }[] = [
  { value: "diagonal", label: "Diagonal" },
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
  { value: "radial", label: "Radial" },
];

async function fileToLogoDataUrl(file: File): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = raw;
  });
  const max = 256;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/png");
}

export function QrGenerator({ isPro }: { isPro: boolean }) {
  const [data, setData] = React.useState("https://");
  const [name, setName] = React.useState("");
  const [fgColor, setFgColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [size, setSize] = React.useState(512);
  const [margin, setMargin] = React.useState(2);
  const [ecLevel, setEcLevel] = React.useState<QRErrorLevel>("M");

  // Pro
  const [moduleStyle, setModuleStyle] = React.useState<QRModuleStyle>("square");
  const [eyeStyle, setEyeStyle] = React.useState<EyeStyle>("square");
  const [customEye, setCustomEye] = React.useState(false);
  const [eyeColor, setEyeColor] = React.useState("#000000");
  const [gradient, setGradient] = React.useState(false);
  const [fgColor2, setFgColor2] = React.useState("#4f46e5");
  const [gradientType, setGradientType] = React.useState<GradientType>("diagonal");
  const [transparent, setTransparent] = React.useState(false);
  const [logo, setLogo] = React.useState<string | null>(null);
  const [logoScale, setLogoScale] = React.useState(22);

  const [preview, setPreview] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const opts = React.useMemo(
    () => ({
      data,
      fgColor,
      bgColor,
      size,
      margin,
      ecLevel,
      moduleStyle,
      eyeStyle,
      eyeColor: customEye ? eyeColor : null,
      gradient,
      fgColor2,
      gradientType,
      transparent,
      logo,
      logoScale: logoScale / 100,
    }),
    [data, fgColor, bgColor, size, margin, ecLevel, moduleStyle, eyeStyle, customEye, eyeColor, gradient, fgColor2, gradientType, transparent, logo, logoScale],
  );

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!data.trim()) {
        if (!cancelled) setPreview(null);
        return;
      }
      try {
        const url = await qrToPngDataUrl(opts);
        if (!cancelled) setPreview(url);
      } catch {
        if (!cancelled) setPreview(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [opts, data]);

  async function handleLogo(file: File | undefined) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB.");
      return;
    }
    try {
      const url = await fileToLogoDataUrl(file);
      setLogo(url);
      setEcLevel("H"); // keep it scannable with a logo on top
    } catch {
      toast.error("Couldn't read that image.");
    }
  }

  function downloadPng() {
    if (preview) downloadDataUrl(preview, `${toFileStem(name || data, "qrcode")}.png`);
  }
  function downloadSvgFile() {
    downloadSvg(qrToSvgString(opts), `${toFileStem(name || data, "qrcode")}.svg`);
  }
  function downloadPdfFile() {
    if (preview) downloadPdf(preview, `${toFileStem(name || data, "qrcode")}.pdf`);
  }

  async function handleSave() {
    if (!data.trim()) {
      toast.error("Add some content first.");
      return;
    }
    setSaving(true);
    const res = await saveQRCode({
      name: name || undefined,
      data,
      fgColor,
      bgColor,
      size,
      margin,
      ecLevel,
      moduleStyle,
      gradient,
      fgColor2,
      logo,
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
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content & style</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="qr-data">Content</Label>
              <Textarea
                id="qr-data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="https://example.com or any text"
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="qr-name">Name (optional)</Label>
              <Input
                id="qr-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Menu QR"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField label="Foreground" value={fgColor} onChange={setFgColor} />
              <ColorField label="Background" value={bgColor} onChange={setBgColor} />
            </div>

            <label className="flex w-fit items-center gap-2 text-sm font-medium select-none">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="size-4 accent-primary"
              />
              Transparent background
            </label>

            <SliderField label="Size" value={size} min={128} max={1024} step={16} suffix="px" onChange={setSize} />
            <SliderField label="Quiet zone" value={margin} min={0} max={10} step={1} suffix=" modules" onChange={setMargin} />

            <div className="flex flex-col gap-2">
              <Label>Error correction</Label>
              <Select items={EC_ITEMS} value={ecLevel} onValueChange={(v) => setEcLevel(v as QRErrorLevel)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EC_ITEMS.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pro: branding & style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Branding & shape
              {!isPro && (
                <Badge
                  variant="secondary"
                  className="border-primary/30 bg-primary/10 text-primary"
                  render={<Link href="/dashboard/billing" />}
                >
                  <LockIcon className="size-3" />
                  Pro
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent
            className={cnDisabled(!isPro, "flex flex-col gap-5")}
            aria-disabled={!isPro}
          >
            <div className="flex flex-col gap-2">
              <Label>Module shape</Label>
              <Select
                items={STYLE_ITEMS}
                value={moduleStyle}
                onValueChange={(v) => setModuleStyle(v as QRModuleStyle)}
                disabled={!isPro}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STYLE_ITEMS.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Eye shape (corners)</Label>
              <Select
                items={EYE_ITEMS}
                value={eyeStyle}
                onValueChange={(v) => setEyeStyle(v as EyeStyle)}
                disabled={!isPro}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EYE_ITEMS.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium select-none">
                <input
                  type="checkbox"
                  checked={customEye}
                  disabled={!isPro}
                  onChange={(e) => setCustomEye(e.target.checked)}
                  className="size-4 accent-primary"
                />
                Custom eye color
              </label>
              {customEye && <ColorField label="Eye color" value={eyeColor} onChange={setEyeColor} disabled={!isPro} />}
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium select-none">
                <input
                  type="checkbox"
                  checked={gradient}
                  disabled={!isPro}
                  onChange={(e) => setGradient(e.target.checked)}
                  className="size-4 accent-primary"
                />
                Color gradient
              </label>
              {gradient && (
                <>
                  <ColorField label="Gradient end" value={fgColor2} onChange={setFgColor2} disabled={!isPro} />
                  <div className="flex flex-col gap-2">
                    <Label>Gradient direction</Label>
                    <Select
                      items={GRAD_ITEMS}
                      value={gradientType}
                      onValueChange={(v) => setGradientType(v as GradientType)}
                      disabled={!isPro}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GRAD_ITEMS.map((i) => (
                          <SelectItem key={i.value} value={i.value}>
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Center logo</Label>
              {logo ? (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo} alt="logo" className="size-10 rounded-md border border-border object-contain" />
                  <Button variant="outline" size="sm" onClick={() => setLogo(null)} disabled={!isPro}>
                    <XIcon />
                    Remove
                  </Button>
                </div>
              ) : (
                <label className={cnDisabled(!isPro, "flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-input px-2.5 py-1.5 text-sm hover:bg-muted")}>
                  <ImagePlusIcon className="size-4" />
                  Upload logo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={!isPro}
                    onChange={(e) => handleLogo(e.target.files?.[0])}
                  />
                </label>
              )}
              <p className="text-xs text-muted-foreground">PNG/SVG, centered. Error correction is raised to High automatically.</p>
              {logo && (
                <SliderField label="Logo size" value={logoScale} min={10} max={30} step={1} suffix="%" onChange={setLogoScale} />
              )}
            </div>

            {!isPro && (
              <Link href="/dashboard/billing" className="text-xs font-medium text-primary hover:underline">
                Upgrade to Pro to unlock branding →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-[repeating-conic-gradient(var(--color-muted)_0%_25%,transparent_0%_50%)] bg-size-[16px_16px]">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="QR code preview" className="size-full object-contain p-4" />
              ) : (
                <span className="p-6 text-center text-sm text-muted-foreground">
                  Enter content to preview your QR code.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={downloadPng} disabled={!preview}>
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
              <Button variant="outline" onClick={handleSave} disabled={saving || !preview}>
                {saving ? <LoaderCircleIcon className="animate-spin" /> : <SaveIcon />}
                Save to history
              </Button>
              {!isPro && (
                <p className="text-center text-xs text-muted-foreground">
                  SVG & PDF export are{" "}
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

function cnDisabled(disabled: boolean, base: string) {
  return disabled ? `${base} pointer-events-none opacity-55` : base;
}
