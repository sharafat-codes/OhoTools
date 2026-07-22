"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const FALLBACK_ZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
];

function getZones(): string[] {
  try {
    const fn = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf;
    const zones = fn?.("timeZone");
    if (Array.isArray(zones) && zones.length) return zones;
  } catch {
    /* ignore */
  }
  return FALLBACK_ZONES;
}

// Offset (ms) of a time zone at a given UTC instant.
function offsetMs(tz: string, utcMs: number): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(new Date(utcMs))) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  const asUTC = Date.UTC(map.year, map.month - 1, map.day, map.hour % 24, map.minute, map.second);
  return asUTC - utcMs;
}

// Convert a wall-clock time in `tz` into a UTC instant (ms), DST-aware.
function zonedToUtc(y: number, mo: number, d: number, h: number, mi: number, tz: string): number {
  const naive = Date.UTC(y, mo - 1, d, h, mi);
  let utc = naive - offsetMs(tz, naive);
  const off2 = offsetMs(tz, utc);
  utc = naive - off2;
  return utc;
}

function localDateTimeValue(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function TimezoneConverter() {
  const zones = React.useMemo(() => getZones(), []);
  const [dt, setDt] = React.useState("");
  const [from, setFrom] = React.useState("UTC");
  const [to, setTo] = React.useState("UTC");

  // Client-side defaults (avoid SSR hydration mismatch).
  React.useEffect(() => {
    let ok = true;
    Promise.resolve().then(() => {
      if (!ok) return;
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      setFrom(localTz);
      setTo(localTz === "UTC" ? "America/New_York" : "UTC");
      setDt(localDateTimeValue(new Date()));
    });
    return () => {
      ok = false;
    };
  }, []);

  let result: string | null = null;
  if (dt) {
    const m = dt.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (m) {
      const utc = zonedToUtc(+m[1], +m[2], +m[3], +m[4], +m[5], from);
      result = new Intl.DateTimeFormat("en-US", {
        timeZone: to,
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(utc));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="tz-dt">Date &amp; time</Label>
          <button
            type="button"
            className="text-xs text-primary hover:underline"
            onClick={() => setDt(localDateTimeValue(new Date()))}
          >
            Now
          </button>
        </div>
        <Input id="tz-dt" type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tz-from">From time zone</Label>
          <select id="tz-from" value={from} onChange={(e) => setFrom(e.target.value)} className={selectClass}>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="tz-to">To time zone</Label>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
            >
              Swap
            </button>
          </div>
          <select id="tz-to" value={to} onChange={(e) => setTo(e.target.value)} className={selectClass}>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {result ? (
        <Card>
          <CardContent className="py-5 text-center">
            <div className="text-sm text-muted-foreground">{to.replace(/_/g, " ")}</div>
            <div className="mt-1 font-heading text-2xl font-semibold">{result}</div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">Pick a date, time, and two time zones to convert.</p>
      )}
    </div>
  );
}
