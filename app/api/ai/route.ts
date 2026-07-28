import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { runAiTask, isAiConfigured } from "@/lib/ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in to use this tool." }, { status: 401 });
  }
  if (!isPro((user as { plan?: string }).plan ?? "FREE")) {
    return NextResponse.json({ error: "AI tools are a Pro feature." }, { status: 403 });
  }
  if (!isAiConfigured()) {
    return NextResponse.json({ error: "AI tools aren't configured yet." }, { status: 503 });
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
  return NextResponse.json({ result: result.result });
}
