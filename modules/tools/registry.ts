import {
  BracesIcon,
  BinaryIcon,
  FingerprintIcon,
  KeyRoundIcon,
  TypeIcon,
  CaseSensitiveIcon,
  FileKey2Icon,
  ClockIcon,
  LinkIcon,
  HashIcon,
  PilcrowIcon,
  PipetteIcon,
  RegexIcon,
  CalculatorIcon,
  TagIcon,
  DiffIcon,
  type LucideIcon,
} from "lucide-react";

export type ToolFaq = { q: string; a: string };

export type DevTool = {
  slug: string;
  name: string;
  tagline: string;
  description: string; // used for <meta description>
  keywords: string[];
  icon: LucideIcon;
  intro: string; // rankable page copy
  steps: string[]; // "how to use"
  faqs: ToolFaq[];
  related: string[]; // slugs
};

export const devTools: DevTool[] = [
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, validate, and minify JSON — instantly, in your browser.",
    description:
      "Free online JSON formatter and validator. Beautify, minify, and validate JSON instantly and privately in your browser.",
    keywords: ["json formatter", "json validator", "json beautifier", "json minify"],
    icon: BracesIcon,
    intro:
      "Paste messy or minified JSON and instantly get it beautifully formatted and validated — or minify it to shrink the payload. Everything runs locally in your browser, so your data never leaves your device.",
    steps: [
      "Paste your JSON into the input box.",
      "Click Format to pretty-print it, or Minify to compact it.",
      "Copy the result — invalid JSON is flagged with the exact error.",
    ],
    faqs: [
      { q: "Is my JSON uploaded anywhere?", a: "No. Formatting and validation happen entirely in your browser — nothing is sent to a server." },
      { q: "What does minify do?", a: "Minifying removes all whitespace and line breaks to produce the smallest valid JSON, useful for reducing payload size." },
      { q: "Why is my JSON invalid?", a: "The tool shows the parser's exact error, commonly caused by trailing commas, single quotes, or unquoted keys." },
    ],
    related: ["base64", "jwt-decoder", "url-encoder"],
  },
  {
    slug: "base64",
    name: "Base64 Encode / Decode",
    tagline: "Convert text to and from Base64 with full Unicode support.",
    description:
      "Free online Base64 encoder and decoder. Convert text to Base64 and back instantly, with full Unicode support — right in your browser.",
    keywords: ["base64 encode", "base64 decode", "base64 converter"],
    icon: BinaryIcon,
    intro:
      "Encode text to Base64 or decode Base64 back to readable text, with full Unicode (UTF-8) support. Conversion happens entirely in your browser.",
    steps: [
      "Choose Encode or Decode.",
      "Type or paste your input.",
      "Copy the converted output instantly.",
    ],
    faqs: [
      { q: "Does it support emoji and non-English text?", a: "Yes — encoding uses UTF-8, so emoji and any Unicode characters convert correctly." },
      { q: "Is Base64 encryption?", a: "No. Base64 is an encoding, not encryption — anyone can decode it, so never use it to protect secrets." },
    ],
    related: ["url-encoder", "json-formatter", "hash-generator"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    tagline: "Generate random UUID v4 identifiers, one or many at a time.",
    description:
      "Free online UUID generator. Instantly create cryptographically random version 4 UUIDs, one or many at once.",
    keywords: ["uuid generator", "guid generator", "uuid v4", "random uuid"],
    icon: FingerprintIcon,
    intro:
      "Generate cryptographically random version 4 UUIDs (also called GUIDs) one at a time or in bulk, ready to copy. Generated locally with your browser's secure random source.",
    steps: [
      "Choose how many UUIDs you need.",
      "Click Generate.",
      "Copy one, or copy them all at once.",
    ],
    faqs: [
      { q: "What kind of UUIDs are these?", a: "Version 4 UUIDs, generated with the browser's secure random source (crypto.randomUUID)." },
      { q: "Are they guaranteed unique?", a: "UUID v4 has 122 random bits, making collisions astronomically unlikely — safe to use as unique identifiers." },
    ],
    related: ["password-generator", "hash-generator", "timestamp-converter"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Create strong, random passwords with custom rules.",
    description:
      "Free online password generator. Create strong, random, secure passwords with custom length and character sets — instantly and privately in your browser.",
    keywords: ["password generator", "strong password", "random password", "secure password"],
    icon: KeyRoundIcon,
    intro:
      "Create strong, random passwords with full control over length and character sets. Passwords are generated locally using your browser's secure randomness and never leave your device.",
    steps: [
      "Set the length and toggle which character sets to include.",
      "Click Generate password.",
      "Copy it — regenerate anytime for a fresh one.",
    ],
    faqs: [
      { q: "Are these passwords safe to use?", a: "Yes — they use the Web Crypto secure random generator and are created entirely on your device, never transmitted." },
      { q: "How long should my password be?", a: "16 or more characters with a mix of upper- and lowercase letters, numbers, and symbols is recommended for strong security." },
    ],
    related: ["hash-generator", "uuid-generator", "jwt-decoder"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Count words, characters, sentences, and reading time.",
    description:
      "Free online word counter. Count words, characters, sentences, and paragraphs with reading time — live as you type.",
    keywords: ["word counter", "character counter", "count words", "character count"],
    icon: TypeIcon,
    intro:
      "Count words, characters, sentences, paragraphs, and estimated reading time as you type — perfect for essays, meta descriptions, and social media posts with length limits.",
    steps: [
      "Type or paste your text.",
      "Watch the live counts update instantly.",
      "Trim or expand to hit your target length.",
    ],
    faqs: [
      { q: "How is reading time calculated?", a: "It's based on an average adult reading speed of about 200 words per minute." },
      { q: "Does it count characters with and without spaces?", a: "Yes — both totals are shown, which is handy for character-limited fields like meta descriptions and tweets." },
    ],
    related: ["case-converter", "json-formatter", "url-encoder"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    tagline: "Convert text between UPPER, lower, Title, camelCase, and more.",
    description:
      "Free online case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.",
    keywords: ["case converter", "uppercase", "lowercase", "title case", "text case converter"],
    icon: CaseSensitiveIcon,
    intro:
      "Instantly convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case — every format is shown at once so you can copy the one you need.",
    steps: [
      "Type or paste your text.",
      "See every case format update live.",
      "Copy the one you need.",
    ],
    faqs: [
      { q: "What's the difference between camelCase and PascalCase?", a: "camelCase lowercases the first word (myVariable); PascalCase capitalizes it (MyVariable). This tool outputs camelCase." },
      { q: "Does it handle programming identifiers?", a: "Yes — snake_case and kebab-case intelligently split on spaces and camelCase boundaries." },
    ],
    related: ["word-counter", "json-formatter", "url-encoder"],
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    tagline: "Decode and inspect JSON Web Token header and payload.",
    description:
      "Free online JWT decoder. Decode and inspect a JSON Web Token's header and payload instantly and privately in your browser.",
    keywords: ["jwt decoder", "decode jwt", "json web token", "jwt parser"],
    icon: FileKey2Icon,
    intro:
      "Decode a JSON Web Token to inspect its header and payload, with issued and expiry timestamps shown in human-readable form. Decoding happens locally — your token is never sent anywhere.",
    steps: [
      "Paste your JWT.",
      "Review the decoded header and payload.",
      "Check the exp / iat timestamps in plain English.",
    ],
    faqs: [
      { q: "Does this verify the signature?", a: "No — verifying a signature requires the secret or key. This tool decodes and displays the token's contents only." },
      { q: "Is my token sent to a server?", a: "No. Decoding is done entirely in your browser, so it's safe for sensitive tokens." },
    ],
    related: ["base64", "hash-generator", "timestamp-converter"],
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    tagline: "Convert Unix epoch time to dates and back.",
    description:
      "Free online Unix timestamp converter. Convert epoch time to human-readable dates and back, in seconds or milliseconds.",
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "epoch time"],
    icon: ClockIcon,
    intro:
      "Convert Unix epoch timestamps to human-readable dates and back, in seconds or milliseconds. It auto-detects the unit and shows local, UTC, and ISO 8601 formats.",
    steps: [
      "Enter a Unix timestamp, or click Now for the current time.",
      "Read the local, UTC, and ISO 8601 results.",
      "Or pick a date and time to get its timestamp.",
    ],
    faqs: [
      { q: "Does it support milliseconds?", a: "Yes — timestamps with 12 or more digits are treated as milliseconds; shorter values are treated as seconds." },
      { q: "What is Unix epoch time?", a: "It's the number of seconds since January 1, 1970 (UTC) — a common way to store dates and times in software." },
    ],
    related: ["jwt-decoder", "uuid-generator", "json-formatter"],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    tagline: "Percent-encode and decode URLs and query parameters.",
    description:
      "Free online URL encoder and decoder. Percent-encode and decode URLs and query parameters instantly in your browser.",
    keywords: ["url encoder", "url decoder", "percent encoding", "encodeuricomponent"],
    icon: LinkIcon,
    intro:
      "Percent-encode text for safe use in URLs and query strings, or decode encoded URLs back to readable text. Full Unicode support, and it all runs in your browser.",
    steps: [
      "Choose Encode or Decode.",
      "Paste your URL or text.",
      "Copy the result.",
    ],
    faqs: [
      { q: "When do I need to URL-encode?", a: "Whenever a value contains spaces or special characters like &, ?, =, or / inside a query parameter or path segment." },
      { q: "Which encoding does this use?", a: "It uses encodeURIComponent, which encodes all reserved characters — ideal for individual query-string values." },
    ],
    related: ["base64", "json-formatter", "hash-generator"],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    tagline: "Compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
    description:
      "Free online hash generator. Compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes of any text, right in your browser.",
    keywords: ["hash generator", "sha256 generator", "sha-256", "sha512", "checksum"],
    icon: HashIcon,
    intro:
      "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes of any text using your browser's Web Crypto API. Useful for checksums, fingerprints, and integrity checks — computed locally.",
    steps: [
      "Type or paste your text.",
      "All four hashes compute instantly.",
      "Copy the digest you need.",
    ],
    faqs: [
      { q: "Is MD5 supported?", a: "No — the Web Crypto API doesn't include MD5 because it's insecure. Use SHA-256 or stronger instead." },
      { q: "Can I reverse a hash back to the text?", a: "No. Hashes are one-way functions — you can't recover the original input from a hash." },
    ],
    related: ["password-generator", "base64", "uuid-generator"],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    tagline: "Generate placeholder text — paragraphs, sentences, or words.",
    description:
      "Free Lorem Ipsum generator. Create placeholder dummy text by paragraphs, sentences, or words — and copy it instantly.",
    keywords: ["lorem ipsum generator", "dummy text", "placeholder text", "lorem ipsum"],
    icon: PilcrowIcon,
    intro:
      "Generate classic Lorem Ipsum placeholder text for mockups, layouts, and designs. Choose how many paragraphs, sentences, or words you need and copy it in one click.",
    steps: [
      "Pick an amount and a unit (paragraphs, sentences, or words).",
      "Click Generate.",
      "Copy the placeholder text.",
    ],
    faqs: [
      { q: "What is Lorem Ipsum?", a: "It's scrambled Latin-like placeholder text used since the 1500s to show layout and typography without meaningful words distracting the viewer." },
      { q: "Can it start with the classic line?", a: "Yes — the first paragraph opens with 'Lorem ipsum dolor sit amet…' by default." },
    ],
    related: ["word-counter", "case-converter", "slugify"],
  },
  {
    slug: "color-converter",
    name: "HEX to RGB Converter",
    tagline: "Convert colors between HEX, RGB, and HSL with a live preview.",
    description:
      "Free online color converter. Convert between HEX, RGB, and HSL color formats with a live preview — HEX to RGB and back.",
    keywords: ["hex to rgb", "rgb to hex", "color converter", "hsl converter"],
    icon: PipetteIcon,
    intro:
      "Convert colors between HEX, RGB, and HSL and see a live preview. Type a color in any format, or pick one, and get the others instantly.",
    steps: [
      "Enter a color in HEX, RGB, or HSL — or use the picker.",
      "See the converted values and a preview swatch.",
      "Copy the format you need.",
    ],
    faqs: [
      { q: "Which formats are supported?", a: "HEX (#rrggbb or #rgb), RGB (rgb(r, g, b)), and HSL (hsl(h, s%, l%))." },
      { q: "Is my color HEX 3- or 6-digit?", a: "Both work — 3-digit shorthand like #0af is expanded automatically to #00aaff." },
    ],
    related: ["hash-generator", "base64", "slugify"],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    tagline: "Test regular expressions against sample text with live matches.",
    description:
      "Free online regex tester. Test JavaScript regular expressions against sample text and see matches and capture groups live.",
    keywords: ["regex tester", "regular expression tester", "regex online", "test regex"],
    icon: RegexIcon,
    intro:
      "Test JavaScript regular expressions against your sample text and see every match and capture group in real time. Toggle flags like global, case-insensitive, and multiline.",
    steps: [
      "Enter your regular expression and choose flags.",
      "Paste the text to test against.",
      "See matches highlighted with capture groups listed.",
    ],
    faqs: [
      { q: "Which regex flavor is this?", a: "JavaScript (ECMAScript) regular expressions — the same engine used in browsers and Node.js." },
      { q: "What do the flags mean?", a: "g = global (all matches), i = case-insensitive, m = multiline, s = dotall, u = unicode, y = sticky." },
    ],
    related: ["json-formatter", "case-converter", "url-encoder"],
  },
  {
    slug: "number-base-converter",
    name: "Number Base Converter",
    tagline: "Convert numbers between binary, octal, decimal, and hex.",
    description:
      "Free online number base converter. Convert integers between binary, octal, decimal, and hexadecimal instantly.",
    keywords: ["number base converter", "binary to decimal", "decimal to hex", "hex to binary"],
    icon: CalculatorIcon,
    intro:
      "Convert whole numbers between binary, octal, decimal, and hexadecimal. Enter a value in any base and get the equivalents in the others instantly.",
    steps: [
      "Enter a number and choose its base.",
      "Read the equivalent in binary, octal, decimal, and hex.",
      "Copy the value you need.",
    ],
    faqs: [
      { q: "Does it handle large numbers?", a: "It supports standard safe integers; values beyond JavaScript's safe integer range may lose precision." },
      { q: "Can I convert negatives or decimals?", a: "Enter positive whole numbers for reliable conversion — negatives and fractions aren't supported." },
    ],
    related: ["hash-generator", "base64", "timestamp-converter"],
  },
  {
    slug: "slugify",
    name: "Slug Generator",
    tagline: "Turn any text into a clean, URL-friendly slug.",
    description:
      "Free online slug generator. Convert titles and text into clean, URL-friendly, SEO-safe slugs instantly.",
    keywords: ["slug generator", "slugify", "url slug", "seo slug"],
    icon: TagIcon,
    intro:
      "Turn any title or text into a clean, lowercase, URL-friendly slug — spaces become hyphens, accents are stripped, and special characters are removed.",
    steps: [
      "Type or paste your text.",
      "The URL slug updates live.",
      "Copy it for your page or post URL.",
    ],
    faqs: [
      { q: "What is a slug?", a: "A slug is the URL-friendly part of a web address — usually lowercase words separated by hyphens, e.g. my-blog-post." },
      { q: "Does it handle accented characters?", a: "Yes — accents are converted to their base letters (é → e) so the slug stays clean ASCII." },
    ],
    related: ["case-converter", "url-encoder", "word-counter"],
  },
  {
    slug: "text-diff",
    name: "Text Diff Checker",
    tagline: "Compare two texts and highlight the differences line by line.",
    description:
      "Free online text diff checker. Compare two blocks of text and see added and removed lines highlighted side by side.",
    keywords: ["text diff", "diff checker", "compare text", "text comparison"],
    icon: DiffIcon,
    intro:
      "Compare two blocks of text and instantly see what changed — added and removed lines are highlighted. Everything runs in your browser, so your text stays private.",
    steps: [
      "Paste the original text on the left.",
      "Paste the changed text on the right.",
      "Review the highlighted line-by-line differences.",
    ],
    faqs: [
      { q: "Does it compare line by line or word by word?", a: "Line by line — each line is marked as unchanged, added, or removed." },
      { q: "Is my text private?", a: "Yes — the comparison runs entirely in your browser and nothing is uploaded." },
    ],
    related: ["json-formatter", "word-counter", "case-converter"],
  },
];

export function getTool(slug: string) {
  return devTools.find((t) => t.slug === slug);
}

// Grouping for the hub — improves navigation and topical SEO structure.
export const toolCategories: { name: string; blurb: string; slugs: string[] }[] = [
  {
    name: "Developer",
    blurb: "Format, inspect, and test.",
    slugs: ["json-formatter", "jwt-decoder", "regex-tester"],
  },
  {
    name: "Converters",
    blurb: "Transform between formats.",
    slugs: [
      "base64",
      "url-encoder",
      "number-base-converter",
      "color-converter",
      "timestamp-converter",
    ],
  },
  {
    name: "Text",
    blurb: "Work with words and strings.",
    slugs: ["word-counter", "case-converter", "slugify", "text-diff", "lorem-ipsum"],
  },
  {
    name: "Generators",
    blurb: "Create secure, random values.",
    slugs: ["password-generator", "uuid-generator", "hash-generator"],
  },
];
