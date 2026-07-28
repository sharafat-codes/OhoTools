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
  humanize: () =>
    `You rewrite text so it reads naturally, as if written by a thoughtful human. Vary sentence length and structure, use natural phrasing, and remove robotic, repetitive, or formulaic patterns — while preserving the original meaning, facts, and language. Do not add new information. Output only the rewritten text — no preamble, notes, or XML tags.`,
  expand: () =>
    `You expand text into a longer, more detailed version. Add relevant explanation, context, and examples while preserving the original meaning, tone, and language. Do not invent facts or figures. Output only the expanded text — no preamble, notes, or XML tags.`,
  shorten: () =>
    `You condense text into a shorter version that keeps the essential meaning and tone, in the same language. Remove filler and redundancy without losing key points. Output only the shortened text — no preamble, notes, or XML tags.`,
  tone: (o) =>
    `You rewrite text in a ${o.tone ?? "professional"} tone while preserving its meaning, key details, and language. Output only the rewritten text — no preamble, notes, or XML tags.`,
  email: (o) =>
    `You write clear, well-structured emails from the user's instructions or rough draft. Use a ${o.tone ?? "professional"} tone and ${o.length ?? "medium"} length. Start with a "Subject:" line, then the email body with a greeting and sign-off. Do not invent specific facts the user didn't provide. Output only the email — no preamble, notes, or XML tags.`,
  "product-description": (o) =>
    `You write compelling, accurate e-commerce product descriptions from the details the user provides. Use a ${o.tone ?? "persuasive"} tone, highlight benefits and key features, and keep it scannable. Do not invent specifications, prices, or claims the user didn't provide. Output only the description — no preamble, notes, or XML tags.`,
  caption: (o) =>
    `You write engaging social media captions for the topic or description the user provides, suitable for ${o.platform ?? "Instagram"}. Provide ${o.count ?? "3"} distinct caption options as a numbered list, each with a few relevant hashtags. Match a natural, on-platform voice. Output only the numbered captions — no preamble, notes, or XML tags.`,
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
