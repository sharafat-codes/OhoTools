import Link from "next/link";
import { CheckCircle2Icon, TargetIcon, LockIcon, AlertTriangleIcon, MessagesSquareIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { ResumeReport } from "@/modules/resume/config";

function tone(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-500";
  if (score >= 60) return "text-amber-600 dark:text-amber-500";
  return "text-rose-600 dark:text-rose-500";
}

const SEV: Record<string, string> = {
  high: "border-rose-500/40 bg-rose-500/[0.06] text-rose-700 dark:text-rose-400",
  medium: "border-amber-500/40 bg-amber-500/[0.06] text-amber-700 dark:text-amber-400",
  low: "border-border bg-muted/30 text-muted-foreground",
};

function Gauge({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className={cn("font-heading text-3xl font-semibold tabular-nums", tone(score))}>{score}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function ResumeReviewReport({ report, pro }: { report: ResumeReport; pro: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Scores */}
      <div className={cn("grid gap-3", report.matchScore !== null ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
        <Gauge label="Overall" score={report.overallScore} />
        <Gauge label="ATS-friendly" score={report.atsScore} />
        {report.matchScore !== null && <Gauge label="Job match" score={report.matchScore} />}
      </div>
      {report.verdict && <p className="text-center text-sm font-medium">{report.verdict}</p>}

      {/* Missing keywords (only with a target job) */}
      {report.missingKeywords.length > 0 && (
        <Card>
          <CardContent className="py-5">
            <div className="mb-3 flex items-center gap-2 font-heading font-semibold">
              <TargetIcon className="size-4 text-primary" />
              Keywords the job wants that your resume is missing
            </div>
            <div className="flex flex-wrap gap-2">
              {report.missingKeywords.map((k, i) => (
                <span key={i} className="rounded-full border border-amber-500/40 bg-amber-500/[0.06] px-3 py-1 text-sm">
                  {k}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {report.strengths.length > 0 && (
        <Card>
          <CardContent className="py-5">
            <div className="mb-3 flex items-center gap-2 font-heading font-semibold">
              <CheckCircle2Icon className="size-4 text-emerald-600 dark:text-emerald-500" />
              What&rsquo;s working
            </div>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-600 dark:text-emerald-500">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Issues */}
      {report.issues.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-lg font-semibold tracking-tight">Issues to fix</h3>
          {report.issues.map((it, i) => (
            <div key={i} className={cn("rounded-xl border p-4", SEV[it.severity] ?? SEV.low)}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangleIcon className="size-4 shrink-0" />
                <span className="uppercase tracking-wide">{it.severity}</span>
              </div>
              <p className="mt-1.5 text-sm text-foreground">{it.issue}</p>
              {it.fix && <p className="mt-1 text-sm text-muted-foreground"><span className="font-medium">Fix:</span> {it.fix}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Section scores */}
      {report.sections.length > 0 && (
        <Card>
          <CardContent className="py-5">
            <div className="mb-3 font-heading font-semibold">Section-by-section</div>
            <div className="flex flex-col gap-3">
              {report.sections.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className={cn("text-sm font-semibold tabular-nums", tone(s.score * 20))}>{s.score}/5</span>
                  </div>
                  {s.feedback && <p className="mt-0.5 text-sm text-muted-foreground">{s.feedback}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewrites — Pro-gated */}
      {report.rewrites.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-lg font-semibold tracking-tight">Stronger bullet rewrites</h3>
          {pro ? (
            report.rewrites.map((r, i) => (
              <Card key={i}>
                <CardContent className="flex flex-col gap-2 py-4 text-sm">
                  <div className="text-muted-foreground line-through decoration-rose-400/50">{r.original}</div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.06] p-2.5 text-foreground">
                    {r.improved}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-primary transition-colors hover:bg-primary/10"
            >
              <LockIcon className="size-4 shrink-0" />
              Unlock {report.rewrites.length} AI-rewritten, quantified versions of your weakest bullets with Pro
            </Link>
          )}
        </div>
      )}

      {/* Top actions */}
      {report.topActions.length > 0 && (
        <Card className="border-primary/25 bg-primary/[0.03]">
          <CardContent className="py-5">
            <div className="mb-2 font-heading font-semibold">Do these first</div>
            <ol className="flex flex-col gap-2 text-sm">
              {report.topActions.map((a, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{a}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Cross-link to the interview agent */}
      <Link
        href="/interview"
        className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <MessagesSquareIcon className="size-5" />
          </span>
          <div>
            <div className="font-heading font-semibold">Resume ready? Practice the interview next</div>
            <div className="text-sm text-muted-foreground">Run a free AI mock interview and get a scored report.</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
