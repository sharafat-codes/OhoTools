"use client";

import * as React from "react";
import Link from "next/link";
import {
  DownloadIcon,
  LoaderCircleIcon,
  LockIcon,
  UploadIcon,
} from "lucide-react";
import { toast } from "sonner";

import { qrToPngDataUrl } from "@/modules/qr/render";
import { downloadZip } from "@/modules/qr/export";
import { toFileStem } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MAX_ROWS = 200;

function parseRows(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const comma = line.indexOf(",");
      if (comma === -1) return { data: line, name: "" };
      return {
        data: line.slice(0, comma).trim(),
        name: line.slice(comma + 1).trim(),
      };
    })
    .filter((r) => r.data);
}

export function QrBulk({ isPro }: { isPro: boolean }) {
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const rows = parseRows(text);

  function loadFile(file: File | undefined) {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => setText(String(fr.result ?? ""));
    fr.readAsText(file);
  }

  async function generate() {
    if (!rows.length) {
      toast.error("Add at least one row.");
      return;
    }
    if (rows.length > MAX_ROWS) {
      toast.error(`Max ${MAX_ROWS} codes per batch.`);
      return;
    }
    setBusy(true);
    try {
      const files: { name: string; dataUrl: string }[] = [];
      for (const row of rows) {
        const dataUrl = await qrToPngDataUrl({
          data: row.data,
          fgColor: "#000000",
          bgColor: "#ffffff",
          size: 512,
          margin: 2,
          ecLevel: "M",
        });
        files.push({ name: toFileStem(row.name || row.data, "qr"), dataUrl });
      }
      await downloadZip(files, "toolpilot-qr-codes.zip");
      toast.success(`Generated ${files.length} QR codes.`);
    } catch {
      toast.error("Something went wrong generating the batch.");
    }
    setBusy(false);
  }

  if (!isPro) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="grid size-10 place-items-center rounded-full bg-muted">
            <LockIcon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-heading font-medium">Bulk generation is a Pro feature</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a CSV and download hundreds of QR codes as a ZIP.
            </p>
          </div>
          <Button render={<Link href="/dashboard/billing" />}>Upgrade to Pro</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk generate</CardTitle>
        <CardDescription>
          One entry per line as <code>content</code> or{" "}
          <code>content,name</code>. Up to {MAX_ROWS} per batch.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="bulk-data">Entries</Label>
            <div className="flex items-center gap-2">
              {rows.length > 0 && <Badge variant="secondary">{rows.length} rows</Badge>}
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-input px-2 py-1 text-xs hover:bg-muted">
                <UploadIcon className="size-3.5" />
                Load CSV
                <input
                  type="file"
                  accept=".csv,.txt,text/csv,text/plain"
                  className="hidden"
                  onChange={(e) => loadFile(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
          <Textarea
            id="bulk-data"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"https://example.com/1,Product 1\nhttps://example.com/2,Product 2"}
            rows={10}
            className="font-mono text-xs"
          />
        </div>
        <Button onClick={generate} disabled={busy || rows.length === 0} className="w-fit">
          {busy ? <LoaderCircleIcon className="animate-spin" /> : <DownloadIcon />}
          Generate {rows.length || ""} & download ZIP
        </Button>
      </CardContent>
    </Card>
  );
}
