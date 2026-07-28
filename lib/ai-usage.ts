import "server-only";

import { prisma } from "@/lib/prisma";

// Freemium quota for the AI tools: free (logged-in) users get this many runs
// per UTC day; Pro is unlimited (never counted). See app/api/ai/route.ts.
export const FREE_DAILY_AI_LIMIT = 5;

function today(): string {
  return new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
}

/** Runs the user has already used today. Throws if the table is unavailable. */
export async function getAiUsageToday(userId: string): Promise<number> {
  const row = await prisma.aiUsage.findUnique({
    where: { userId_day: { userId, day: today() } },
    select: { count: true },
  });
  return row?.count ?? 0;
}

/** Increment today's counter. Best-effort — never throws to the caller. */
export async function incrementAiUsage(userId: string): Promise<void> {
  const day = today();
  try {
    await prisma.aiUsage.upsert({
      where: { userId_day: { userId, day } },
      create: { userId, day, count: 1 },
      update: { count: { increment: 1 } },
    });
  } catch {
    /* counting is best-effort; don't fail the response if it errors */
  }
}
