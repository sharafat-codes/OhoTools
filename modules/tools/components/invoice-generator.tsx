"use client";

import * as React from "react";
import { PlusIcon, XIcon, DownloadIcon, Loader2Icon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Item = { id: number; desc: string; qty: string; price: string };

export function InvoiceGenerator() {
  const idRef = React.useRef(2);
  const [fromName, setFromName] = React.useState("");
  const [fromDetails, setFromDetails] = React.useState("");
  const [toName, setToName] = React.useState("");
  const [toDetails, setToDetails] = React.useState("");
  const [number, setNumber] = React.useState("001");
  const [date, setDate] = React.useState("");
  const [due, setDue] = React.useState("");
  const [currency, setCurrency] = React.useState("$");
  const [taxRate, setTaxRate] = React.useState("0");
  const [notes, setNotes] = React.useState("");
  const [items, setItems] = React.useState<Item[]>([{ id: 1, desc: "", qty: "1", price: "0" }]);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    Promise.resolve().then(() => setDate(new Date().toISOString().slice(0, 10)));
  }, []);

  const numOf = (v: string) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const subtotal = items.reduce((s, it) => s + numOf(it.qty) * numOf(it.price), 0);
  const tax = (subtotal * numOf(taxRate)) / 100;
  const total = subtotal + tax;
  const money = (n: number) => `${currency}${n.toFixed(2)}`;

  function update(id: number, key: keyof Item, value: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  }
  function addItem() {
    setItems((prev) => [...prev, { id: idRef.current++, desc: "", qty: "1", price: "0" }]);
  }
  function removeItem(id: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));
  }

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const { width, height } = page.getSize();
      const M = 50;
      const dark = rgb(0.1, 0.1, 0.1);
      const gray = rgb(0.45, 0.45, 0.45);
      const rule = rgb(0.85, 0.85, 0.85);

      const clean = (s: string) => s.replace(/[^\x20-\x7E£€¥]/g, "");
      const text = (s: string, x: number, y: number, size = 10, f = font, color = dark) =>
        page.drawText(clean(s), { x, y, size, font: f, color });
      const right = (s: string, xr: number, y: number, size = 10, f = font, color = dark) =>
        page.drawText(clean(s), { x: xr - f.widthOfTextAtSize(clean(s), size), y, size, font: f, color });
      const line = (y: number) =>
        page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: rule });

      let y = height - M;
      text("INVOICE", M, y - 22, 26, bold);
      right(`#${number || "—"}`, width - M, y - 6, 12, bold);
      if (date) right(`Date: ${date}`, width - M, y - 24, 10, font, gray);
      if (due) right(`Due: ${due}`, width - M, y - 38, 10, font, gray);
      y -= 78;

      const half = width / 2;
      text("FROM", M, y, 8, bold, gray);
      text("BILL TO", half, y, 8, bold, gray);
      y -= 16;
      text(fromName || "—", M, y, 11, bold);
      text(toName || "—", half, y, 11, bold);
      y -= 15;
      const fromLines = fromDetails.split("\n").slice(0, 5);
      const toLines = toDetails.split("\n").slice(0, 5);
      const rows = Math.max(fromLines.length, toLines.length);
      for (let i = 0; i < rows; i++) {
        if (fromLines[i]) text(fromLines[i], M, y, 9, font, gray);
        if (toLines[i]) text(toLines[i], half, y, 9, font, gray);
        y -= 13;
      }
      y -= 18;

      // Items table
      const cQty = 360;
      const cPrice = 460;
      const cAmt = width - M;
      text("DESCRIPTION", M, y, 8, bold, gray);
      right("QTY", cQty, y, 8, bold, gray);
      right("UNIT PRICE", cPrice, y, 8, bold, gray);
      right("AMOUNT", cAmt, y, 8, bold, gray);
      y -= 6;
      line(y);
      y -= 16;
      for (const it of items) {
        const amt = numOf(it.qty) * numOf(it.price);
        text((it.desc || "—").slice(0, 52), M, y, 10);
        right(String(numOf(it.qty)), cQty, y, 10);
        right(money(numOf(it.price)), cPrice, y, 10);
        right(money(amt), cAmt, y, 10);
        y -= 18;
      }
      y -= 4;
      line(y);
      y -= 20;

      right("Subtotal", cPrice, y, 10, font, gray);
      right(money(subtotal), cAmt, y, 10);
      y -= 16;
      if (numOf(taxRate) > 0) {
        right(`Tax (${numOf(taxRate)}%)`, cPrice, y, 10, font, gray);
        right(money(tax), cAmt, y, 10);
        y -= 16;
      }
      right("TOTAL", cPrice, y, 12, bold);
      right(money(total), cAmt, y, 12, bold);
      y -= 30;

      if (notes.trim()) {
        text("NOTES", M, y, 8, bold, gray);
        y -= 14;
        for (const ln of notes.split("\n").slice(0, 6)) {
          text(ln.slice(0, 90), M, y, 9, font, gray);
          y -= 12;
        }
      }

      const bytes = await doc.save();
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${number || "draft"}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Could not generate the PDF. Check your entries and try again.");
    }
    setBusy(false);
  }

  const inputCls = "";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inv-from">Your business</Label>
          <Input id="inv-from" value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Your name or company" className={inputCls} />
          <Textarea value={fromDetails} onChange={(e) => setFromDetails(e.target.value)} placeholder="Address, email, phone…" className="min-h-20 text-sm" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inv-to">Bill to</Label>
          <Input id="inv-to" value={toName} onChange={(e) => setToName(e.target.value)} placeholder="Client name or company" />
          <Textarea value={toDetails} onChange={(e) => setToDetails(e.target.value)} placeholder="Address, email…" className="min-h-20 text-sm" />
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex w-28 flex-col gap-1.5">
          <Label htmlFor="inv-num">Invoice #</Label>
          <Input id="inv-num" value={number} onChange={(e) => setNumber(e.target.value)} />
        </div>
        <div className="flex w-40 flex-col gap-1.5">
          <Label htmlFor="inv-date">Date</Label>
          <Input id="inv-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="flex w-40 flex-col gap-1.5">
          <Label htmlFor="inv-due">Due date</Label>
          <Input id="inv-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <div className="flex w-24 flex-col gap-1.5">
          <Label htmlFor="inv-cur">Currency</Label>
          <Input id="inv-cur" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="$" />
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        <div className="hidden grid-cols-[1fr_5rem_7rem_2rem] gap-2 px-1 text-xs text-muted-foreground sm:grid">
          <span>Description</span>
          <span>Qty</span>
          <span>Unit price</span>
          <span />
        </div>
        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-[1fr_5rem_7rem_2rem] items-center gap-2">
            <Input value={it.desc} onChange={(e) => update(it.id, "desc", e.target.value)} placeholder="Item or service" />
            <Input type="number" min={0} value={it.qty} onChange={(e) => update(it.id, "qty", e.target.value)} />
            <Input type="number" min={0} step="0.01" value={it.price} onChange={(e) => update(it.id, "price", e.target.value)} />
            <button type="button" onClick={() => removeItem(it.id)} aria-label="Remove item" className="text-muted-foreground hover:text-foreground disabled:opacity-30" disabled={items.length === 1}>
              <XIcon className="size-4" />
            </button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-fit" onClick={addItem}>
          <PlusIcon className="size-4" /> Add item
        </Button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex w-32 flex-col gap-1.5">
          <Label htmlFor="inv-tax">Tax rate (%)</Label>
          <Input id="inv-tax" type="number" min={0} step="0.1" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
        </div>
        <div className="ml-auto w-56 rounded-xl border border-border bg-card p-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums">{money(subtotal)}</span>
          </div>
          {numOf(taxRate) > 0 && (
            <div className="mt-1 flex justify-between text-muted-foreground">
              <span>Tax ({numOf(taxRate)}%)</span>
              <span className="tabular-nums">{money(tax)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{money(total)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="inv-notes">Notes (optional)</Label>
        <Textarea id="inv-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Payment terms, thank-you note…" className="min-h-16 text-sm" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button className="w-fit" onClick={download} disabled={busy}>
        {busy ? <Loader2Icon className="animate-spin" /> : <DownloadIcon className="size-4" />}
        Download PDF
      </Button>

      <p className="text-xs text-muted-foreground">
        The invoice PDF is built entirely in your browser — nothing is uploaded.
      </p>
    </div>
  );
}
