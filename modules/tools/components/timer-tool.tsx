"use client";

import * as React from "react";
import { PlayIcon, PauseIcon, RotateCcwIcon, FlagIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    o.start();
    o.stop(ctx.currentTime + 0.7);
    setTimeout(() => ctx.close(), 900);
  } catch {
    /* audio not available */
  }
}

const pad = (n: number) => n.toString().padStart(2, "0");
function fmt(ms: number) {
  if (ms < 0) ms = 0;
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
function num(v: string, d: number) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : d;
}

const Display = ({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card py-10">
    {sub}
    <div className="font-mono text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl">{children}</div>
  </div>
);

// ── Stopwatch ───────────────────────────────────────────────────────────────
function Stopwatch() {
  const [running, setRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [laps, setLaps] = React.useState<number[]>([]);
  const startRef = React.useRef(0);

  React.useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed;
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 60);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const cs = Math.floor((elapsed % 1000) / 10);

  return (
    <div className="flex flex-col gap-4">
      <Display>
        {fmt(elapsed)}
        <span className="text-3xl text-muted-foreground sm:text-4xl">.{pad(cs)}</span>
      </Display>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setRunning((r) => !r)}>
          {running ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
          {running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
        </Button>
        <Button variant="outline" onClick={() => running && setLaps((l) => [elapsed, ...l])} disabled={!running}>
          <FlagIcon className="size-4" /> Lap
        </Button>
        <Button variant="ghost" onClick={() => { setRunning(false); setElapsed(0); setLaps([]); }}>
          <RotateCcwIcon className="size-4" /> Reset
        </Button>
      </div>
      {laps.length > 0 && (
        <div className="flex flex-col gap-1 rounded-xl border border-border p-3 text-sm">
          {laps.map((l, i) => (
            <div key={laps.length - i} className="flex justify-between tabular-nums">
              <span className="text-muted-foreground">Lap {laps.length - i}</span>
              <span className="font-mono">{fmt(l)}.{pad(Math.floor((l % 1000) / 10))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Countdown ────────────────────────────────────────────────────────────────
function Countdown() {
  const [min, setMin] = React.useState("5");
  const [sec, setSec] = React.useState("0");
  const [remaining, setRemaining] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const endRef = React.useRef(0);

  React.useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + remaining;
    const id = setInterval(() => {
      const r = endRef.current - Date.now();
      if (r <= 0) {
        setRemaining(0);
        setRunning(false);
        setDone(true);
        beep();
      } else {
        setRemaining(r);
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const configured = num(min, 0) * 60000 + num(sec, 0) * 1000;
  const display = running || remaining > 0 ? remaining : configured;

  function start() {
    if (remaining > 0) {
      setRunning(true);
      return;
    }
    if (configured <= 0) return;
    setDone(false);
    setRemaining(configured);
    setRunning(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <Display sub={done ? <span className="text-sm font-medium text-primary">Time&apos;s up!</span> : undefined}>
        {fmt(display)}
      </Display>

      {!running && remaining <= 0 && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex w-24 flex-col gap-1.5">
            <Label htmlFor="cd-min">Minutes</Label>
            <Input id="cd-min" type="number" min={0} value={min} onChange={(e) => setMin(e.target.value)} />
          </div>
          <div className="flex w-24 flex-col gap-1.5">
            <Label htmlFor="cd-sec">Seconds</Label>
            <Input id="cd-sec" type="number" min={0} max={59} value={sec} onChange={(e) => setSec(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {[1, 5, 10, 25].map((p) => (
              <Button key={p} variant="outline" size="sm" onClick={() => { setMin(String(p)); setSec("0"); }}>
                {p}m
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={running ? () => setRunning(false) : start} disabled={!running && display <= 0}>
          {running ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
          {running ? "Pause" : remaining > 0 ? "Resume" : "Start"}
        </Button>
        <Button variant="ghost" onClick={() => { setRunning(false); setRemaining(0); setDone(false); }}>
          <RotateCcwIcon className="size-4" /> Reset
        </Button>
      </div>
    </div>
  );
}

// ── Pomodoro ─────────────────────────────────────────────────────────────────
function Pomodoro() {
  const [workMin, setWorkMin] = React.useState("25");
  const [breakMin, setBreakMin] = React.useState("5");
  const [phase, setPhase] = React.useState<"work" | "break">("work");
  const [remaining, setRemaining] = React.useState(25 * 60000);
  const [running, setRunning] = React.useState(false);
  const [round, setRound] = React.useState(1);
  const endRef = React.useRef(0);

  React.useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + remaining;
    const id = setInterval(() => {
      const r = endRef.current - Date.now();
      if (r > 0) {
        setRemaining(r);
        return;
      }
      beep();
      const next = phase === "work" ? "break" : "work";
      setPhase(next);
      setRemaining((next === "work" ? num(workMin, 25) : num(breakMin, 5)) * 60000);
      if (next === "work") setRound((rd) => rd + 1);
      setRunning(false); // manual continue: user starts the next phase
    }, 200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  function reset() {
    setRunning(false);
    setPhase("work");
    setRound(1);
    setRemaining(num(workMin, 25) * 60000);
  }

  return (
    <div className="flex flex-col gap-4">
      <Display
        sub={
          <span className="flex items-center gap-2 text-sm font-medium">
            <span className={phase === "work" ? "text-primary" : "text-emerald-500"}>
              {phase === "work" ? "Focus" : "Break"}
            </span>
            <span className="text-muted-foreground">· Round {round}</span>
          </span>
        }
      >
        {fmt(remaining)}
      </Display>

      {!running && (
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex w-28 flex-col gap-1.5">
            <Label htmlFor="pm-work">Focus (min)</Label>
            <Input
              id="pm-work"
              type="number"
              min={1}
              value={workMin}
              onChange={(e) => {
                setWorkMin(e.target.value);
                if (phase === "work") setRemaining(num(e.target.value, 25) * 60000);
              }}
            />
          </div>
          <div className="flex w-28 flex-col gap-1.5">
            <Label htmlFor="pm-break">Break (min)</Label>
            <Input
              id="pm-break"
              type="number"
              min={1}
              value={breakMin}
              onChange={(e) => {
                setBreakMin(e.target.value);
                if (phase === "break") setRemaining(num(e.target.value, 5) * 60000);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setRunning((r) => !r)}>
          {running ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
          {running ? "Pause" : `Start ${phase === "work" ? "focus" : "break"}`}
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcwIcon className="size-4" /> Reset
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Work in focused sprints with short breaks. When a phase ends you&apos;ll hear a chime — press start for the next one.
      </p>
    </div>
  );
}

export function TimerTool({ mode }: { mode: "stopwatch" | "countdown" | "pomodoro" }) {
  if (mode === "stopwatch") return <Stopwatch />;
  if (mode === "pomodoro") return <Pomodoro />;
  return <Countdown />;
}
