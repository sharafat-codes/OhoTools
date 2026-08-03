"use client";

import * as React from "react";
import { DownloadIcon, LoaderCircleIcon, FileSpreadsheetIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Button } from "@/components/ui/button";

// Minimal, dependency-light CSV → XLSX, entirely in the browser. We build a
// valid Office Open XML workbook (a few XML parts) and zip it with jszip
// (already a dependency), using inline strings so no shared-strings table is
// needed. Numeric-looking cells become real numbers so sums/sorts work.

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\r") {
      // ignore (handled by \n)
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function colName(n: number): string {
  let s = "";
  n += 1;
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

const isNumeric = (v: string) => /^-?(0|[1-9]\d*)(\.\d+)?$/.test(v.trim());

function sheetXml(rows: string[][]): string {
  const body = rows
    .map((cells, r) => {
      const rowNum = r + 1;
      const cs = cells
        .map((val, c) => {
          const ref = `${colName(c)}${rowNum}`;
          if (val !== "" && isNumeric(val)) {
            return `<c r="${ref}"><v>${val.trim()}</v></c>`;
          }
          return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${esc(val)}</t></is></c>`;
        })
        .join("");
      return `<row r="${rowNum}">${cs}</row>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

async function buildXlsx(rows: string[][]): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  zip.file(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
  );
  zip.file(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  );
  zip.file(
    "xl/workbook.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets></workbook>`,
  );
  zip.file(
    "xl/_rels/workbook.xml.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
  );
  zip.file("xl/worksheets/sheet1.xml", sheetXml(rows));
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function CsvToXlsx() {
  const [name, setName] = React.useState("spreadsheet");
  const [rowsCount, setRowsCount] = React.useState<number | null>(null);
  const [colsCount, setColsCount] = React.useState(0);
  const [url, setUrl] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    setUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setName(file.name.replace(/\.[^.]+$/, "") || "spreadsheet");
    try {
      const text = await file.text();
      const rows = parseCsv(text).filter((r) => r.length > 0);
      if (rows.length === 0) throw new Error("empty");
      const blob = await buildXlsx(rows);
      setRowsCount(rows.length);
      setColsCount(Math.max(...rows.map((r) => r.length)));
      setUrl(URL.createObjectURL(blob));
    } catch {
      setError("Could not read that CSV. Make sure it's a valid comma-separated file.");
      setRowsCount(null);
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.xlsx`;
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept=".csv,text/csv"
        onFile={onFile}
        title="Drop a CSV file, or click to browse"
        hint="Converts to Excel (.xlsx) in your browser — nothing is uploaded."
      />

      {busy && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircleIcon className="size-4 animate-spin" /> Converting…
        </p>
      )}

      {url && rowsCount != null && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 animate-in fade-in-0 duration-300">
          <div className="flex items-center gap-2 text-sm">
            <FileSpreadsheetIcon className="size-4 text-primary" />
            <span className="font-medium">{name}.xlsx</span>
            <span className="text-muted-foreground">
              · {rowsCount.toLocaleString()} rows × {colsCount} columns
            </span>
          </div>
          <Button onClick={download} className="w-fit">
            <DownloadIcon />
            Download Excel file
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Free, no sign-up. Runs entirely in your browser — your file is never uploaded.
      </p>
    </div>
  );
}
