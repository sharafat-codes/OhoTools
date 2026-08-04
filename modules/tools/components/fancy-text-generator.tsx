"use client";

import * as React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";

// Unicode text styling. Most styles are contiguous ranges in the Mathematical
// Alphanumeric Symbols block; a few letters live in the Letterlike Symbols
// block, handled via per-character exceptions so nothing renders as a box.

type Spec = {
  upper?: number;
  lower?: number;
  digit?: number;
  exceptions?: Record<string, string>;
  combine?: string;
};

const SCRIPT_EX: Record<string, string> = {
  B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ", e: "ℯ", g: "ℊ", o: "ℴ",
};
const FRAKTUR_EX: Record<string, string> = { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" };
const DS_EX: Record<string, string> = { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" };
const ITALIC_EX: Record<string, string> = { h: "ℎ" };

function circledExceptions(): Record<string, string> {
  const ex: Record<string, string> = { "0": "⓪" };
  for (let d = 1; d <= 9; d++) ex[String(d)] = String.fromCodePoint(0x2460 + d - 1);
  return ex;
}

const STYLES: { name: string; spec: Spec }[] = [
  { name: "Bold", spec: { upper: 0x1d400, lower: 0x1d41a, digit: 0x1d7ce } },
  { name: "Italic", spec: { upper: 0x1d434, lower: 0x1d44e, exceptions: ITALIC_EX } },
  { name: "Bold Italic", spec: { upper: 0x1d468, lower: 0x1d482 } },
  { name: "Script", spec: { upper: 0x1d49c, lower: 0x1d4b6, exceptions: SCRIPT_EX } },
  { name: "Bold Script", spec: { upper: 0x1d4d0, lower: 0x1d4ea } },
  { name: "Fraktur", spec: { upper: 0x1d504, lower: 0x1d51e, exceptions: FRAKTUR_EX } },
  { name: "Double-struck", spec: { upper: 0x1d538, lower: 0x1d552, digit: 0x1d7d8, exceptions: DS_EX } },
  { name: "Monospace", spec: { upper: 0x1d670, lower: 0x1d68a, digit: 0x1d7f6 } },
  { name: "Sans-serif", spec: { upper: 0x1d5a0, lower: 0x1d5ba, digit: 0x1d7e2 } },
  { name: "Sans Bold", spec: { upper: 0x1d5d4, lower: 0x1d5ee, digit: 0x1d7ec } },
  { name: "Fullwidth", spec: { upper: 0xff21, lower: 0xff41, digit: 0xff10 } },
  { name: "Circled", spec: { upper: 0x24b6, lower: 0x24d0, exceptions: circledExceptions() } },
  { name: "Squared", spec: { upper: 0x1f130, lower: 0x1f130 } },
  { name: "Strikethrough", spec: { combine: "̶" } },
  { name: "Underline", spec: { combine: "̲" } },
];

function apply(text: string, spec: Spec): string {
  let out = "";
  for (const ch of text) {
    let m = ch;
    if (spec.exceptions && spec.exceptions[ch] != null) {
      m = spec.exceptions[ch];
    } else if (ch >= "A" && ch <= "Z" && spec.upper != null) {
      m = String.fromCodePoint(spec.upper + ch.charCodeAt(0) - 65);
    } else if (ch >= "a" && ch <= "z" && spec.lower != null) {
      m = String.fromCodePoint(spec.lower + ch.charCodeAt(0) - 97);
    } else if (ch >= "0" && ch <= "9" && spec.digit != null) {
      m = String.fromCodePoint(spec.digit + ch.charCodeAt(0) - 48);
    }
    out += m + (spec.combine ?? "");
  }
  return out;
}

const FLIP: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ",
  n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "𐐒", C: "Ɔ", D: "◖", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ", K: "ʞ", L: "˥", M: "W",
  N: "N", O: "O", P: "Ԁ", Q: "Ό", R: "ᴚ", S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "?": "¿", "!": "¡", "'": ",", "(": ")", ")": "(", "[": "]", "]": "[", "<": ">", ">": "<", "&": "⅋", "_": "‾",
};
function upsideDown(text: string): string {
  return [...text].map((c) => FLIP[c] ?? c).reverse().join("");
}

export function FancyTextGenerator() {
  const [text, setText] = React.useState("Hello world");

  const rows = React.useMemo(() => {
    const list = STYLES.map((s) => ({ name: s.name, value: apply(text, s.spec) }));
    list.push({ name: "Upside down", value: upsideDown(text) });
    return list;
  }, [text]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ft-in">Your text</Label>
        <Textarea
          id="ft-in"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text…"
          className="min-h-20"
        />
      </div>

      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3 rounded-lg border border-border p-3">
            <div className="min-w-0 flex-1 break-words text-lg leading-relaxed">
              {r.value || <span className="text-sm text-muted-foreground">…</span>}
            </div>
            <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{r.name}</span>
            <CopyButton value={r.value} label="Copy" />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        These are real Unicode characters, so you can paste them into Instagram, TikTok, X, Discord, and most bios and
        posts. A few apps may not render every style. Runs entirely in your browser.
      </p>
    </div>
  );
}
