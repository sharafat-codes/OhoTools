import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { interviewTurn, interviewReport, isInterviewConfigured, type Turn } from "@/lib/interview";
import {
  getInterviewSessionsToday,
  incrementInterviewSessions,
  getInterviewReportsToday,
  incrementInterviewReports,
} from "@/lib/interview-usage";
import {
  ROLES,
  LEVELS,
  TYPES,
  ANSWER_MAX,
  JD_MAX,
  RESUME_MAX,
  capsFor,
  type InterviewConfig,
  type RoleId,
  type LevelId,
  type TypeId,
} from "@/modules/interview/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseConfig(raw: unknown, pro: boolean): InterviewConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const role = o.role as RoleId;
  const level = o.level as LevelId;
  const type = o.type as TypeId;
  if (!ROLES.some((r) => r.id === role)) return null;
  if (!LEVELS.some((l) => l.id === level)) return null;
  if (!TYPES.some((t) => t.id === type)) return null;
  const config: InterviewConfig = { role, level, type };
  // Tailoring is Pro-only — silently ignored for free users.
  if (pro) {
    if (typeof o.jd === "string" && o.jd.trim()) config.jd = o.jd.trim().slice(0, JD_MAX);
    if (typeof o.resume === "string" && o.resume.trim()) config.resume = o.resume.trim().slice(0, RESUME_MAX);
  }
  return config;
}

function parseHistory(raw: unknown): Turn[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[])
    .filter(
      (h): h is Turn =>
        !!h &&
        typeof h === "object" &&
        ((h as Turn).role === "user" || (h as Turn).role === "assistant") &&
        typeof (h as Turn).content === "string",
    )
    .map((h) => ({ role: h.role, content: h.content.slice(0, ANSWER_MAX) }))
    .slice(-24);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Please sign in to practice interviews." }, { status: 401 });
  if (!isInterviewConfigured()) {
    return NextResponse.json({ error: "Interview practice isn't configured yet." }, { status: 503 });
  }
  // A verified email is required — stops one person spinning up throwaway
  // accounts for unlimited free interviews. (Google sign-ins are pre-verified.)
  if (!(user as { emailVerified?: boolean }).emailVerified) {
    return NextResponse.json(
      {
        error: "Please verify your email to start practicing. Check your inbox for the verification link.",
        needsVerification: true,
      },
      { status: 403 },
    );
  }

  const pro = isPro((user as { plan?: string }).plan ?? "FREE");
  const userId = (user as { id: string }).id;
  const caps = capsFor(pro);

  let body: { action?: unknown; config?: unknown; history?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const action = body.action === "report" ? "report" : "turn";
  const config = parseConfig(body.config, pro);
  if (!config) return NextResponse.json({ error: "Invalid interview setup." }, { status: 400 });
  const history = parseHistory(body.history);

  // ── Report ────────────────────────────────────────────────────────────────
  if (action === "report") {
    if (history.length < 2) return NextResponse.json({ error: "Not enough of an interview to grade yet." }, { status: 400 });

    // Metered like sessions (one report per interview) so the report endpoint
    // can't be called repeatedly to rack up AI cost. Fail-open on a read error.
    let usedReports = 0;
    try {
      usedReports = await getInterviewReportsToday(userId);
    } catch {
      /* fail-open — don't block a legit report on a transient DB error */
    }
    if (usedReports >= caps.sessionsPerDay) {
      return NextResponse.json(
        {
          error: pro
            ? `You've hit today's limit of ${caps.sessionsPerDay} reports. Try again tomorrow.`
            : "You've used today's free interview. Upgrade to Pro for more interviews and reports.",
          limitReached: true,
        },
        { status: 429 },
      );
    }

    const result = await interviewReport({ config, history });
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
    await incrementInterviewReports(userId).catch(() => {});
    return NextResponse.json({ report: result.report, pro });
  }

  // ── Turn ──────────────────────────────────────────────────────────────────
  const starting = history.length === 0;

  // Check the daily cap up front, but only *consume* it after the first
  // question succeeds — an AI hiccup shouldn't burn someone's free interview.
  if (starting) {
    let used: number;
    try {
      used = await getInterviewSessionsToday(userId);
    } catch {
      return NextResponse.json(
        { error: "Interview practice is warming up — please try again shortly." },
        { status: 503 },
      );
    }
    if (used >= caps.sessionsPerDay) {
      return NextResponse.json(
        {
          error: pro
            ? `You've hit today's limit of ${caps.sessionsPerDay} interviews. Try again tomorrow.`
            : `You've used your free interview for today. Upgrade to Pro for longer interviews and more per day.`,
          limitReached: true,
        },
        { status: 429 },
      );
    }
  }

  const askedSoFar = history.filter((h) => h.role === "assistant").length;
  const questionNumber = askedSoFar + 1;

  // Interview is over — tell the client to fetch the report instead.
  if (askedSoFar >= caps.questions) {
    return NextResponse.json({ done: true, totalQuestions: caps.questions });
  }

  const result = await interviewTurn({ config, history, questionNumber, totalQuestions: caps.questions });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  // First question landed — now it counts against the daily allowance.
  if (starting) await incrementInterviewSessions(userId).catch(() => {});

  const isLast = questionNumber >= caps.questions;
  return NextResponse.json({
    message: result.message,
    questionNumber,
    totalQuestions: caps.questions,
    isLast,
    pro,
  });
}
