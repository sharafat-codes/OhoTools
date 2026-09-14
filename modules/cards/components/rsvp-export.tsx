"use client";

import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export type RsvpRow = {
  name: string;
  attending: boolean;
  guests: number;
  message: string | null;
  createdAt: string;
};

function csvCell(v: string) {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function RsvpExport({ rows, filename }: { rows: RsvpRow[]; filename: string }) {
  function download() {
    const header = ["Name", "Attending", "Guests", "Message", "Date"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push(
        [
          csvCell(r.name),
          r.attending ? "Yes" : "No",
          String(r.guests),
          csvCell(r.message ?? ""),
          csvCell(new Date(r.createdAt).toLocaleString()),
        ].join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" size="sm" onClick={download} disabled={!rows.length}>
      <DownloadIcon className="size-4" /> Export CSV
    </Button>
  );
}
