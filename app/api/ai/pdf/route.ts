import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { answerFromDocument, isAiConfigured } from "@/lib/ai";
import { getAiUsageToday, incrementAiUsage, FREE_DAILY_AI_LIMIT } from "@/lib/ai-usage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

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
          error: `You've used your ${FREE_DAILY_AI_LIMIT} free AI runs for today. Upgrade to Pro for unlimited AI.`,
          usage: { remaining: 0, limit: FREE_DAILY_AI_LIMIT },
        },
        { status: 429 },
      );
    }
  }

  let body: { doc?: unknown; question?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const doc = typeof body.doc === "string" ? body.doc : "";
  const question = typeof body.question === "string" ? body.question : "";
  const history: Msg[] = Array.isArray(body.history)
    ? (body.history as unknown[])
        .filter(
          (h): h is Msg =>
            !!h &&
            typeof h === "object" &&
            ((h as Msg).role === "user" || (h as Msg).role === "assistant") &&
            typeof (h as Msg).content === "string",
        )
        .map((h) => ({ role: h.role, content: h.content.slice(0, 4000) }))
    : [];

  const result = await answerFromDocument({ doc, question, history });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  let usage: { remaining: number; limit: number } | undefined;
  if (!pro) {
    await incrementAiUsage(userId).catch(() => {});
    const used = await getAiUsageToday(userId).catch(() => FREE_DAILY_AI_LIMIT);
    usage = { remaining: Math.max(0, FREE_DAILY_AI_LIMIT - used), limit: FREE_DAILY_AI_LIMIT };
  }

  return NextResponse.json({ answer: result.result, truncated: result.truncated ?? false, usage });
}
