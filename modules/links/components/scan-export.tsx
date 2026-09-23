"use client";

import * as React from "react";
import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export type ScanRow = {
  createdAt: string;
  device: string | null;
  country: string | null;
  referrer: string | null;
};

/** Escape for CSV: quote the field and double any embedded quotes. */
function csvCell(v: string) {
  return `"${v.replace(/"/g, '""')}"`;
}

/**
 * Downloads the scan history as CSV. Competitors gate this behind their $35/mo
 * tiers, which makes it a cheap point of difference — and anyone running a real
 * print campaign wants the raw rows for their own reporting.
 *
 * Built in the browser from rows already rendered on the page, so there is no
 * extra endpoint to authorise.
 */
export function ScanExport({ rows, filename }: { rows: ScanRow[]; filename: string }) {
  function download() {
    const lines = [
      ["Date (UTC)", "Device", "Country", "Referrer"].join(","),
      ...rows.map((r) =>
        [
          csvCell(new Date(r.createdAt).toISOString().replace("T", " ").slice(0, 19)),
          csvCell(r.device ?? "Unknown"),
          csvCell(r.country ?? "Unknown"),
          csvCell(r.referrer ?? "Direct"),
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(href);
  }

  return (
    <Button variant="outline" size="sm" onClick={download} disabled={rows.length === 0}>
      <DownloadIcon />
      Export CSV
    </Button>
  );
}
