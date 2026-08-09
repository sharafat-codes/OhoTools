import "server-only";

import OpenAI from "openai";

import { RESUME_MAX, JOB_MAX, type ResumeReport } from "@/modules/resume/config";

// Self-contained AI layer for the resume reviewer (own OpenAI client so the
// module is extractable). Same env as lib/ai.ts.
const apiKey = process.env.OPENAI_API_KEY?.trim();
const AI_MODEL = process.env.AI_MODEL?.trim() || "gpt-5.6-luna";
const isReasoningModel = /^(gpt-5|o\d)/i.test(AI_MODEL);

export function isResumeConfigured(): boolean {
  return Boolean(apiKey);
}

let cached: OpenAI | null = null;
function client(): OpenAI {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  if (!cached) cached = new OpenAI({ apiKey });
  return cached;
}

export async function reviewResume(opts: {
  resume: string;
  targetJob?: string;
}): Promise<{ ok: true; report: ResumeReport } | { ok: false; status: number; error: string }> {
  if (!apiKey) return { ok: false, status: 503, error: "Resume review isn't configured yet." };

  const resume = opts.resume.trim().slice(0, RESUME_MAX);
  const job = opts.targetJob?.trim().slice(0, JOB_MAX);
  if (resume.length < 60) return { ok: false, status: 400, error: "Please paste your full resume text." };

  const system = `You are an expert technical recruiter and resume reviewer who knows how ATS (applicant tracking systems) parse resumes. Review the candidate's resume critically but constructively.
${job ? "A target job description is provided — assess how well the resume matches it, compute a match score, and list important keywords/skills from the job that are missing from the resume." : "No target job is provided, so set matchScore to null and missingKeywords to an empty array."}
Return ONLY valid JSON (no markdown, no prose outside JSON) with exactly this shape:
{
  "overallScore": <integer 0-100>,
  "verdict": "<short phrase, e.g. 'Solid, needs sharper impact'>",
  "atsScore": <integer 0-100, how ATS-friendly the formatting/structure is>,
  "matchScore": <integer 0-100 or null>,
  "missingKeywords": ["<keyword>", ...],
  "strengths": ["<specific strength>", ...],
  "issues": [{ "severity": "high|medium|low", "issue": "<what's wrong>", "fix": "<how to fix it>" }],
  "sections": [{ "name": "<Summary|Experience|Skills|Education|Formatting>", "score": <integer 1-5>, "feedback": "<specific, actionable>" }],
  "rewrites": [{ "original": "<a weak bullet from the resume>", "improved": "<a stronger, quantified rewrite>" }],
  "topActions": ["<highest-impact fix>", ...]
}
Be specific and reference the resume's actual content. Favour quantified, impact-led bullet rewrites. Provide 3-6 rewrites of the weakest bullets.`;

  const user = job
    ? `RESUME:\n"""\n${resume}\n"""\n\nTARGET JOB DESCRIPTION:\n"""\n${job}\n"""`
    : `RESUME:\n"""\n${resume}\n"""`;

  try {
    const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: AI_MODEL,
      max_completion_tokens: 3800,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    };
    if (isReasoningModel) (params as { reasoning_effort?: string }).reasoning_effort = "low";
    else params.temperature = 0.2;

    const completion = await client().chat.completions.create(params);
    const raw = (completion.choices[0]?.message?.content ?? "").trim();
    if (!raw) return { ok: false, status: 502, error: "No review was produced. Please try again." };

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, status: 502, error: "Couldn't build your review. Please try again." };
    }
    return { ok: true, report: normalize(parsed, Boolean(job)) };
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return { ok: false, status: err.status ?? 500, error: err.message || "AI service error. Please try again." };
  }
}

function normalize(p: unknown, hasJob: boolean): ResumeReport {
  const o = (p ?? {}) as Record<string, unknown>;
  const strArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
  const num = (v: unknown, min: number, max: number, fallback: number) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback;
  };
  const sev = (v: unknown): "high" | "medium" | "low" =>
    v === "high" || v === "medium" || v === "low" ? v : "medium";

  const issues = Array.isArray(o.issues)
    ? (o.issues as unknown[]).map((x) => {
        const r = (x ?? {}) as Record<string, unknown>;
        return { severity: sev(r.severity), issue: String(r.issue ?? ""), fix: String(r.fix ?? "") };
      })
    : [];
  const sections = Array.isArray(o.sections)
    ? (o.sections as unknown[]).map((x) => {
        const r = (x ?? {}) as Record<string, unknown>;
        return { name: String(r.name ?? ""), score: num(r.score, 1, 5, 3), feedback: String(r.feedback ?? "") };
      })
    : [];
  const rewrites = Array.isArray(o.rewrites)
    ? (o.rewrites as unknown[]).map((x) => {
        const r = (x ?? {}) as Record<string, unknown>;
        return { original: String(r.original ?? ""), improved: String(r.improved ?? "") };
      })
    : [];

  let matchScore: number | null = null;
  if (hasJob) matchScore = num(o.matchScore, 0, 100, 50);

  return {
    overallScore: num(o.overallScore, 0, 100, 50),
    verdict: String(o.verdict ?? "Needs a few improvements"),
    atsScore: num(o.atsScore, 0, 100, 60),
    matchScore,
    missingKeywords: strArr(o.missingKeywords),
    strengths: strArr(o.strengths),
    issues,
    sections,
    rewrites,
    topActions: strArr(o.topActions),
  };
}
