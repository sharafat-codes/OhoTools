"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";

function ipToInt(ip: string): number | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  let out = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    out = (out << 8) | n;
  }
  return out >>> 0;
}

function intToIp(n: number) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export function CidrCalculator() {
  const [value, setValue] = React.useState("192.168.1.10/24");

  const parsed = React.useMemo(() => {
    const [ipStr, prefixStr] = value.trim().split("/");
    const ip = ipToInt(ipStr ?? "");
    const prefix = Number(prefixStr);
    if (ip === null || !/^\d{1,2}$/.test(prefixStr ?? "") || prefix < 0 || prefix > 32) {
      return null;
    }
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    const wildcard = ~mask >>> 0;
    const network = (ip & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const total = Math.pow(2, 32 - prefix);
    const usable = prefix >= 31 ? (prefix === 32 ? 1 : 2) : total - 2;
    const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
    const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;
    return {
      netmask: intToIp(mask),
      wildcard: intToIp(wildcard),
      network: `${intToIp(network)}/${prefix}`,
      broadcast: intToIp(broadcast),
      range: `${intToIp(firstHost)} – ${intToIp(lastHost)}`,
      total: total.toLocaleString(),
      usable: usable.toLocaleString(),
    };
  }, [value]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cidr">IP address / CIDR</Label>
        <Input
          id="cidr"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="192.168.1.10/24"
          className="font-mono"
        />
      </div>

      {parsed ? (
        <div className="flex flex-col gap-2">
          {[
            { label: "Network address", value: parsed.network },
            { label: "Netmask", value: parsed.netmask },
            { label: "Wildcard mask", value: parsed.wildcard },
            { label: "Broadcast address", value: parsed.broadcast },
            { label: "Usable host range", value: parsed.range },
            { label: "Total addresses", value: parsed.total },
            { label: "Usable hosts", value: parsed.usable },
          ].map((row) => (
            <Card key={row.label}>
              <CardContent className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{row.label}</div>
                  <code className="font-mono text-sm break-all">{row.value}</code>
                </div>
                <CopyButton value={row.value} label="" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-destructive">Enter a valid IPv4 address and prefix, e.g. 10.0.0.0/8.</p>
      )}
    </div>
  );
}
