"use client";

import * as React from "react";
import Link from "next/link";
import { SendIcon, Loader2Icon, SparklesIcon, LockIcon, RotateCcwIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ROLES,
  LEVELS,
  TYPES,
  PLAN_CAPS,
  labelFor,
  type RoleId,
  type LevelId,
  type TypeId,
  type InterviewConfig,
  type InterviewReport,
} from "@/modules/interview/config";
import { FeedbackReport } from "@/modules/interview/components/feedback-report";

type Msg = { role: "user" | "assistant"; content: string };
type Phase = "setup" | "interview" | "report";

async function post(payload: unknown) {
  const res = await fetch("/api/interview", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(data.error || "Request failed"), {
      status: res.status,
      error: data.error as string | undefined,
      limitReached: Boolean(data.limitReached),
    });
  }
  return data;
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string; blurb?: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-sm transition-colors",
            value === o.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/50",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function InterviewApp({ loggedIn, pro }: { loggedIn: boolean; pro: boolean }) {
  const caps = pro ? PLAN_CAPS.pro : PLAN_CAPS.free;

  const [phase, setPhase] = React.useState<Phase>("setup");
  const [role, setRole] = React.useState<RoleId>("frontend");
  const [level, setLevel] = React.useState<LevelId>("mid");
  const [type, setType] = React.useState<TypeId>("mixed");
  const [jd, setJd] = React.useState("");
  const [resume, setResume] = React.useState("");

  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [qNum, setQNum] = React.useState(0);
  const [total, setTotal] = React.useState(caps.questions);
  const [lastFinal, setLastFinal] = React.useState(false);
  const [report, setReport] = React.useState<InterviewReport | null>(null);
  const [error, setError] = React.useState("");
  const [limitReached, setLimitReached] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function config(): InterviewConfig {
    return { role, level, type, ...(pro && jd.trim() ? { jd } : {}), ...(pro && resume.trim() ? { resume } : {}) };
  }

  function handleErr(e: unknown) {
    const err = e as { status?: number; error?: string; message?: string; limitReached?: boolean };
    setError(err.error || err.message || "Something went wrong. Please try again.");
    if (err.limitReached) setLimitReached(true);
  }

  async function start() {
    setError("");
    setLimitReached(false);
    setReport(null);
    setMessages([]);
    setBusy(true);
    setPhase("interview");
    try {
      const data = await post({ action: "turn", config: config(), history: [] });
      setMessages([{ role: "assistant", content: data.message }]);
      setTotal(data.totalQuestions);
      setQNum(data.questionNumber);
      setLastFinal(Boolean(data.isLast));
    } catch (e) {
      handleErr(e);
      setPhase("setup");
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    const answer = input.trim();
    if (!answer || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: answer }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError("");
    try {
      if (lastFinal) {
        const data = await post({ action: "report", config: config(), history: next });
        setReport(data.report);
        setPhase("report");
      } else {
        const data = await post({ action: "turn", config: config(), history: next });
        if (data.done) {
          const r = await post({ action: "report", config: config(), history: next });
          setReport(r.report);
          setPhase("report");
        } else {
          setMessages([...next, { role: "assistant", content: data.message }]);
          setQNum(data.questionNumber);
          setLastFinal(Boolean(data.isLast));
        }
      }
    } catch (e) {
      handleErr(e);
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPhase("setup");
    setMessages([]);
    setReport(null);
    setInput("");
    setError("");
    setLimitReached(false);
    setQNum(0);
  }

  // ── Report ─────────────────────────────────────────────────────────────────
  if (phase === "report" && report) {
    return (
      <div className="flex flex-col gap-5">
        <FeedbackReport report={report} pro={pro} label={labelFor(config())} />
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={reset} variant="outline">
            <RotateCcwIcon />
            Practice again
          </Button>
          {!pro && (
            <Button render={<Link href="/pricing" />}>
              <SparklesIcon />
              Go Pro for longer interviews
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Interview ────────────────────────────────────────────────────────────────
  if (phase === "interview") {
    const progress = total > 0 ? Math.min(100, Math.round((qNum / total) * 100)) : 0;
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{labelFor(config())}</span>
          <span className="text-muted-foreground tabular-nums">
            {qNum > 0 ? `Question ${qNum} of ${total}` : "Starting…"}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div ref={scrollRef} className="flex max-h-[52vh] min-h-64 flex-col gap-3 overflow-y-auto rounded-xl border border-border bg-muted/20 p-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm border border-border bg-card",
                )}
              >
                {m.content}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2Icon className="size-4 animate-spin" />
                {lastFinal ? "Grading your interview…" : "Thinking…"}
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={busy ? "Please wait…" : "Type your answer…  (⌘/Ctrl + Enter to send)"}
            rows={3}
            disabled={busy}
            className="resize-none"
          />
          <Button onClick={send} disabled={busy || !input.trim()} size="icon" className="size-11 shrink-0" aria-label="Send answer">
            <SendIcon />
          </Button>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <button onClick={reset} className="hover:text-foreground">End &amp; restart</button>
          <span>Answer out loud in your head first, then type a concise version — like a real interview.</span>
        </div>
      </div>
    );
  }

  // ── Setup ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>Role</Label>
        <Segmented value={role} onChange={setRole} options={ROLES} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Level</Label>
        <Segmented value={level} onChange={setLevel} options={LEVELS} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Interview type</Label>
        <Segmented value={type} onChange={setType} options={TYPES} />
        <p className="text-xs text-muted-foreground">{TYPES.find((t) => t.id === type)?.blurb}</p>
      </div>

      {/* Pro-only tailoring */}
      <div className="rounded-xl border border-border p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tailor to a job (optional)</span>
          {!pro && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <LockIcon className="size-3" />
              Pro
            </span>
          )}
        </div>
        {pro ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="jd" className="text-xs text-muted-foreground">Job description</Label>
              <Textarea id="jd" value={jd} onChange={(e) => setJd(e.target.value)} rows={4} placeholder="Paste the JD to tailor questions…" className="resize-none text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="resume" className="text-xs text-muted-foreground">Your background / resume</Label>
              <Textarea id="resume" value={resume} onChange={(e) => setResume(e.target.value)} rows={4} placeholder="Paste your resume to get questions about your experience…" className="resize-none text-sm" />
            </div>
          </div>
        ) : (
          <p className="mt-1.5 text-sm text-muted-foreground">
            Paste a job description or your resume and Pro tailors the questions to it.{" "}
            <Link href="/pricing" className="text-primary hover:underline">See Pro</Link>
          </p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {limitReached && !pro && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
          <p className="font-medium">You&rsquo;ve used today&rsquo;s free interview.</p>
          <p className="mt-1 text-muted-foreground">
            Pro gives you longer interviews ({PLAN_CAPS.pro.questions} questions), {PLAN_CAPS.pro.sessionsPerDay} per day, and JD/resume tailoring.
          </p>
          <Button render={<Link href="/pricing" />} className="mt-3" size="sm">
            <SparklesIcon />
            Upgrade to Pro
          </Button>
        </div>
      )}

      {loggedIn ? (
        <Button onClick={start} disabled={busy} size="lg">
          {busy ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
          Start the interview
        </Button>
      ) : (
        <Button render={<Link href="/login?next=/interview" />} size="lg">
          Sign in to start
        </Button>
      )}
      <p className="text-center text-xs text-muted-foreground">
        {pro
          ? `Pro: up to ${caps.questions} questions, ${caps.sessionsPerDay} interviews/day.`
          : `Free: 1 interview a day, ${caps.questions} questions. Answers aren't stored.`}
      </p>
    </div>
  );
}
