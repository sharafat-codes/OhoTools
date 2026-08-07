import "server-only";

import OpenAI from "openai";

import {
  ROLES,
  LEVELS,
  TYPES,
  JD_MAX,
  RESUME_MAX,
  type InterviewConfig,
  type InterviewReport,
} from "@/modules/interview/config";

// Self-contained AI layer for the mock-interview module (own OpenAI client so
// the module is extractable). Uses the same env as lib/ai.ts.
const apiKey = process.env.OPENAI_API_KEY?.trim();
const AI_MODEL = process.env.AI_MODEL?.trim() || "gpt-5.6-luna";
const isReasoningModel = /^(gpt-5|o\d)/i.test(AI_MODEL);

export function isInterviewConfigured(): boolean {
  return Boolean(apiKey);
}

let cached: OpenAI | null = null;
function client(): OpenAI {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  if (!cached) cached = new OpenAI({ apiKey });
  return cached;
}

export type Turn = { role: "user" | "assistant"; content: string };

function roleLabel(c: InterviewConfig) {
  const r = ROLES.find((x) => x.id === c.role);
  const l = LEVELS.find((x) => x.id === c.level);
  const t = TYPES.find((x) => x.id === c.type);
  return { role: r?.label ?? "Software Engineer", focus: r?.focus ?? "", level: l?.label ?? "Mid-level", type: t?.label ?? "Mixed" };
}

function typeGuidance(typeId: string): string {
  if (typeId === "behavioral")
    return "Ask behavioral questions that invite STAR-style stories (situation, task, action, result) about past experience, collaboration, conflict, ownership, and impact.";
  if (typeId === "technical")
    return "Ask technical concept and problem-solving questions (spoken/explained, not live coding). Probe depth and reasoning.";
  return "Blend technical concept questions with behavioral questions, alternating naturally as a real interviewer would.";
}

function tailoring(c: InterviewConfig): string {
  let s = "";
  if (c.jd) s += `\n\nTailor your questions to this job description:\n"""\n${c.jd.slice(0, JD_MAX)}\n"""`;
  if (c.resume)
    s += `\n\nThe candidate's background (ask about relevant experience where natural):\n"""\n${c.resume.slice(0, RESUME_MAX)}\n"""`;
  return s;
}

/** One interviewer turn: reacts to the last answer and asks the next question. */
export async function interviewTurn(opts: {
  config: InterviewConfig;
  history: Turn[];
  questionNumber: number; // 1-based index of the question about to be asked
  totalQuestions: number;
}): Promise<{ ok: true; message: string } | { ok: false; status: number; error: string }> {
  if (!apiKey) return { ok: false, status: 503, error: "Interview practice isn't configured yet." };
  const { role, focus, level, type } = roleLabel(opts.config);
  const n = Math.max(1, opts.questionNumber);
  const total = opts.totalQuestions;
  const last = n >= total;

  const system = `You are a professional, friendly interviewer conducting a realistic ${type} interview for a ${level} ${role} position. Relevant focus areas: ${focus}.
${typeGuidance(opts.config.type)}
Rules:
- Ask ONE question at a time. This is question ${n} of ${total}.
- First, react briefly and naturally to the candidate's previous answer (a short acknowledgement or a pointed follow-up), then ask the next question. On question 1, give a one-line welcome, then ask.
- Calibrate difficulty to a ${level} candidate.
- Do NOT give feedback, scores, corrections, or model answers during the interview — that comes at the end.
${last ? "- This is the FINAL question. After the candidate answers it, the interview ends (do not ask more)." : ""}
- Output only your message to the candidate — no labels, preamble, or XML tags.${tailoring(opts.config)}`;

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: system },
    ...opts.history.slice(-12),
  ];
  if (messages.length === 1) messages.push({ role: "user", content: "Please begin the interview." });

  try {
    const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: AI_MODEL,
      max_completion_tokens: 700,
      messages,
    };
    if (isReasoningModel) (params as { reasoning_effort?: string }).reasoning_effort = "none";
    else params.temperature = 0.6;

    const completion = await client().chat.completions.create(params);
    const choice = completion.choices[0];
    if (choice?.message?.refusal) return { ok: false, status: 422, error: "That request was declined." };
    const out = (choice?.message?.content ?? "").trim();
    if (!out) return { ok: false, status: 502, error: "No question was produced. Please try again." };
    return { ok: true, message: out };
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return { ok: false, status: err.status ?? 500, error: err.message || "AI service error. Please try again." };
  }
}

/** Grades the full transcript and returns a structured feedback report. */
export async function interviewReport(opts: {
  config: InterviewConfig;
  history: Turn[];
}): Promise<{ ok: true; report: InterviewReport } | { ok: false; status: number; error: string }> {
  if (!apiKey) return { ok: false, status: 503, error: "Interview practice isn't configured yet." };
  const { role, level, type } = roleLabel(opts.config);

  const transcript = opts.history
    .map((m) => `${m.role === "assistant" ? "INTERVIEWER" : "CANDIDATE"}: ${m.content}`)
    .join("\n\n");

  const system = `You are an expert interview coach. Evaluate the candidate's performance in this ${type} interview for a ${level} ${role} role. Be specific, fair, and constructive.
Return ONLY valid JSON (no markdown, no prose outside JSON) with exactly this shape:
{
  "overallScore": <integer 0-100>,
  "readiness": "<short phrase, e.g. 'Almost there'>",
  "summary": "<2-3 sentence overview>",
  "strengths": ["<point>", ...],
  "improvements": ["<point>", ...],
  "focusAreas": ["<topic to study>", ...],
  "perQuestion": [
    { "question": "<the interviewer's question>", "answerSummary": "<1 sentence on what they said>", "score": <integer 1-5>, "feedback": "<specific, actionable>", "modelAnswer": "<concise example of a strong answer>" }
  ]
}
Include one perQuestion entry for each real question the candidate answered.`;

  try {
    const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: AI_MODEL,
      max_completion_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: `Interview transcript:\n\n${transcript}` },
      ],
    };
    if (isReasoningModel) (params as { reasoning_effort?: string }).reasoning_effort = "low";
    else params.temperature = 0.2;

    const completion = await client().chat.completions.create(params);
    const raw = (completion.choices[0]?.message?.content ?? "").trim();
    if (!raw) return { ok: false, status: 502, error: "No report was produced. Please try again." };

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, status: 502, error: "Couldn't build your report. Please try again." };
    }

    const report = normalizeReport(parsed);
    return { ok: true, report };
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return { ok: false, status: err.status ?? 500, error: err.message || "AI service error. Please try again." };
  }
}

function normalizeReport(p: unknown): InterviewReport {
  const o = (p ?? {}) as Record<string, unknown>;
  const arr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
  const num = (v: unknown, min: number, max: number, fallback: number) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
  };
  const perQuestion = Array.isArray(o.perQuestion)
    ? (o.perQuestion as unknown[]).map((q) => {
        const r = (q ?? {}) as Record<string, unknown>;
        return {
          question: String(r.question ?? ""),
          answerSummary: String(r.answerSummary ?? ""),
          score: num(r.score, 1, 5, 3),
          feedback: String(r.feedback ?? ""),
          modelAnswer: String(r.modelAnswer ?? ""),
        };
      })
    : [];
  return {
    overallScore: num(o.overallScore, 0, 100, 50),
    readiness: String(o.readiness ?? "Keep practicing"),
    summary: String(o.summary ?? ""),
    strengths: arr(o.strengths),
    improvements: arr(o.improvements),
    focusAreas: arr(o.focusAreas),
    perQuestion,
  };
}
