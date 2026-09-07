import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/plans";
import { labelFor, type RoleId, type LevelId, type TypeId, type InterviewReport } from "@/modules/interview/config";
import { FeedbackReport } from "@/modules/interview/components/feedback-report";

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
      <Link
        href="/dashboard/interviews"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to history
      </Link>

      <FeedbackReport report={report} pro={pro} label={label} />
    </div>
  );
}
