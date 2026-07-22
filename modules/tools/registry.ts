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
  QrCodeIcon,
  CodeXmlIcon,
  FileSpreadsheetIcon,
  ImageIcon,
  ArrowDownUpIcon,
  CalendarClockIcon,
  FolderKeyIcon,
  CodeIcon,
  DicesIcon,
  FileCode2Icon,
  MegaphoneIcon,
  TagsIcon,
  WifiIcon,
  QuoteIcon,
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
  {
    slug: "qr-code",
    name: "QR Code Generator",
    tagline: "Create and download a QR code for any link or text.",
    description:
      "Free online QR code generator. Create and download a QR code for any URL or text — customize colors and size, instantly.",
    keywords: ["qr code generator", "create qr code", "qr code maker", "free qr code"],
    icon: QrCodeIcon,
    intro:
      "Create a QR code for any link, text, or message and download it as a PNG. Customize the colors and size — and sign up free to add a logo, make it editable (dynamic), track scans, and save your codes.",
    steps: [
      "Enter a URL or any text.",
      "Adjust the colors and size.",
      "Download your QR code as a PNG.",
    ],
    faqs: [
      { q: "Is this QR code free to use?", a: "Yes — the PNG is free for personal and commercial use, and static QR codes never expire." },
      { q: "Can I change where it points after printing?", a: "Yes, with a dynamic QR code — free on an OhoTool account, along with scan analytics and logo branding." },
    ],
    related: ["url-encoder", "color-converter", "hash-generator"],
  },
  {
    slug: "html-entities",
    name: "HTML Entity Encoder / Decoder",
    tagline: "Encode and decode HTML entities safely.",
    description:
      "Free online HTML entity encoder and decoder. Convert special characters to HTML entities and back, instantly in your browser.",
    keywords: ["html entity encoder", "html entity decoder", "html escape", "encode html"],
    icon: CodeXmlIcon,
    intro:
      "Encode special characters like <, >, &, and quotes into safe HTML entities, or decode entities back to plain text. Everything runs in your browser.",
    steps: [
      "Choose Encode or Decode.",
      "Paste your text or HTML.",
      "Copy the result.",
    ],
    faqs: [
      { q: "When should I encode HTML entities?", a: "Encode user-provided text before inserting it into HTML so it's shown as text and not interpreted as markup — a common XSS safeguard." },
      { q: "Does decoding run any scripts?", a: "No — decoding is handled safely and never executes markup or scripts." },
    ],
    related: ["url-encoder", "base64", "json-formatter"],
  },
  {
    slug: "json-to-csv",
    name: "JSON to CSV Converter",
    tagline: "Convert JSON arrays to CSV and back.",
    description:
      "Free online JSON to CSV converter. Convert a JSON array of objects to CSV, or CSV back to JSON — instantly in your browser.",
    keywords: ["json to csv", "csv to json", "json csv converter", "convert json to csv"],
    icon: FileSpreadsheetIcon,
    intro:
      "Convert a JSON array of objects into CSV, or turn CSV back into JSON. Handy for spreadsheets, data imports, and quick inspections — all in your browser.",
    steps: [
      "Choose JSON → CSV or CSV → JSON.",
      "Paste your data.",
      "Copy the converted output.",
    ],
    faqs: [
      { q: "What JSON shape is supported?", a: 'An array of flat objects, e.g. [{"name":"A","age":1}]. Column headers come from the object keys.' },
      { q: "How are commas and quotes handled?", a: "Values containing commas, quotes, or newlines are automatically quoted and escaped following RFC 4180." },
    ],
    related: ["json-formatter", "base64", "case-converter"],
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    tagline: "Encode an image as a Base64 data URI.",
    description:
      "Free online image to Base64 converter. Encode PNG, JPG, SVG, and more as a Base64 data URI to embed in HTML or CSS.",
    keywords: ["image to base64", "base64 image", "image data uri", "encode image base64"],
    icon: ImageIcon,
    intro:
      "Turn an image into a Base64 data URI you can paste directly into HTML, CSS, or JSON — no hosting needed. Files are read entirely in your browser and never uploaded.",
    steps: [
      "Choose an image file.",
      "Copy the data URI, or just the raw Base64.",
      "Paste it into your img src, CSS background, or code.",
    ],
    faqs: [
      { q: "Are my images uploaded?", a: "No — the file is read locally in your browser and converted on your device." },
      { q: "When should I inline images as Base64?", a: "For small icons and assets it avoids an extra request; for large images a normal URL is usually better." },
    ],
    related: ["base64", "qr-code", "hash-generator"],
  },
  {
    slug: "line-sorter",
    name: "Line Sorter & Deduplicator",
    tagline: "Sort, deduplicate, reverse, and trim lines of text.",
    description:
      "Free online line sorter and duplicate remover. Sort lines alphabetically, remove duplicates, reverse, and trim — instantly.",
    keywords: ["sort lines", "remove duplicate lines", "line sorter", "deduplicate text"],
    icon: ArrowDownUpIcon,
    intro:
      "Sort lines alphabetically, remove duplicate lines, reverse the order, and trim whitespace — a fast multi-tool for cleaning up lists of text.",
    steps: [
      "Paste your lines of text.",
      "Toggle the operations you want (sort, dedupe, reverse, trim).",
      "Copy the cleaned-up result.",
    ],
    faqs: [
      { q: "Is sorting case-sensitive?", a: "You can choose — toggle case-insensitive sorting for natural A–Z ordering regardless of case." },
      { q: "Which duplicate is kept?", a: "Deduplication keeps the first occurrence of each line and removes later repeats." },
    ],
    related: ["word-counter", "case-converter", "text-diff"],
  },
  {
    slug: "cron-explainer",
    name: "Cron Expression Explainer",
    tagline: "Translate a cron expression into plain English.",
    description:
      "Free online cron expression explainer. Understand what a crontab schedule means in plain English, with the next run times.",
    keywords: ["cron expression", "crontab", "cron explainer", "cron schedule"],
    icon: CalendarClockIcon,
    intro:
      "Paste a cron expression and get a plain-English breakdown of when it runs, plus the next few scheduled times. Supports standard 5-field crontab syntax.",
    steps: [
      "Enter a 5-field cron expression (e.g. */5 * * * *).",
      "Read the field-by-field schedule.",
      "Check the upcoming run times.",
    ],
    faqs: [
      { q: "Which cron format is supported?", a: "Standard 5-field crontab: minute, hour, day-of-month, month, day-of-week. Steps (*/5), ranges (1-5), and lists (1,3,5) are supported." },
      { q: "What timezone are the next runs in?", a: "Next run times are computed in your browser's local timezone." },
    ],
    related: ["timestamp-converter", "regex-tester", "number-base-converter"],
  },
  {
    slug: "chmod-calculator",
    name: "Chmod Calculator",
    tagline: "Convert file permissions between octal and symbolic.",
    description:
      "Free online chmod calculator. Convert Unix/Linux file permissions between numeric (755) and symbolic (rwxr-xr-x) with checkboxes.",
    keywords: ["chmod calculator", "file permissions", "chmod 755", "unix permissions"],
    icon: FolderKeyIcon,
    intro:
      "Toggle read, write, and execute for owner, group, and others to get the numeric (e.g. 755) and symbolic (rwxr-xr-x) chmod values — or type a number to see the permissions.",
    steps: [
      "Check the permissions you want, or type an octal value.",
      "Read the octal and symbolic results.",
      "Copy the ready-to-run chmod command.",
    ],
    faqs: [
      { q: "What does chmod 755 mean?", a: "Owner can read/write/execute (7); group and others can read and execute (5). It's common for scripts and directories." },
      { q: "Numeric vs symbolic?", a: "Numeric uses digits 0–7 per role; symbolic uses letters like rwxr-xr-x. They represent the same permissions." },
    ],
    related: ["number-base-converter", "hash-generator", "cron-explainer"],
  },
  {
    slug: "text-to-binary",
    name: "Text to Binary",
    tagline: "Convert text to binary and back.",
    description:
      "Free online text to binary converter. Convert text to binary and binary back to text using UTF-8, instantly in your browser.",
    keywords: ["text to binary", "binary to text", "binary translator", "ascii to binary"],
    icon: CodeIcon,
    intro:
      "Convert text into its binary representation (and back), using UTF-8 byte values shown as 8-bit groups. Handy for learning, puzzles, and low-level debugging.",
    steps: [
      "Choose Text → Binary or Binary → Text.",
      "Type or paste your input.",
      "Copy the result.",
    ],
    faqs: [
      { q: "What encoding is used?", a: "UTF-8 — each character maps to one or more bytes, shown as 8-bit binary groups separated by spaces." },
      { q: "Can it decode binary back to text?", a: "Yes — paste space-separated 8-bit binary groups and switch to Binary → Text." },
    ],
    related: ["base64", "number-base-converter", "hash-generator"],
  },
  {
    slug: "random-string",
    name: "Random String Generator",
    tagline: "Generate random strings, tokens, and test data.",
    description:
      "Free online random string generator. Create random strings and tokens with custom length and character sets, using secure randomness.",
    keywords: ["random string generator", "random token", "generate random string", "random text"],
    icon: DicesIcon,
    intro:
      "Generate random strings for tokens, test data, and identifiers, with control over length and character sets. Uses your browser's secure random generator.",
    steps: [
      "Set the length and character sets.",
      "Choose how many to generate.",
      "Copy the results.",
    ],
    faqs: [
      { q: "Is the randomness secure?", a: "Yes — it uses the Web Crypto secure random generator, suitable for tokens and secrets." },
      { q: "How is this different from the password generator?", a: "It's tuned for generating many identifiers or tokens at once with flexible alphabets, rather than one memorable password." },
    ],
    related: ["password-generator", "uuid-generator", "hash-generator"],
  },
  {
    slug: "json-to-typescript",
    name: "JSON to TypeScript",
    tagline: "Generate TypeScript types from JSON.",
    description:
      "Free online JSON to TypeScript converter. Generate TypeScript interfaces and types from a JSON sample, instantly in your browser.",
    keywords: ["json to typescript", "json to interface", "typescript types from json", "json to ts"],
    icon: FileCode2Icon,
    intro:
      "Paste a JSON sample and get TypeScript types inferred from its structure — nested objects and arrays included. Great for quickly typing API responses.",
    steps: [
      "Paste a JSON object or array.",
      "Copy the generated TypeScript.",
      "Rename Root to fit your codebase.",
    ],
    faqs: [
      { q: "How are arrays typed?", a: "Array element types are inferred from the first item; empty arrays become unknown[]." },
      { q: "Are nested objects named?", a: "Nested objects are inlined as structural types for simplicity — extract them into named interfaces as you like." },
    ],
    related: ["json-formatter", "json-to-csv", "jwt-decoder"],
  },
  {
    slug: "utm-builder",
    name: "UTM Link Builder",
    tagline: "Build trackable campaign URLs with UTM parameters.",
    description:
      "Free UTM link builder. Add utm_source, utm_medium, utm_campaign and more to build trackable campaign URLs for your analytics.",
    keywords: ["utm builder", "utm link builder", "campaign url builder", "utm generator"],
    icon: MegaphoneIcon,
    intro:
      "Add UTM parameters to any URL so you can track marketing campaigns in your analytics. Fill in the source, medium, and campaign, then copy the ready-to-share link.",
    steps: [
      "Enter your website URL.",
      "Fill in the UTM fields (source, medium, campaign).",
      "Copy your trackable link.",
    ],
    faqs: [
      { q: "What are UTM parameters?", a: "Tags added to a URL (utm_source, utm_medium, utm_campaign, utm_term, utm_content) that let analytics tools attribute visits to specific campaigns." },
      { q: "Which fields are required?", a: "Source, medium, and campaign are the standard trio; term and content are optional." },
    ],
    related: ["url-encoder", "qr-code", "slugify"],
  },
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    tagline: "Generate SEO and social meta tags for your page.",
    description:
      "Free meta tag generator. Create SEO title, description, Open Graph, and Twitter Card meta tags to paste into your site's head.",
    keywords: ["meta tag generator", "open graph generator", "seo meta tags", "og tags"],
    icon: TagsIcon,
    intro:
      "Generate SEO and social-sharing meta tags — title, description, canonical, Open Graph, and Twitter Card — ready to paste into your page's <head>.",
    steps: [
      "Fill in your title, description, URL, and image.",
      "Copy the generated meta tags.",
      "Paste them into your HTML <head>.",
    ],
    faqs: [
      { q: "What are Open Graph tags?", a: "og: tags control how your page looks when shared on platforms like Facebook, LinkedIn, and Slack." },
      { q: "How long should title and description be?", a: "Aim for about 60 characters for the title and 155 for the description so they aren't truncated in search results." },
    ],
    related: ["slugify", "url-encoder", "html-entities"],
  },
  {
    slug: "wifi-qr",
    name: "WiFi QR Code Generator",
    tagline: "Create a QR code that connects guests to your WiFi.",
    description:
      "Free WiFi QR code generator. Create a QR code guests can scan to join your WiFi network instantly — no typing passwords.",
    keywords: ["wifi qr code", "wifi qr code generator", "qr code wifi", "scan to connect wifi"],
    icon: WifiIcon,
    intro:
      "Create a QR code that lets guests join your WiFi by scanning — no more reading out passwords. It's generated entirely in your browser.",
    steps: [
      "Enter your network name (SSID) and password.",
      "Pick the security type.",
      "Download the QR and print it for guests.",
    ],
    faqs: [
      { q: "Is my WiFi password uploaded?", a: "No — the QR is generated entirely in your browser and nothing is sent anywhere." },
      { q: "Which devices can scan it?", a: "Modern iOS and Android cameras support WiFi QR codes natively from the camera app." },
    ],
    related: ["qr-code", "password-generator", "url-encoder"],
  },
  {
    slug: "string-escape",
    name: "String Escape / Unescape",
    tagline: "Escape and unescape strings for code and JSON.",
    description:
      "Free online string escape tool. Escape special characters for JSON and JavaScript strings and unescape them back, instantly.",
    keywords: ["string escape", "json escape", "escape string", "unescape string"],
    icon: QuoteIcon,
    intro:
      "Escape a string so it's safe to paste inside JSON or JavaScript source — quotes, backslashes, tabs, and newlines — or unescape it back to plain text.",
    steps: [
      "Choose Escape or Unescape.",
      "Paste your text.",
      "Copy the result.",
    ],
    faqs: [
      { q: "What gets escaped?", a: "Double quotes, backslashes, tabs, and newlines are escaped using JSON string rules." },
      { q: "Is this the same as HTML escaping?", a: "No — this is for code and JSON strings. For HTML, use the HTML entity encoder." },
    ],
    related: ["html-entities", "json-formatter", "base64"],
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
    slugs: [
      "json-formatter",
      "json-to-typescript",
      "jwt-decoder",
      "regex-tester",
      "cron-explainer",
      "chmod-calculator",
    ],
  },
  {
    name: "Web & SEO",
    blurb: "Ship and market your site.",
    slugs: ["utm-builder", "meta-tag-generator"],
  },
  {
    name: "Converters",
    blurb: "Transform between formats.",
    slugs: [
      "base64",
      "url-encoder",
      "html-entities",
      "string-escape",
      "json-to-csv",
      "image-to-base64",
      "text-to-binary",
      "number-base-converter",
      "color-converter",
      "timestamp-converter",
    ],
  },
  {
    name: "Text",
    blurb: "Work with words and strings.",
    slugs: [
      "word-counter",
      "case-converter",
      "slugify",
      "line-sorter",
      "text-diff",
      "lorem-ipsum",
    ],
  },
  {
    name: "Generators",
    blurb: "Create secure, random values.",
    slugs: [
      "qr-code",
      "wifi-qr",
      "password-generator",
      "random-string",
      "uuid-generator",
      "hash-generator",
    ],
  },
];
