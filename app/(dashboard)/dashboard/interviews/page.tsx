import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { MessagesSquareIcon, ArrowRightIcon, TrendingUpIcon } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/plans";
import { labelFor, type RoleId, type LevelId, type TypeId } from "@/modules/interview/config";
import { ProgressChart } from "@/modules/interview/components/progress-chart";
import { UpgradeCard } from "@/components/upgrade-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Interview history" };

function scoreTone(score: number) {
  if (score >= 80) return "text-emerald-600 dark:text-emerald-500";
  if (score >= 60) return "text-amber-600 dark:text-amber-500";
  return "text-rose-600 dark:text-rose-500";
}

export default async function InterviewsPage() {
  const user = await requireUser();
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");

  const sessions = await prisma.interviewSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, role: true, level: true, type: true, overallScore: true, readiness: true, createdAt: true },
  });

  // Chart wants chronological order (oldest → newest) so the line shows progress.
  const chartPoints = [...sessions]
    .reverse()
    .map((s) => ({ score: s.overallScore, label: format(s.createdAt, "MMM d") }));

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Interview history</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your mock-interview scores over time and revisit your feedback.
          </p>
        </div>
        <Button render={<Link href="/interview" />}>
          <MessagesSquareIcon className="size-4" />
          New mock interview
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessagesSquareIcon className="size-6" />
            </span>
            <p className="font-medium">No interviews yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Complete a mock interview and your score and feedback will show up here so you can track your progress.
            </p>
            <Button className="mt-1" render={<Link href="/interview" />}>
              Start a mock interview
              <ArrowRightIcon className="size-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Progress chart — Pro, with at least two sessions to plot a trend */}
          {pro && chartPoints.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  <TrendingUpIcon className="size-4 text-primary" /> Your progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressChart points={chartPoints} />
              </CardContent>
            </Card>
          )}

          {/* Session list */}
          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/interviews/${s.id}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">
                    {labelFor({ role: s.role as RoleId, level: s.level as LevelId, type: s.type as TypeId })}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {format(s.createdAt, "MMM d, yyyy · h:mm a")} · {s.readiness}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className={cn("font-heading text-xl font-semibold tabular-nums", scoreTone(s.overallScore))}>
                    {s.overallScore}
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>

          {/* Free upsell — free keeps only the latest session */}
          {!pro && (
            <UpgradeCard reason="Free keeps only your most recent interview. Go Pro to keep your full history, track your score over time, and export PDF reports." />
          )}
        </div>
      )}
    </div>
  );
}
