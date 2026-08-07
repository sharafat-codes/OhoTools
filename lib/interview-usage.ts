import "server-only";

import { prisma } from "@/lib/prisma";

// Metered per interview SESSION started (not per AI call). See config PLAN_CAPS
// for the free/pro daily limits, and app/api/interview/route.ts for enforcement.

function today(): string {
  return new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
}

/** Interview sessions the user has started today. Throws if table unavailable. */
export async function getInterviewSessionsToday(userId: string): Promise<number> {
  const row = await prisma.interviewUsage.findUnique({
    where: { userId_day: { userId, day: today() } },
    select: { count: true },
  });
  return row?.count ?? 0;
}

/** Count one started session. Best-effort — never throws to the caller. */
export async function incrementInterviewSessions(userId: string): Promise<void> {
  const day = today();
  try {
    await prisma.interviewUsage.upsert({
      where: { userId_day: { userId, day } },
      create: { userId, day, count: 1 },
      update: { count: { increment: 1 } },
    });
  } catch {
    /* best-effort */
  }
}

/** Feedback reports the user has generated today. Throws if table unavailable. */
export async function getInterviewReportsToday(userId: string): Promise<number> {
  const row = await prisma.interviewUsage.findUnique({
    where: { userId_day: { userId, day: today() } },
    select: { reports: true },
  });
  return row?.reports ?? 0;
}

/** Count one generated report. Best-effort — never throws to the caller. */
export async function incrementInterviewReports(userId: string): Promise<void> {
  const day = today();
  try {
    await prisma.interviewUsage.upsert({
      where: { userId_day: { userId, day } },
      create: { userId, day, reports: 1 },
      update: { reports: { increment: 1 } },
    });
  } catch {
    /* best-effort */
  }
}
