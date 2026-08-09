import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { reviewResume, isResumeConfigured } from "@/lib/resume";
import { getAiUsageToday, incrementAiUsage, FREE_DAILY_AI_LIMIT } from "@/lib/ai-usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to review your resume." }, { status: 401 });
  if (!isResumeConfigured()) {
    return NextResponse.json({ error: "Resume review isn't configured yet." }, { status: 503 });
  }

  const pro = isPro((user as { plan?: string }).plan ?? "FREE");
  const userId = (user as { id: string }).id;

  if (!pro) {
    let used: number;
    try {
      used = await getAiUsageToday(userId);
    } catch {
      return NextResponse.json(
        { error: "The AI free tier is warming up — please try again shortly, or go Pro for unlimited." },
        { status: 503 },
      );
    }
    if (used >= FREE_DAILY_AI_LIMIT) {
      return NextResponse.json(
        {
          error: `You've used your ${FREE_DAILY_AI_LIMIT} free AI runs for today. Upgrade to Pro for unlimited.`,
          limitReached: true,
        },
        { status: 429 },
      );
    }
  }

  let body: { resume?: unknown; targetJob?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const resume = typeof body.resume === "string" ? body.resume : "";
  const targetJob = typeof body.targetJob === "string" ? body.targetJob : undefined;

  const result = await reviewResume({ resume, targetJob });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  if (!pro) await incrementAiUsage(userId).catch(() => {});

  return NextResponse.json({ report: result.report, pro });
}
