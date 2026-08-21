"use client";

import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

type Parsed = {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  engine: string;
  device: string;
};

function m(ua: string, re: RegExp): string {
  const r = ua.match(re);
  return r?.[1] ?? "";
}

function parseUa(ua: string): Parsed {
  let browser = "Unknown";
  let browserVersion = "";
  if (/Edg\//.test(ua)) { browser = "Microsoft Edge"; browserVersion = m(ua, /Edg\/([\d.]+)/); }
  else if (/OPR\/|Opera/.test(ua)) { browser = "Opera"; browserVersion = m(ua, /(?:OPR|Opera)\/([\d.]+)/); }
  else if (/SamsungBrowser\//.test(ua)) { browser = "Samsung Internet"; browserVersion = m(ua, /SamsungBrowser\/([\d.]+)/); }
  else if (/Firefox\//.test(ua)) { browser = "Firefox"; browserVersion = m(ua, /Firefox\/([\d.]+)/); }
  else if (/Chrome\//.test(ua)) { browser = "Chrome"; browserVersion = m(ua, /Chrome\/([\d.]+)/); }
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) { browser = "Safari"; browserVersion = m(ua, /Version\/([\d.]+)/); }

  let os = "Unknown";
  let osVersion = "";
  if (/Windows NT/.test(ua)) {
    os = "Windows";
    const nt = m(ua, /Windows NT ([\d.]+)/);
    osVersion = { "10.0": "10 / 11", "6.3": "8.1", "6.2": "8", "6.1": "7" }[nt] ?? nt;
  } else if (/Android/.test(ua)) { os = "Android"; osVersion = m(ua, /Android ([\d.]+)/); }
  else if (/iPhone|iPad|iPod/.test(ua)) { os = "iOS"; osVersion = m(ua, /OS ([\d_]+)/).replace(/_/g, "."); }
  else if (/Mac OS X/.test(ua)) { os = "macOS"; osVersion = m(ua, /Mac OS X ([\d_]+)/).replace(/_/g, "."); }
  else if (/Linux/.test(ua)) { os = "Linux"; }
  else if (/CrOS/.test(ua)) { os = "ChromeOS"; }

  let engine = "Unknown";
  if (/Gecko\//.test(ua) && /Firefox/.test(ua)) engine = "Gecko";
  else if (/AppleWebKit/.test(ua)) engine = /Chrome|Edg|OPR|SamsungBrowser/.test(ua) ? "Blink" : "WebKit";

  const device = /iPad|Tablet/.test(ua) ? "Tablet" : /Mobi|Android|iPhone|iPod/.test(ua) ? "Mobile" : "Desktop";

  return { browser, browserVersion, os, osVersion, engine, device };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export function UserAgentParser() {
  const [ua, setUa] = React.useState("");
  const [isOwn, setIsOwn] = React.useState(true);

  React.useEffect(() => {
    setUa(navigator.userAgent);
  }, []);

  const parsed = parseUa(ua);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{isOwn ? "Your user agent" : "User-agent string"}</span>
          <CopyButton value={ua} />
        </div>
        <Textarea
          value={ua}
          onChange={(e) => { setUa(e.target.value); setIsOwn(false); }}
          rows={3}
          className="font-mono text-xs"
          placeholder="Paste a user-agent string to parse…"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setUa(navigator.userAgent); setIsOwn(true); }}
          >
            Use my user agent
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="py-1">
          <Row label="Browser" value={`${parsed.browser}${parsed.browserVersion ? ` ${parsed.browserVersion}` : ""}`} />
          <Row label="Operating system" value={`${parsed.os}${parsed.osVersion ? ` ${parsed.osVersion}` : ""}`} />
          <Row label="Rendering engine" value={parsed.engine} />
          <Row label="Device type" value={parsed.device} />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Parsed entirely in your browser — nothing is sent to a server. User-agent strings can be spoofed, so treat this as a best-effort guess.
      </p>
    </div>
  );
}
