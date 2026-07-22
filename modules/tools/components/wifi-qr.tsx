"use client";

import * as React from "react";
import Link from "next/link";
import { DownloadIcon, SparklesIcon } from "lucide-react";

import { qrToPngDataUrl } from "@/modules/qr/render";
import { downloadDataUrl } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SECURITY = [
  { value: "WPA", label: "WPA/WPA2/WPA3" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "No password" },
];

function escapeWifi(s: string) {
  return s.replace(/([\\;,:"])/g, "\\$1");
}

export function WifiQr() {
  const [ssid, setSsid] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [security, setSecurity] = React.useState("WPA");
  const [hidden, setHidden] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);

  const payload = ssid.trim()
    ? `WIFI:T:${security};S:${escapeWifi(ssid)};P:${security === "nopass" ? "" : escapeWifi(password)};${hidden ? "H:true;" : ""};`
    : "";

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!payload) {
        if (!cancelled) setPreview(null);
        return;
      }
      try {
        const url = await qrToPngDataUrl({
          data: payload,
          fgColor: "#000000",
          bgColor: "#ffffff",
          size: 512,
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
  }, [payload]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-[1fr_220px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ssid">Network name (SSID)</Label>
            <Input id="ssid" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="MyHomeWiFi" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Security</Label>
            <Select items={SECURITY} value={security} onValueChange={(v) => setSecurity(v as string)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SECURITY.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {security !== "nopass" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="wifi-pass">Password</Label>
              <Input id="wifi-pass" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Network password" />
            </div>
          )}
          <label className="flex items-center gap-2 text-sm font-medium select-none">
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} className="size-4 accent-primary" />
            Hidden network
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="WiFi QR code" className="size-full object-contain p-3" />
            ) : (
              <span className="p-4 text-center text-xs text-muted-foreground">Enter a network name.</span>
            )}
          </div>
          <Button onClick={() => preview && downloadDataUrl(preview, "wifi-qr.png")} disabled={!preview}>
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
              Want branded QR codes with a logo, plus dynamic codes and scan
              analytics? It&apos;s free to start.
            </p>
          </div>
          <Button size="sm" render={<Link href="/signup" />}>Create a free account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
