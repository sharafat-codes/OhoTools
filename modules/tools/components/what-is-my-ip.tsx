"use client";

import * as React from "react";
import { CopyIcon, CheckIcon, GlobeIcon } from "lucide-react";

type ClientInfo = {
  browser: string;
  os: string;
  screen: string;
  viewport: string;
  dpr: string;
  timezone: string;
  language: string;
  cookies: string;
  online: string;
};

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) return "Microsoft Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/safari\//i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  return "Unknown browser";
}

function detectOS(ua: string): string {
  if (/windows nt 10/i.test(ua)) return "Windows 10/11";
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac os x/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown OS";
}

export function WhatIsMyIp({ ip }: { ip: string }) {
  const [copied, setCopied] = React.useState(false);
  const [info, setInfo] = React.useState<ClientInfo | null>(null);

  React.useEffect(() => {
    const ua = navigator.userAgent;
    setInfo({
      browser: detectBrowser(ua),
      os: detectOS(ua),
      screen: `${window.screen.width} × ${window.screen.height}`,
      viewport: `${window.innerWidth} × ${window.innerHeight}`,
      dpr: `${window.devicePixelRatio}×`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
      language: navigator.language || "Unknown",
      cookies: navigator.cookieEnabled ? "Enabled" : "Disabled",
      online: navigator.onLine ? "Online" : "Offline",
    });
  }, []);

  const isV6 = ip.includes(":") && ip !== "Unknown";
  const known = ip && ip !== "Unknown";

  function copy() {
    if (!known) return;
    navigator.clipboard.writeText(ip).then(
      () => { setCopied(true); window.setTimeout(() => setCopied(false), 1500); },
      () => {},
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* IP hero */}
      <button
        type="button"
        onClick={copy}
        className="group relative flex flex-col items-center gap-2 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center transition-colors hover:border-primary/40"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-primary">
          <GlobeIcon className="size-4" /> Your public IP address
        </span>
        <span className="select-all break-all font-mono text-3xl font-bold sm:text-4xl">
          {known ? ip : "Unavailable"}
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {known && (
            <span className="rounded-full border border-border bg-card px-2 py-0.5">{isV6 ? "IPv6" : "IPv4"}</span>
          )}
          <span className="inline-flex items-center gap-1">
            {copied ? <CheckIcon className="size-3.5 text-emerald-500" /> : <CopyIcon className="size-3.5" />}
            {copied ? "Copied!" : known ? "Click to copy" : ""}
          </span>
        </span>
      </button>

      {!known && (
        <p className="text-center text-xs text-muted-foreground">
          We couldn&apos;t read your IP from this request (common in local development). On the live site it appears here.
        </p>
      )}

      {/* Client details */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Detail label="Browser" value={info?.browser} />
        <Detail label="Operating system" value={info?.os} />
        <Detail label="Timezone" value={info?.timezone} />
        <Detail label="Screen resolution" value={info?.screen} />
        <Detail label="Window size" value={info?.viewport} />
        <Detail label="Pixel ratio" value={info?.dpr} />
        <Detail label="Language" value={info?.language} />
        <Detail label="Cookies" value={info?.cookies} />
        <Detail label="Connection" value={info?.online} />
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="truncate text-sm font-semibold" title={value}>{value ?? "…"}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
