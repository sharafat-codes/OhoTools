import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { runAiTask, isAiConfigured } from "@/lib/ai";
import { getAiUsageToday, incrementAiUsage, FREE_DAILY_AI_LIMIT } from "@/lib/ai-usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to use AI tools." }, { status: 401 });
  }
  if (!isAiConfigured()) {
    return NextResponse.json({ error: "AI tools aren't configured yet." }, { status: 503 });
  }

  const pro = isPro((user as { plan?: string }).plan ?? "FREE");
  const userId = (user as { id: string }).id;

  // Free users: enforce the daily quota before spending on the API call.
  if (!pro) {
    let used: number;
    try {
      used = await getAiUsageToday(userId);
    } catch {
      // Quota table unavailable (e.g. migration not applied) — fail closed so
      // free usage can't run up cost untracked. Pro users are unaffected.
      return NextResponse.json(
        { error: "The AI free tier is warming up — please try again shortly, or go Pro for unlimited." },
        { status: 503 },
      );
    }
    if (used >= FREE_DAILY_AI_LIMIT) {
      return NextResponse.json(
        {
          error: `You've used your ${FREE_DAILY_AI_LIMIT} free AI runs for today. Upgrade to Pro for unlimited AI.`,
          usage: { remaining: 0, limit: FREE_DAILY_AI_LIMIT },
        },
        { status: 429 },
      );
    }
  }

  let body: { task?: unknown; text?: unknown; options?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { task, text, options } = body;
  if (typeof task !== "string" || typeof text !== "string") {
    return NextResponse.json({ error: "Missing task or text." }, { status: 400 });
  }
  const opts =
    options && typeof options === "object" ? (options as Record<string, string>) : {};

  const result = await runAiTask(task, text, opts);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // Count the successful run for free users and report remaining quota.
  let usage: { remaining: number; limit: number } | undefined;
  if (!pro) {
    await incrementAiUsage(userId);
    const used = await getAiUsageToday(userId).catch(() => FREE_DAILY_AI_LIMIT);
    usage = { remaining: Math.max(0, FREE_DAILY_AI_LIMIT - used), limit: FREE_DAILY_AI_LIMIT };
  }

  return NextResponse.json({ result: result.result, usage });
}
