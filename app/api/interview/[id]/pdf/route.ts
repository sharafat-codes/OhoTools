import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/plans";
import { labelFor, type RoleId, type LevelId, type TypeId, type InterviewReport } from "@/modules/interview/config";
import { buildInterviewPdf } from "@/lib/interview-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  if (!isPro((user as { plan?: string }).plan ?? "FREE")) {
    return NextResponse.json({ error: "PDF export is a Pro feature." }, { status: 403 });
  }

  const session = await prisma.interviewSession.findFirst({
    where: { id, userId: (user as { id: string }).id },
  });
  if (!session) return NextResponse.json({ error: "Not found." }, { status: 404 });

  let report: InterviewReport;
  try {
    report = JSON.parse(session.report) as InterviewReport;
  } catch {
    return NextResponse.json({ error: "Report could not be read." }, { status: 500 });
  }

  const label = labelFor({
    role: session.role as RoleId,
    level: session.level as LevelId,
    type: session.type as TypeId,
  });
  const dateStr = session.createdAt.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const bytes = await buildInterviewPdf(report, label, dateStr);

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="ohotool-interview-report.pdf"`,
      "cache-control": "no-store",
    },
  });
}
