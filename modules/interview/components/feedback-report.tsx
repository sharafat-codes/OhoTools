import Link from "next/link";
import { CheckCircle2Icon, TrendingUpIcon, TargetIcon, LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { InterviewReport } from "@/modules/interview/config";

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-500";
  if (score >= 60) return "text-amber-600 dark:text-amber-500";
  return "text-rose-600 dark:text-rose-500";
}

export function FeedbackReport({
  report,
  pro,
  label,
}: {
  report: InterviewReport;
  pro: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Overall */}
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className={cn("font-heading text-5xl font-semibold tabular-nums", scoreTone(report.overallScore))}>
            {report.overallScore}
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <div className="font-medium">{report.readiness}</div>
          {report.summary && <p className="mt-1 max-w-xl text-sm text-muted-foreground">{report.summary}</p>}
        </CardContent>
      </Card>

      {/* Strengths + improvements */}
      <div className="grid gap-4 sm:grid-cols-2">
        {report.strengths.length > 0 && (
          <Card>
            <CardContent className="py-5">
              <div className="mb-3 flex items-center gap-2 font-heading font-semibold">
                <CheckCircle2Icon className="size-4 text-emerald-600 dark:text-emerald-500" />
                Strengths
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
        {report.improvements.length > 0 && (
          <Card>
            <CardContent className="py-5">
              <div className="mb-3 flex items-center gap-2 font-heading font-semibold">
                <TrendingUpIcon className="size-4 text-amber-600 dark:text-amber-500" />
                Work on
              </div>
              <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                {report.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-amber-600 dark:text-amber-500">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Focus areas */}
      {report.focusAreas.length > 0 && (
        <Card>
          <CardContent className="py-5">
            <div className="mb-3 flex items-center gap-2 font-heading font-semibold">
              <TargetIcon className="size-4 text-primary" />
              Study these next
            </div>
            <div className="flex flex-wrap gap-2">
              {report.focusAreas.map((f, i) => (
                <span key={i} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-sm">
                  {f}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Per-question */}
      {report.perQuestion.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-lg font-semibold tracking-tight">Question-by-question</h3>
          {report.perQuestion.map((q, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-2 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium">{q.question || `Question ${i + 1}`}</div>
                  <span className={cn("shrink-0 text-sm font-semibold tabular-nums", scoreTone(q.score * 20))}>
                    {q.score}/5
                  </span>
                </div>
                {q.feedback && <p className="text-sm text-muted-foreground">{q.feedback}</p>}

                {q.modelAnswer &&
                  (pro ? (
                    <div className="mt-1 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Model answer
                      </div>
                      <p className="whitespace-pre-wrap text-muted-foreground">{q.modelAnswer}</p>
                    </div>
                  ) : (
                    <Link
                      href="/pricing"
                      className="mt-1 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-primary transition-colors hover:bg-primary/10"
                    >
                      <LockIcon className="size-4 shrink-0" />
                      Unlock a model answer for this question with Pro
                    </Link>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!pro && (
        <p className="text-center text-xs text-muted-foreground">
          Free reports show scores and feedback. Pro adds model answers, longer interviews, and JD/resume tailoring.
        </p>
      )}
    </div>
  );
}
