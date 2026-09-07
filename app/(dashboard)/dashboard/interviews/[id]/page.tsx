import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, DownloadIcon, SparklesIcon } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/plans";
import { labelFor, type RoleId, type LevelId, type TypeId, type InterviewReport } from "@/modules/interview/config";
import { FeedbackReport } from "@/modules/interview/components/feedback-report";
import { DeleteInterviewButton } from "@/modules/interview/components/delete-interview-button";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Interview report" };

export default async function InterviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");

  // Ownership check baked into the query — a user can only open their own report.
  const session = await prisma.interviewSession.findFirst({
    where: { id, userId: user.id },
  });
  if (!session) notFound();

  let report: InterviewReport;
  try {
    report = JSON.parse(session.report) as InterviewReport;
  } catch {
    notFound();
  }

  const label = labelFor({
    role: session.role as RoleId,
    level: session.level as LevelId,
    type: session.type as TypeId,
  });

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href="/dashboard/interviews"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to history
        </Link>
        <div className="flex items-center gap-2">
          {pro ? (
            <Button variant="outline" size="sm" render={<a href={`/api/interview/${id}/pdf`} />}>
              <DownloadIcon className="size-4" />
              Download PDF
            </Button>
          ) : (
            <Button variant="outline" size="sm" render={<Link href="/dashboard/billing" />}>
              <SparklesIcon className="size-4" />
              Export PDF — Pro
            </Button>
          )}
          <DeleteInterviewButton id={id} />
        </div>
      </div>

      <FeedbackReport report={report} pro={pro} label={label} />
    </div>
  );
}
