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
  "business-name": (o) =>
    `You are a branding expert. Generate creative, brandable business name ideas for the business the user describes, in a ${o.style ?? "modern"} style. Provide 12 options as a numbered list — short, easy to say and spell, and not the names of well-known existing brands. Output only the numbered list — no preamble, notes, or XML tags.`,
  slogan: (o) =>
    `You are a copywriter. Write catchy slogans/taglines for the business or product the user describes, in a ${o.tone ?? "catchy"} style. Provide 12 short, memorable options as a numbered list. Output only the numbered list — no preamble, notes, or XML tags.`,
  "cover-letter": (o) =>
    `You write strong job-application cover letters. Using the role and background the user provides, write a ${o.tone ?? "professional"} cover letter: a greeting, an engaging opening, one or two body paragraphs matching the person's experience to the role, and a closing with a call to action and sign-off. Do not invent specific facts, employers, or achievements the user didn't provide. Output only the cover letter — no preamble, notes, or XML tags.`,
  "resume-summary": (o) =>
    `You are a professional resume writer. Write a concise, compelling resume summary for a ${o.level ?? "mid-level"} candidate based on the role, experience, and skills the user provides. Two to four sentences, results-oriented, no first-person pronouns. Do not invent facts. Output only the summary — no preamble, notes, or XML tags.`,
  bio: (o) =>
    `You write short, engaging personal bios for ${o.platform ?? "Instagram"} based on what the user tells you about themselves. Provide 3 options as a numbered list, each fitting the platform's style and typical length, with tasteful emoji only where they suit the platform. Output only the numbered list — no preamble, notes, or XML tags.`,
  hashtag: (o) =>
    `You are a social media expert. Generate ${o.count ?? "20"} relevant, effective hashtags for the topic or post the user describes, mixing popular and niche tags. Output only the hashtags separated by spaces, each starting with "#" — no preamble, notes, numbering, or XML tags.`,
  headline: (o) =>
    `You are a headline copywriter. Write attention-grabbing ${o.type ?? "blog post"} headlines for the topic the user provides. Provide 10 options as a numbered list — varied angles, clear and compelling, without exaggerated clickbait. Output only the numbered list — no preamble, notes, or XML tags.`,
  faq: () =>
    `You write helpful FAQs. Generate a frequently-asked-questions list for the topic, product, or page content the user provides — 5 to 7 question-and-answer pairs. Put each question on its own line followed by its answer on the next line, with a blank line between pairs. Do not invent specific facts (prices, policies, dates) the user didn't provide. Output only the FAQ — no preamble, notes, or XML tags.`,
  simplify: (o) =>
    `You make text easy to understand. Rewrite the user's text as ${o.level ?? "plain English"} while keeping the key meaning, using short sentences and everyday words and avoiding jargon. Output only the simplified text — no preamble, notes, or XML tags.`,
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
