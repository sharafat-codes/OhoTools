"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

const CONTROL = [
  "NUL", "SOH", "STX", "ETX", "EOT", "ENQ", "ACK", "BEL", "BS", "HT", "LF", "VT", "FF", "CR", "SO", "SI",
  "DLE", "DC1", "DC2", "DC3", "DC4", "NAK", "SYN", "ETB", "CAN", "EM", "SUB", "ESC", "FS", "GS", "RS", "US",
];
const DESC: Record<number, string> = {
  0: "Null", 7: "Bell", 8: "Backspace", 9: "Horizontal tab", 10: "Line feed (newline)",
  13: "Carriage return", 27: "Escape", 32: "Space", 127: "Delete",
};

type Row = { dec: number; hex: string; oct: string; bin: string; char: string; desc: string };

const ROWS: Row[] = Array.from({ length: 128 }, (_, i) => {
  const isControl = i < 32 || i === 127;
  const char = i === 32 ? "space" : i === 127 ? "DEL" : isControl ? CONTROL[i] : String.fromCharCode(i);
  const desc = DESC[i] ?? (isControl ? "Control character" : "Printable character");
  return {
    dec: i,
    hex: i.toString(16).toUpperCase().padStart(2, "0"),
    oct: i.toString(8).padStart(3, "0"),
    bin: i.toString(2).padStart(8, "0"),
    char,
    desc,
  };
});

export function AsciiTable() {
  const [q, setQ] = React.useState("");
  const t = q.trim().toLowerCase();
  const filtered = ROWS.filter((r) => {
    if (!t) return true;
    return (
      String(r.dec) === t ||
      String(r.dec).includes(t) ||
      r.hex.toLowerCase().includes(t) ||
      r.char.toLowerCase() === t ||
      r.desc.toLowerCase().includes(t)
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by decimal, hex, character, or name (e.g. 65, 41, A, tab)…" />
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Char</th>
              <th className="px-3 py-2">Dec</th>
              <th className="px-3 py-2">Hex</th>
              <th className="px-3 py-2">Oct</th>
              <th className="px-3 py-2">Binary</th>
              <th className="px-3 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.dec} className="border-t border-border/60">
                <td className="px-3 py-1.5 font-mono font-semibold">{r.char}</td>
                <td className="px-3 py-1.5 font-mono tabular-nums">{r.dec}</td>
                <td className="px-3 py-1.5 font-mono">0x{r.hex}</td>
                <td className="px-3 py-1.5 font-mono">{r.oct}</td>
                <td className="px-3 py-1.5 font-mono">{r.bin}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground">No characters match &quot;{q}&quot;.</p>}
    </div>
  );
}
