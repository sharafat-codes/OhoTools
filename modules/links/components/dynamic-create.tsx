"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  LoaderCircleIcon,
  LockIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";

import { qrToPngDataUrl } from "@/modules/qr/render";
import { createDynamicLink } from "@/modules/links/actions";
import { downloadDataUrl, toFileStem } from "@/lib/download";
import { ColorField } from "@/components/color-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DynamicCreate({ isPro }: { isPro: boolean }) {
  const [name, setName] = React.useState("");
  const [targetUrl, setTargetUrl] = React.useState("https://");
  const [fgColor, setFgColor] = React.useState("#000000");
  const [bgColor, setBgColor] = React.useState("#ffffff");
  const [creating, setCreating] = React.useState(false);
  const [created, setCreated] = React.useState<{ id: string; url: string } | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!created) {
        if (!cancelled) setPreview(null);
        return;
      }
      try {
        const url = await qrToPngDataUrl({
          data: created.url,
          fgColor,
          bgColor,
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
  }, [created, fgColor, bgColor]);

  if (!isPro) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="grid size-10 place-items-center rounded-full bg-muted">
            <LockIcon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-heading font-medium">Dynamic QR codes are a Pro feature</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Print once, change the destination anytime, and track every scan
              with analytics.
            </p>
          </div>
          <Button render={<Link href="/dashboard/billing" />}>Upgrade to Pro</Button>
        </CardContent>
      </Card>
    );
  }

  async function create() {
    if (!targetUrl.trim()) {
      toast.error("Enter a destination URL.");
      return;
    }
    setCreating(true);
    const res = await createDynamicLink({
      name: name || undefined,
      targetUrl,
      fgColor,
      bgColor,
    });
    setCreating(false);
    if (!res || "error" in res) {
      toast.error(res?.error ?? "Could not create the link.");
      return;
    }
    setCreated({ id: res.id, url: res.url });
    toast.success("Dynamic QR created.");
  }

  async function copy() {
    if (!created) return;
    try {
      await navigator.clipboard.writeText(created.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy.");
    }
  }

  if (created) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your dynamic QR is ready</CardTitle>
          <CardDescription>
            Print or share it — you can change where it points anytime.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5">
          <div className="w-full max-w-[240px] overflow-hidden rounded-lg border border-border">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Dynamic QR" className="w-full" />
            )}
          </div>

          <div className="flex w-full max-w-sm items-center gap-2">
            <Input value={created.url} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={copy} aria-label="Copy link">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={() =>
                preview &&
                downloadDataUrl(preview, `${toFileStem(name || "dynamic-qr", "dynamic-qr")}.png`)
              }
              disabled={!preview}
            >
              <DownloadIcon />
              Download PNG
            </Button>
            <Button variant="outline" render={<Link href={`/dashboard/links/${created.id}`} />}>
              <SettingsIcon />
              Manage & analytics
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setCreated(null);
                setName("");
                setTargetUrl("https://");
              }}
            >
              <PlusIcon />
              Create another
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a dynamic QR</CardTitle>
        <CardDescription>
          The QR encodes a short link you control — edit the destination later
          without reprinting.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex max-w-lg flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dyn-url">Destination URL</Label>
          <Input
            id="dyn-url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com/landing"
            type="url"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dyn-name">Name (optional)</Label>
          <Input
            id="dyn-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spring campaign"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField label="Foreground" value={fgColor} onChange={setFgColor} />
          <ColorField label="Background" value={bgColor} onChange={setBgColor} />
        </div>
        <Button onClick={create} disabled={creating} className="w-fit">
          {creating ? <LoaderCircleIcon className="animate-spin" /> : <PlusIcon />}
          Create dynamic QR
        </Button>
      </CardContent>
    </Card>
  );
}
