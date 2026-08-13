"use client";

import * as React from "react";

// ── Safe expression evaluator (tokenize → shunting-yard RPN → evaluate) ──────
const FUNCS = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "cbrt", "abs", "exp"]);

type Token =
  | { type: "num"; value: number }
  | { type: "const"; value: number }
  | { type: "fn"; value: string }
  | { type: "op"; value: string }
  | { type: "lp" }
  | { type: "rp" }
  | { type: "fact" }
  | { type: "pct" };

function tokenize(s: string): Token[] {
  const t: Token[] = [];
  let i = 0;
  const n = s.length;
  while (i < n) {
    const c = s[i];
    if (c === " ") { i++; continue; }
    if ((c >= "0" && c <= "9") || c === ".") {
      let j = i + 1;
      while (j < n && ((s[j] >= "0" && s[j] <= "9") || s[j] === ".")) j++;
      t.push({ type: "num", value: parseFloat(s.slice(i, j)) });
      i = j; continue;
    }
    if (/[a-z]/i.test(c)) {
      let j = i + 1;
      while (j < n && /[a-z]/i.test(s[j])) j++;
      const name = s.slice(i, j).toLowerCase();
      if (name === "pi") t.push({ type: "const", value: Math.PI });
      else if (name === "e") t.push({ type: "const", value: Math.E });
      else if (FUNCS.has(name)) t.push({ type: "fn", value: name });
      else throw new Error("unknown " + name);
      i = j; continue;
    }
    if ("+-*/^".includes(c)) { t.push({ type: "op", value: c }); i++; continue; }
    if (c === "(") { t.push({ type: "lp" }); i++; continue; }
    if (c === ")") { t.push({ type: "rp" }); i++; continue; }
    if (c === "!") { t.push({ type: "fact" }); i++; continue; }
    if (c === "%") { t.push({ type: "pct" }); i++; continue; }
    throw new Error("bad char " + c);
  }
  return t;
}

const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 4, "u-": 5 };
const RIGHT: Record<string, boolean> = { "^": true, "u-": true };

type RpnTok = Token | { type: "op"; value: "u-" };

function toRPN(tokens: Token[]): RpnTok[] {
  const out: RpnTok[] = [];
  const stack: RpnTok[] = [];
  let prev: Token | null = null;
  for (const tk of tokens) {
    if (tk.type === "num" || tk.type === "const") out.push(tk);
    else if (tk.type === "fn") stack.push(tk);
    else if (tk.type === "fact" || tk.type === "pct") out.push(tk);
    else if (tk.type === "op") {
      let op = tk.value;
      if (op === "-" && (prev === null || prev.type === "op" || prev.type === "lp" || prev.type === "fn")) op = "u-";
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.type === "op") {
          if (RIGHT[op] ? PREC[op] < PREC[top.value] : PREC[op] <= PREC[top.value]) out.push(stack.pop()!);
          else break;
        } else break;
      }
      stack.push({ type: "op", value: op } as RpnTok);
    } else if (tk.type === "lp") stack.push(tk);
    else if (tk.type === "rp") {
      while (stack.length && stack[stack.length - 1].type !== "lp") out.push(stack.pop()!);
      if (!stack.length) throw new Error("mismatched )");
      stack.pop();
      if (stack.length && stack[stack.length - 1].type === "fn") out.push(stack.pop()!);
    }
    prev = tk;
  }
  while (stack.length) {
    const t = stack.pop()!;
    if (t.type === "lp") throw new Error("mismatched (");
    out.push(t);
  }
  return out;
}

function factorial(a: number): number {
  if (a < 0 || !Number.isInteger(a) || a > 170) return NaN;
  let r = 1;
  for (let k = 2; k <= a; k++) r *= k;
  return r;
}

function applyFn(name: string, a: number, deg: boolean): number {
  const toRad = (x: number) => (deg ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (deg ? (x * 180) / Math.PI : x);
  switch (name) {
    case "sin": return Math.sin(toRad(a));
    case "cos": return Math.cos(toRad(a));
    case "tan": return Math.tan(toRad(a));
    case "asin": return fromRad(Math.asin(a));
    case "acos": return fromRad(Math.acos(a));
    case "atan": return fromRad(Math.atan(a));
    case "log": return Math.log10(a);
    case "ln": return Math.log(a);
    case "sqrt": return Math.sqrt(a);
    case "cbrt": return Math.cbrt(a);
    case "abs": return Math.abs(a);
    case "exp": return Math.exp(a);
    default: throw new Error("unknown fn");
  }
}

function evalRPN(rpn: RpnTok[], deg: boolean): number {
  const st: number[] = [];
  for (const tk of rpn) {
    if (tk.type === "num" || tk.type === "const") st.push(tk.value);
    else if (tk.type === "pct") st.push((st.pop() ?? 0) / 100);
    else if (tk.type === "fact") st.push(factorial(st.pop() ?? 0));
    else if (tk.type === "fn") st.push(applyFn(tk.value, st.pop() ?? 0, deg));
    else if (tk.type === "op") {
      if (tk.value === "u-") st.push(-(st.pop() ?? 0));
      else {
        const b = st.pop() ?? 0;
        const a = st.pop() ?? 0;
        st.push(tk.value === "+" ? a + b : tk.value === "-" ? a - b : tk.value === "*" ? a * b : tk.value === "/" ? a / b : Math.pow(a, b));
      }
    }
  }
  if (st.length !== 1) throw new Error("bad expression");
  return st[0];
}

function evaluate(expr: string, deg: boolean): number {
  return evalRPN(toRPN(tokenize(expr)), deg);
}

function pretty(expr: string): string {
  return expr
    .replace(/pi/g, "π")
    .replace(/sqrt/g, "√")
    .replace(/\*/g, "×")
    .replace(/\//g, "÷");
}

// ── UI ───────────────────────────────────────────────────────────────────────
type Btn = { label: string; ins?: string; act?: "eq" | "clear" | "del"; kind?: "fn" | "op" | "num" | "eq" };

const LAYOUT: Btn[][] = [
  [{ label: "sin", ins: "sin(", kind: "fn" }, { label: "cos", ins: "cos(", kind: "fn" }, { label: "tan", ins: "tan(", kind: "fn" }, { label: "C", act: "clear", kind: "op" }, { label: "⌫", act: "del", kind: "op" }],
  [{ label: "ln", ins: "ln(", kind: "fn" }, { label: "log", ins: "log(", kind: "fn" }, { label: "(", ins: "(", kind: "op" }, { label: ")", ins: ")", kind: "op" }, { label: "÷", ins: "/", kind: "op" }],
  [{ label: "√", ins: "sqrt(", kind: "fn" }, { label: "7", ins: "7" }, { label: "8", ins: "8" }, { label: "9", ins: "9" }, { label: "×", ins: "*", kind: "op" }],
  [{ label: "x^y", ins: "^", kind: "fn" }, { label: "4", ins: "4" }, { label: "5", ins: "5" }, { label: "6", ins: "6" }, { label: "−", ins: "-", kind: "op" }],
  [{ label: "x²", ins: "^2", kind: "fn" }, { label: "1", ins: "1" }, { label: "2", ins: "2" }, { label: "3", ins: "3" }, { label: "+", ins: "+", kind: "op" }],
  [{ label: "x!", ins: "!", kind: "fn" }, { label: "π", ins: "pi", kind: "fn" }, { label: "0", ins: "0" }, { label: ".", ins: "." }, { label: "=", act: "eq", kind: "eq" }],
  [{ label: "%", ins: "%", kind: "fn" }, { label: "e", ins: "e", kind: "fn" }, { label: "exp", ins: "exp(", kind: "fn" }, { label: "asin", ins: "asin(", kind: "fn" }, { label: "acos", ins: "acos(", kind: "fn" }],
];

export function ScientificCalculator() {
  const [expr, setExpr] = React.useState("");
  const [result, setResult] = React.useState("");
  const [deg, setDeg] = React.useState(true);
  const [justEval, setJustEval] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => { ref.current?.focus(); }, []);

  function fmt(n: number): string {
    if (!Number.isFinite(n)) return "Error";
    const r = Math.round(n * 1e10) / 1e10;
    return String(r);
  }

  function equals() {
    if (!expr) return;
    try {
      const n = evaluate(expr, deg);
      const out = fmt(n);
      setResult(out);
      setExpr(out === "Error" ? expr : out);
      setJustEval(true);
    } catch {
      setResult("Error");
    }
  }

  function press(b: Btn) {
    if (b.act === "clear") { setExpr(""); setResult(""); setJustEval(false); return; }
    if (b.act === "del") { setExpr((e) => e.slice(0, -1)); setJustEval(false); return; }
    if (b.act === "eq") { equals(); return; }
    const ins = b.ins ?? "";
    // After "=", operators continue from the result; a number/function starts fresh.
    const continueFromResult = b.kind === "op" && ins !== "(";
    if (justEval && !continueFromResult) setExpr(ins);
    else setExpr((e) => e + ins);
    setJustEval(false);
    setResult("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const k = e.key;
    if (k === "Enter" || k === "=") { e.preventDefault(); equals(); return; }
    if (k === "Backspace") { e.preventDefault(); setExpr((v) => v.slice(0, -1)); setJustEval(false); return; }
    if (k === "Escape") { e.preventDefault(); setExpr(""); setResult(""); setJustEval(false); return; }
    if (/^[0-9.]$/.test(k) || "+-*/^()%!".includes(k)) {
      e.preventDefault();
      const isNum = /^[0-9.]$/.test(k);
      if (justEval && isNum) setExpr(k);
      else setExpr((v) => v + k);
      setJustEval(false);
      setResult("");
    }
  }

  return (
    <div
      ref={ref}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="mx-auto w-full max-w-md select-none rounded-2xl border border-border bg-card p-4 outline-none focus:border-primary/40"
    >
      {/* Display */}
      <div className="mb-3 rounded-xl bg-muted/50 px-4 py-3 text-right">
        <div className="min-h-5 break-all text-sm text-muted-foreground">{pretty(expr) || " "}</div>
        <div className="min-h-9 break-all text-3xl font-semibold tabular-nums">{result || "0"}</div>
      </div>

      {/* Angle mode */}
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDeg((d) => !d)}
          className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:border-primary/40"
        >
          {deg ? "DEG" : "RAD"}
        </button>
        <span className="text-xs text-muted-foreground">Tap to switch angle unit · keyboard supported</span>
      </div>

      {/* Keypad */}
      <div className="flex flex-col gap-2">
        {LAYOUT.map((row, i) => (
          <div key={i} className="grid grid-cols-5 gap-2">
            {row.map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => press(b)}
                className={
                  "h-12 rounded-lg text-sm font-medium transition-colors " +
                  (b.kind === "eq"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : b.kind === "op"
                      ? "bg-muted hover:bg-muted/70"
                      : b.kind === "fn"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-background border border-border hover:bg-muted/50")
                }
              >
                {b.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
