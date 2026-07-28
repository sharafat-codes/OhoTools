import "server-only";

import OpenAI from "openai";

// AI text tools (summarize / paraphrase / translate / grammar), powered by OpenAI.
// Pro-gated because each call has an API cost.

const apiKey = process.env.OPENAI_API_KEY?.trim();

// Default to a small, cheap model — these are simple text transforms that don't
// need a flagship model. Override with AI_MODEL (e.g. gpt-5-mini) if desired.
const AI_MODEL = process.env.AI_MODEL?.trim() || "gpt-4o-mini";

export const AI_MAX_INPUT_CHARS = 20_000;

export function isAiConfigured(): boolean {
  return Boolean(apiKey);
}

let cached: OpenAI | null = null;
function client(): OpenAI {
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  if (!cached) cached = new OpenAI({ apiKey });
  return cached;
}

type Options = Record<string, string>;

// Each task is a system prompt. Every prompt ends by forbidding preamble and
// tags so the output is the clean result only.
const TASKS: Record<string, (o: Options) => string> = {
  summarize: (o) =>
    `You summarize text accurately. Produce a ${o.length ?? "medium"}-length ${
      o.format === "bullets" ? "bulleted list of the key points" : "summary"
    } of the user's text. Output only the summary — no preamble, notes, or XML tags.`,
  paraphrase: (o) =>
    `You rewrite text in a ${o.tone ?? "clear, professional"} tone while preserving the original meaning and key details. Output only the rewritten text — no preamble, quotes, notes, or XML tags.`,
  translate: (o) =>
    `You are an expert translator. Translate the user's text into ${
      o.language ?? "English"
    }, preserving meaning, tone, and formatting. Output only the translation — no preamble, notes, transliteration, or XML tags.`,
  grammar: () =>
    `You are a meticulous proofreader. Correct spelling, grammar, and punctuation in the user's text while preserving its meaning and tone. Output only the corrected text — no preamble, explanations, lists of changes, or XML tags.`,
};

export type AiResult =
  | { ok: true; result: string }
  | { ok: false; status: number; error: string };

export async function runAiTask(task: string, text: string, options: Options): Promise<AiResult> {
  if (!apiKey) return { ok: false, status: 503, error: "AI tools aren't configured yet." };

  const build = TASKS[task];
  if (!build) return { ok: false, status: 400, error: "Unsupported AI task." };

  const trimmed = text.trim();
  if (!trimmed) return { ok: false, status: 400, error: "Enter some text first." };
  if (trimmed.length > AI_MAX_INPUT_CHARS) {
    return {
      ok: false,
      status: 413,
      error: `Text is too long (max ${AI_MAX_INPUT_CHARS.toLocaleString()} characters).`,
    };
  }

  try {
    const completion = await client().chat.completions.create({
      model: AI_MODEL,
      max_tokens: 8192,
      temperature: 0.3, // low — these are faithful transforms, not creative writing
      messages: [
        { role: "system", content: build(options) },
        { role: "user", content: trimmed },
      ],
    });

    const choice = completion.choices[0];
    // Newer models expose an explicit refusal string when they decline.
    if (choice?.message?.refusal) {
      return { ok: false, status: 422, error: "That request was declined. Try different text." };
    }

    const out = (choice?.message?.content ?? "").trim();
    if (!out) return { ok: false, status: 502, error: "No result was produced. Please try again." };
    return { ok: true, result: out };
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return { ok: false, status: err.status ?? 500, error: err.message || "AI service error. Please try again." };
  }
}
