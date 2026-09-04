import "server-only";

import OpenAI from "openai";

// AI text tools (summarize / paraphrase / translate / grammar), powered by OpenAI.
// Pro-gated because each call has an API cost.

const apiKey = process.env.OPENAI_API_KEY?.trim();

// Default to GPT-5.6 Luna — the cheapest of the GPT-5.6 family, a big quality
// jump over gpt-4o-mini at a similar price. Override with AI_MODEL (e.g.
// gpt-5.6-terra for higher quality, or gpt-4o-mini to revert).
const AI_MODEL = process.env.AI_MODEL?.trim() || "gpt-5.6-luna";

// GPT-5 / o-series are reasoning models: they require max_completion_tokens,
// reject a custom temperature, and take a reasoning_effort instead.
const isReasoningModel = /^(gpt-5|o\d)/i.test(AI_MODEL);

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
  "meme-caption": (o) =>
    `You are a witty meme writer. Given the user's topic or situation, write ${o.count ?? "5"} funny meme captions in the classic two-part format: a short top line that sets up and a short bottom line that pays off. Keep each line punchy (a few words). Output ONLY the options, one per line, formatted exactly as: TOP TEXT || BOTTOM TEXT — no numbering, preamble, quotes, notes, or XML tags.`,
  "regex-generator": (o) =>
    `You are a regular-expression expert. From the user's plain-English description, write a correct ${
      o.flavor ?? "JavaScript"
    } regular expression. Output the regex pattern on the first line (no surrounding delimiters or flags unless a flag is essential), then a blank line, then a brief explanation of each part, then a final line starting with "Example:" showing a string it matches. No other preamble, notes, or XML tags.`,
  "sql-generator": (o) =>
    `You are an expert SQL developer. From the user's request — and any table schema they include — write a correct, readable ${
      o.dialect ?? "PostgreSQL"
    } SQL query using standard syntax for that dialect. Output only the SQL query, properly formatted and indented — no preamble, explanation, surrounding code fences, or XML tags.`,
  "commit-message": (o) =>
    `You write clear git commit messages. From the user's diff or description of changes, write ${
      o.style === "plain"
        ? "a concise commit message: a short imperative subject line, then an optional body explaining what changed and why"
        : "a Conventional Commits message: a 'type(scope): summary' subject line in the imperative mood (types: feat, fix, docs, refactor, perf, test, chore, build, ci), then an optional body explaining what changed and why"
    }. Keep the subject under 72 characters. Do not invent changes the user didn't mention. Output only the commit message — no preamble, surrounding backticks, notes, or XML tags.`,
  "explain-code": (o) =>
    `You are a senior engineer who explains code clearly. Explain what the user's code does${
      o.level === "simple" ? " in simple, beginner-friendly terms" : " clearly and thoroughly"
    }: its overall purpose, then the key steps or logic, and any notable behavior, edge cases, or bugs you notice. Use short paragraphs or a numbered list. Output only the explanation — do not restate the entire code or add XML tags.`,
  "cron-generator": () =>
    `You are a cron-schedule expert. Convert the user's plain-English schedule into a standard 5-field cron expression (minute hour day-of-month month day-of-week). Output the cron expression on the first line, then a blank line, then a one-line plain-English confirmation of when it runs, and a short note if the schedule cannot be expressed exactly in cron. No other preamble, notes, or XML tags.`,
  "excel-formula": (o) =>
    `You are a spreadsheet expert. From the user's plain-English description, write a correct ${
      o.app ?? "Excel"
    } formula. Output the formula on the first line (starting with =), then a blank line, then a brief explanation of how it works, and a final line starting with "Example:" showing sample usage. No other preamble, notes, code fences, or XML tags.`,
  "blog-post": (o) =>
    `You are a professional blog writer. Write a well-structured ${
      o.length ?? "medium"
    }-length blog post on the topic the user provides, in a ${
      o.tone ?? "informative"
    } tone. Include a compelling title, an engaging introduction, clear subheadings, and a short conclusion. Use Markdown for structure. Do not invent specific statistics, quotes, or facts the user didn't provide. Output only the blog post — no preamble, notes, or XML tags.`,
  "linkedin-post": (o) =>
    `You are a LinkedIn content expert. Write an engaging LinkedIn post on the topic the user provides, in a ${
      o.tone ?? "professional"
    } tone. Open with a strong one-line hook, use short scannable paragraphs, and end with a question or call to action, followed by a few relevant hashtags. Do not invent specific facts the user didn't provide. Output only the post — no preamble, notes, or XML tags.`,
  story: (o) =>
    `You are a creative fiction writer. Write a ${o.length ?? "short"} ${
      o.genre ?? "general"
    } story based on the user's prompt or premise. Give it a clear beginning, middle, and end, with vivid detail and natural dialogue where it fits. Keep it appropriate for a general audience. Output only the story — no preamble, notes, or XML tags.`,
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
    const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: AI_MODEL,
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: build(options) },
        { role: "user", content: trimmed },
      ],
    };
    // Reasoning models take reasoning_effort — set to "none" (no reasoning)
    // because these are fast, faithful text transforms: lowest latency and cost.
    // GPT-5.6 accepts none/low/medium/high/xhigh (not "minimal"). Cast because
    // some SDK type versions lag behind the API's accepted values.
    if (isReasoningModel) (params as { reasoning_effort?: string }).reasoning_effort = "none";
    else params.temperature = 0.3;

    const completion = await client().chat.completions.create(params);

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

// Chat-with-PDF: answer a question grounded in a document's extracted text.
// The document text is extracted client-side and sent here as context. Capped
// to keep cost/latency in check (MVP truncates long docs rather than doing RAG).
const DOC_MAX_CHARS = 60_000;

export async function answerFromDocument(opts: {
  doc: string;
  question: string;
  history?: { role: "user" | "assistant"; content: string }[];
}): Promise<AiResult & { truncated?: boolean }> {
  if (!apiKey) return { ok: false, status: 503, error: "AI tools aren't configured yet." };

  const full = opts.doc.trim();
  const doc = full.slice(0, DOC_MAX_CHARS);
  const question = opts.question.trim();
  if (!doc) return { ok: false, status: 400, error: "No document text was provided." };
  if (!question) return { ok: false, status: 400, error: "Enter a question first." };

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "You answer questions about a document the user provides. Use ONLY the document's content. If the answer isn't in the document, say you couldn't find it in the document. Be concise and reference the relevant part when useful. No preamble or XML tags.",
    },
    { role: "user", content: `Document:\n"""\n${doc}\n"""` },
    { role: "assistant", content: "I've read the document. What would you like to know?" },
    ...(opts.history ?? []).slice(-6),
    { role: "user", content: question },
  ];

  try {
    const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: AI_MODEL,
      max_completion_tokens: 2048,
      messages,
    };
    if (isReasoningModel) (params as { reasoning_effort?: string }).reasoning_effort = "none";
    else params.temperature = 0.2;

    const completion = await client().chat.completions.create(params);
    const choice = completion.choices[0];
    if (choice?.message?.refusal) {
      return { ok: false, status: 422, error: "That request was declined. Try a different question." };
    }
    const out = (choice?.message?.content ?? "").trim();
    if (!out) return { ok: false, status: 502, error: "No answer was produced. Please try again." };
    return { ok: true, result: out, truncated: full.length > DOC_MAX_CHARS };
  } catch (e) {
    const err = e as { status?: number; message?: string };
    return { ok: false, status: err.status ?? 500, error: err.message || "AI service error. Please try again." };
  }
}
