"use client";

import * as React from "react";
import Link from "next/link";
import { UploadIcon, FileTextIcon, XCircleIcon, TriangleAlertIcon, CheckCircle2Icon, Loader2Icon, RotateCcwIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { analyzeResumeFormat, type AtsReport, type CheckStatus } from "@/modules/resume/ats-format";

function tone(score: number) {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-500";
  if (score >= 70) return "text-lime-600 dark:text-lime-500";
  if (score >= 50) return "text-amber-600 dark:text-amber-500";
  return "text-red-600 dark:text-red-500";
}

const STATUS_ICON: Record<CheckStatus, React.ReactNode> = {
  pass: <CheckCircle2Icon className="size-4 shrink-0 text-emerald-600 dark:text-emerald-500" />,
  warn: <TriangleAlertIcon className="size-4 shrink-0 text-amber-600 dark:text-amber-500" />,
  fail: <XCircleIcon className="size-4 shrink-0 text-red-600 dark:text-red-500" />,
};

const ORDER: Record<CheckStatus, number> = { fail: 0, warn: 1, pass: 2 };

export function AtsCheckerApp() {
  const [report, setReport] = React.useState<AtsReport | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    setReport(null);
    setFileName(file.name);
    setLoading(true);
    try {
      const r = await analyzeResumeFormat(file);
      setReport(r);
    } catch {
      setError("Couldn't read that file. Try a PDF or Word (.docx) resume.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setReport(null);
    setFileName("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const checks = report ? [...report.checks].sort((a, b) => ORDER[a.status] - ORDER[b.status]) : [];
  const fails = report?.checks.filter((c) => c.status === "fail").length ?? 0;
  const warns = report?.checks.filter((c) => c.status === "warn").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Uploader */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border bg-card",
        )}
      >
        <UploadIcon className="size-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Drop your resume here, or</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Choose file
          </button>
        </div>
        <p className="text-xs text-muted-foreground">PDF or Word (.docx) — analyzed in your browser, never uploaded.</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" /> Checking {fileName}…
        </div>
      )}

      {error && <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {report && !loading && (
        <>
          {/* Score */}
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 text-center">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileTextIcon className="size-3.5" /> {fileName} · {report.fileType}
              {report.pages > 0 && ` · ${report.pages} page${report.pages > 1 ? "s" : ""}`} · {report.words} words
            </div>
            <div className={cn("font-heading text-5xl font-semibold tabular-nums", tone(report.score))}>{report.score}<span className="text-2xl text-muted-foreground">/100</span></div>
            <p className="text-sm font-medium">{report.verdict}</p>
            <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
              {fails > 0 && <span className="text-red-600 dark:text-red-500">{fails} critical</span>}
              {warns > 0 && <span className="text-amber-600 dark:text-amber-500">{warns} to improve</span>}
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 hover:text-foreground">
                <RotateCcwIcon className="size-3" /> Check another
              </button>
            </div>
          </div>

          {/* Checks */}
          <ul className="flex flex-col gap-2">
            {checks.map((c) => (
              <li key={c.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
                {STATUS_ICON[c.status]}
                <div className="min-w-0">
                  <div className="text-sm font-medium">{c.label}</div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{c.detail}</p>
                  {c.fix && (
                    <p className="mt-1 text-xs text-primary">
                      <span className="font-semibold">Fix:</span> {c.fix}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Cross-links */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/[0.06] to-transparent p-4 text-sm">
            <p className="font-medium">Want feedback on the content, not just the format?</p>
            <p className="mt-1 text-muted-foreground">
              The <Link href="/resume-review" className="font-medium text-primary hover:underline">AI Resume Reviewer</Link> scores your resume against a job description, finds missing keywords, and rewrites weak bullet points. Or generate a strong{" "}
              <Link href="/tools/resume-summary-generator" className="font-medium text-primary hover:underline">resume summary</Link>.
            </p>
          </div>
        </>
      )}

      {!report && !loading && (
        <p className="text-center text-xs text-muted-foreground">
          This checks how well an ATS can <em>parse</em> your resume file. For keyword-match scoring against a specific job, use the{" "}
          <Link href="/resume-review" className="text-primary hover:underline">AI Resume Reviewer</Link>.
        </p>
      )}
    </div>
  );
}
