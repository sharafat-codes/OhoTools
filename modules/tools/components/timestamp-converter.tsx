"use client";

import * as React from "react";
import { ClockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

export function TimestampConverter() {
  const [epoch, setEpoch] = React.useState("");
  const [dateStr, setDateStr] = React.useState("");

  // Epoch -> date (auto-detect seconds vs milliseconds)
  let fromEpoch: { local: string; utc: string; iso: string } | null = null;
  let epochError: string | null = null;
  if (epoch.trim()) {
    const n = Number(epoch.trim());
    if (!Number.isFinite(n)) {
      epochError = "Enter a numeric timestamp.";
    } else {
      const ms = epoch.trim().length >= 12 ? n : n * 1000;
      const d = new Date(ms);
      if (Number.isNaN(d.getTime())) epochError = "Not a valid timestamp.";
      else
        fromEpoch = {
          local: d.toLocaleString(),
          utc: d.toUTCString(),
          iso: d.toISOString(),
        };
    }
  }

  // Date -> epoch
  let toEpoch: { seconds: string; millis: string } | null = null;
  if (dateStr) {
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) {
      toEpoch = {
        seconds: String(Math.floor(d.getTime() / 1000)),
        millis: String(d.getTime()),
      };
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="epoch">Unix timestamp</Label>
            <Input
              id="epoch"
              value={epoch}
              onChange={(e) => setEpoch(e.target.value)}
              placeholder="1787232000"
              className="font-mono"
              inputMode="numeric"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setEpoch(String(Math.floor(Date.now() / 1000)))}
          >
            <ClockIcon />
            Now
          </Button>
        </div>
        {epochError && <p className="text-sm text-destructive">{epochError}</p>}
        {fromEpoch && (
          <Card>
            <CardContent className="flex flex-col gap-2 text-sm">
              <Row label="Local" value={fromEpoch.local} />
              <Row label="UTC" value={fromEpoch.utc} />
              <Row label="ISO 8601" value={fromEpoch.iso} />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Date &amp; time → timestamp</Label>
          <Input
            id="date"
            type="datetime-local"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-fit"
          />
        </div>
        {toEpoch && (
          <Card>
            <CardContent className="flex flex-col gap-2 text-sm">
              <Row label="Seconds" value={toEpoch.seconds} mono />
              <Row label="Milliseconds" value={toEpoch.millis} mono />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className={mono ? "font-mono" : undefined}>{value}</span>
        <CopyButton value={value} label="" />
      </div>
    </div>
  );
}
