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
  PercentIcon,
  CakeIcon,
  CalendarDaysIcon,
  ScaleIcon,
  LandmarkIcon,
  RulerIcon,
  PaintBucketIcon,
  BoxIcon,
  ReplaceIcon,
  WrapTextIcon,
  RepeatIcon,
  BarChart3Icon,
  ReceiptIcon,
  BadgePercentIcon,
  NetworkIcon,
  ScrollIcon,
  GlobeIcon,
  ArrowLeftRightIcon,
  CoinsIcon,
  RatioIcon,
  CreditCardIcon,
  PaletteIcon,
  AppWindowIcon,
  ImagesIcon,
  FilesIcon,
  FileStackIcon,
  ScissorsIcon,
  FileImageIcon,
  ImageDownIcon,
  RotateCwIcon,
  FileMinusIcon,
  StampIcon,
  ListOrderedIcon,
  ShrinkIcon,
  FileArchiveIcon,
  DatabaseIcon,
  FileCodeIcon,
  WandSparklesIcon,
  SignatureIcon,
  FileTypeIcon,
  FileTextIcon,
  FileOutputIcon,
  FileInputIcon,
  FileType2Icon,
  PresentationIcon,
  SheetIcon,
  CameraIcon,
  ScanTextIcon,
  Globe2Icon,
  ScalingIcon,
  ShieldCheckIcon,
  Dice5Icon,
  RemoveFormattingIcon,
  FlameIcon,
  GraduationCapIcon,
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
  pro?: boolean; // premium tool — usable free with limits, full with Pro
  serverSide?: boolean; // processed on the server (not in-browser) — e.g. Office conversion
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
  {
    slug: "unit-converter",
    name: "Unit Converter",
    tagline: "Convert length, weight, temperature, volume, and more.",
    description:
      "Free online unit converter. Convert length, mass, temperature, volume, area, speed, data, and time between metric and imperial units instantly.",
    keywords: ["unit converter", "measurement converter", "metric to imperial", "convert units"],
    icon: RulerIcon,
    intro:
      "Convert between metric and imperial units across length, mass, temperature, volume, area, speed, digital storage, and time. Enter a value and instantly see it in every unit in that category — all in your browser.",
    steps: [
      "Pick a category (length, mass, temperature, and more).",
      "Enter a value and choose the unit to convert from.",
      "Read the result, or see it in every unit at once.",
    ],
    faqs: [
      { q: "Which measurement systems are supported?", a: "Both metric and imperial (US) units are included in each category, so you can convert in either direction." },
      { q: "How is temperature handled?", a: "Celsius, Fahrenheit, and Kelvin use proper offset formulas, not simple ratios, so conversions are exact." },
    ],
    related: ["number-base-converter", "timestamp-converter", "color-converter"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    tagline: "Work out percentages, ratios, and percentage change.",
    description:
      "Free online percentage calculator. Find a percent of a number, what percent one number is of another, and percentage increase or decrease.",
    keywords: ["percentage calculator", "percent calculator", "percentage change", "percent of a number"],
    icon: PercentIcon,
    intro:
      "Solve everyday percentage problems in one place: find X% of a number, work out what percentage one value is of another, and calculate percentage increase or decrease between two numbers.",
    steps: [
      "Choose the type of percentage calculation.",
      "Enter your numbers.",
      "Read the answer instantly.",
    ],
    faqs: [
      { q: "How do I calculate percentage change?", a: "Subtract the old value from the new value, divide by the old value, and multiply by 100. The tool does this for you and shows whether it's an increase or decrease." },
      { q: "What's the difference between the three modes?", a: "Mode one finds a percent of a number; mode two finds what percent one number is of another; mode three finds the percentage change between two numbers." },
    ],
    related: ["unit-converter", "loan-calculator", "bmi-calculator"],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    tagline: "Calculate exact age in years, months, and days.",
    description:
      "Free online age calculator. Find your exact age in years, months, and days from your date of birth, plus total days and your next birthday.",
    keywords: ["age calculator", "date of birth calculator", "how old am i", "age in days"],
    icon: CakeIcon,
    intro:
      "Enter your date of birth to find your exact age in years, months, and days — as of today or any date you choose. It also shows your age in total months, weeks, and days, and counts down to your next birthday.",
    steps: [
      "Enter your date of birth.",
      "Leave the second date as today, or pick another date.",
      "See your exact age and totals.",
    ],
    faqs: [
      { q: "Can I calculate age at a past or future date?", a: "Yes — change the second date to any date and the age is calculated as of that date." },
      { q: "Is my date of birth stored anywhere?", a: "No — the calculation runs entirely in your browser and nothing is sent to a server." },
    ],
    related: ["date-difference", "timestamp-converter", "percentage-calculator"],
  },
  {
    slug: "date-difference",
    name: "Date Difference Calculator",
    tagline: "Count the days, weeks, and months between two dates.",
    description:
      "Free online date difference calculator. Find the duration between two dates in years, months, days, weeks, hours, and total days.",
    keywords: ["date difference calculator", "days between dates", "duration calculator", "date duration"],
    icon: CalendarDaysIcon,
    intro:
      "Find out exactly how much time is between two dates — in years, months, and days, plus totals in days, weeks, hours, and minutes. Great for deadlines, anniversaries, and project planning.",
    steps: [
      "Pick a start date.",
      "Pick an end date (or use today).",
      "Read the full breakdown of the duration.",
    ],
    faqs: [
      { q: "Does the count include both the start and end date?", a: "It measures the span between the two dates, so the number of days is the difference between them." },
      { q: "What if I enter the dates in the wrong order?", a: "No problem — the tool always shows a positive duration regardless of which date is earlier." },
    ],
    related: ["age-calculator", "timestamp-converter", "cron-explainer"],
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    tagline: "Calculate your Body Mass Index in metric or imperial.",
    description:
      "Free online BMI calculator. Calculate your Body Mass Index from height and weight in metric or imperial units, with your category and healthy range.",
    keywords: ["bmi calculator", "body mass index", "bmi calculator metric", "healthy weight calculator"],
    icon: ScaleIcon,
    intro:
      "Calculate your Body Mass Index (BMI) from your height and weight, in metric or imperial units. See which category your BMI falls into and the healthy weight range for your height.",
    steps: [
      "Choose metric or imperial units.",
      "Enter your height and weight.",
      "See your BMI, category, and healthy range.",
    ],
    faqs: [
      { q: "What is a healthy BMI range?", a: "A BMI between 18.5 and 24.9 is generally considered a healthy weight for most adults." },
      { q: "Is BMI accurate for everyone?", a: "BMI is a useful general guide but doesn't account for muscle mass, age, or body composition — treat it as one signal, not a diagnosis." },
    ],
    related: ["unit-converter", "percentage-calculator", "age-calculator"],
  },
  {
    slug: "loan-calculator",
    name: "Loan & EMI Calculator",
    tagline: "Estimate monthly loan payments, interest, and total cost.",
    description:
      "Free online loan and EMI calculator. Estimate your monthly payment, total interest, and total repayment from the loan amount, rate, and term.",
    keywords: ["loan calculator", "emi calculator", "monthly payment calculator", "loan interest calculator"],
    icon: LandmarkIcon,
    intro:
      "Estimate the monthly payment on a loan or mortgage from the amount borrowed, the annual interest rate, and the term. See the total interest and the total amount you'll repay over the life of the loan.",
    steps: [
      "Enter the loan amount and pick a currency.",
      "Enter the annual interest rate and term in years.",
      "See your monthly payment and total cost.",
    ],
    faqs: [
      { q: "How is the monthly payment calculated?", a: "It uses the standard amortization formula based on the principal, monthly interest rate, and number of monthly payments." },
      { q: "Does this include taxes or fees?", a: "No — it estimates principal and interest only. Property taxes, insurance, and fees are not included." },
    ],
    related: ["percentage-calculator", "unit-converter", "bmi-calculator"],
  },
  {
    slug: "css-gradient-generator",
    name: "CSS Gradient Generator",
    tagline: "Design linear and radial CSS gradients with live preview.",
    description:
      "Free online CSS gradient generator. Create linear and radial gradients with a live preview and copy the ready-to-use CSS.",
    keywords: ["css gradient generator", "gradient generator", "linear gradient css", "background gradient"],
    icon: PaintBucketIcon,
    intro:
      "Design beautiful linear and radial CSS gradients with a live preview. Pick your colors, set the angle, and copy the ready-to-use CSS background rule for your website.",
    steps: [
      "Choose a linear or radial gradient.",
      "Pick your two colors and set the angle.",
      "Copy the generated CSS.",
    ],
    faqs: [
      { q: "How do I use the generated CSS?", a: "Paste the background rule onto any element, e.g. a div or a section, and the gradient appears as its background." },
      { q: "Can I control the gradient direction?", a: "Yes — for linear gradients, use the angle slider to set the direction from 0 to 360 degrees." },
    ],
    related: ["color-converter", "box-shadow-generator", "meta-tag-generator"],
  },
  {
    slug: "box-shadow-generator",
    name: "CSS Box Shadow Generator",
    tagline: "Visually build a CSS box-shadow and copy the code.",
    description:
      "Free online CSS box-shadow generator. Adjust offset, blur, spread, color, and inset with a live preview, then copy the box-shadow CSS.",
    keywords: ["box shadow generator", "css box shadow", "box shadow css generator", "shadow generator"],
    icon: BoxIcon,
    intro:
      "Build a CSS box-shadow visually with sliders for offset, blur, spread, color, and opacity — with a live preview. Toggle inset shadows and copy the exact CSS when it looks right.",
    steps: [
      "Adjust the offset, blur, spread, and color.",
      "Toggle inset for an inner shadow if you want one.",
      "Copy the generated box-shadow CSS.",
    ],
    faqs: [
      { q: "What does spread do?", a: "Spread grows (positive) or shrinks (negative) the shadow's size before the blur is applied." },
      { q: "What is an inset shadow?", a: "An inset shadow is drawn inside the element's edges instead of outside, creating an inner-shadow or pressed-in effect." },
    ],
    related: ["css-gradient-generator", "color-converter", "meta-tag-generator"],
  },
  {
    slug: "find-replace",
    name: "Find and Replace Text",
    tagline: "Find and replace text online, with regex support.",
    description:
      "Free online find and replace tool. Search and replace text in bulk, with case-insensitive, whole-word, and regular-expression options.",
    keywords: ["find and replace", "find and replace text", "text replace online", "regex replace"],
    icon: ReplaceIcon,
    intro:
      "Find and replace text in any block of content — plain matches or full regular expressions, with case-insensitive and whole-word options. It shows how many matches were replaced, and everything runs in your browser.",
    steps: [
      "Paste your text.",
      "Enter what to find and what to replace it with.",
      "Toggle case, whole-word, or regex, then copy the result.",
    ],
    faqs: [
      { q: "Does it support regular expressions?", a: "Yes — enable the Regex option to use JavaScript regular expressions, including capture groups like $1 in the replacement." },
      { q: "Is my text uploaded?", a: "No — find and replace runs entirely in your browser and nothing is sent to a server." },
    ],
    related: ["case-converter", "text-diff", "remove-line-breaks"],
  },
  {
    slug: "remove-line-breaks",
    name: "Remove Line Breaks",
    tagline: "Strip line breaks and blank lines from text.",
    description:
      "Free online tool to remove line breaks from text. Replace line breaks with spaces or nothing, delete blank lines, and trim whitespace.",
    keywords: ["remove line breaks", "remove line breaks online", "delete blank lines", "strip newlines"],
    icon: WrapTextIcon,
    intro:
      "Remove line breaks from text — replace them with a space, a comma, or nothing — and optionally delete blank lines and trim whitespace. Handy for cleaning up copied PDFs, emails, and code output.",
    steps: [
      "Paste text that has unwanted line breaks.",
      "Choose what to replace the breaks with.",
      "Copy the cleaned-up single block of text.",
    ],
    faqs: [
      { q: "Can it also remove empty lines?", a: "Yes — turn on 'Remove blank lines' to drop empty lines while keeping the rest of your line structure." },
      { q: "Will it collapse multiple spaces?", a: "When replacing breaks with a space, consecutive spaces are collapsed so the text reads cleanly." },
    ],
    related: ["find-replace", "case-converter", "word-counter"],
  },
  {
    slug: "text-repeater",
    name: "Text Repeater",
    tagline: "Repeat any text or line multiple times.",
    description:
      "Free online text repeater. Repeat a word, sentence, or line any number of times, with a custom separator and optional numbering.",
    keywords: ["text repeater", "repeat text", "repeat text online", "repeat word generator"],
    icon: RepeatIcon,
    intro:
      "Repeat any text a set number of times, separated by new lines, spaces, or commas — with optional line numbering. Useful for test data, filler content, and quick lists.",
    steps: [
      "Enter the text to repeat.",
      "Set how many times and pick a separator.",
      "Copy the repeated output.",
    ],
    faqs: [
      { q: "How many times can I repeat text?", a: "Up to 100,000 repetitions — though very large outputs may be slow to copy depending on your device." },
      { q: "Can each copy be numbered?", a: "Yes — enable 'Number each line' to prefix every repetition with 1., 2., 3., and so on." },
    ],
    related: ["lorem-ipsum", "random-string", "word-counter"],
  },
  {
    slug: "word-frequency",
    name: "Word Frequency Counter",
    tagline: "Count how often each word appears in text.",
    description:
      "Free online word frequency counter. Analyze text to see how often each word appears, sorted by count, with CSV export.",
    keywords: ["word frequency counter", "word frequency", "keyword density", "count word occurrences"],
    icon: BarChart3Icon,
    intro:
      "Analyze any text to see how often each word appears, ranked from most to least frequent with a visual bar for each. Great for checking keyword density, writing style, and content analysis. Export the full list as CSV.",
    steps: [
      "Paste your text.",
      "Optionally ignore case or set a minimum word length.",
      "Review the ranked word counts or copy them as CSV.",
    ],
    faqs: [
      { q: "How are words counted?", a: "Words are split on spaces and punctuation, counting letters, numbers, and apostrophes. Turn on 'Ignore case' to treat 'The' and 'the' as the same word." },
      { q: "Can I export the results?", a: "Yes — click Copy CSV to get the complete word-and-count list, ready for a spreadsheet." },
    ],
    related: ["word-counter", "case-converter", "text-diff"],
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    tagline: "Calculate the tip and split a bill between people.",
    description:
      "Free online tip calculator. Work out the tip amount, total, and per-person share — split a restaurant bill in seconds.",
    keywords: ["tip calculator", "gratuity calculator", "bill splitter", "how much to tip"],
    icon: ReceiptIcon,
    intro:
      "Calculate a tip and split the bill in seconds. Enter the bill, pick a tip percentage, and choose how many people are sharing — you'll get the tip amount, total, and the amount each person pays.",
    steps: [
      "Enter the bill amount.",
      "Pick a tip percentage (or type your own).",
      "Set how many people are splitting the total.",
    ],
    faqs: [
      { q: "How much should I tip?", a: "In the US, 15–20% is customary for table service. Norms vary by country and service type, so adjust to your situation." },
      { q: "Is the tip calculated before or after tax?", a: "This tool calculates the tip on the bill amount you enter. If you prefer to tip on the pre-tax subtotal, enter that as the bill." },
    ],
    related: ["discount-calculator", "percentage-calculator", "loan-calculator"],
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    tagline: "Find the sale price and how much you save.",
    description:
      "Free online discount calculator. Calculate the sale price, amount saved, and final price after a percentage discount (and optional tax).",
    keywords: ["discount calculator", "percent off calculator", "sale price calculator", "how much off"],
    icon: BadgePercentIcon,
    intro:
      "Find out the final price after a discount and exactly how much you save. Enter the original price and the percent off — add a tax rate if you want the after-tax total too.",
    steps: [
      "Enter the original price.",
      "Enter the discount percentage.",
      "Optionally add a tax rate to see the final total.",
    ],
    faqs: [
      { q: "How do I calculate a percentage discount?", a: "Multiply the price by the discount percent and divide by 100 to get the savings, then subtract that from the price. The tool does it instantly." },
      { q: "Does it include sales tax?", a: "Only if you enter a tax rate — the tax is applied to the discounted price to give the final amount." },
    ],
    related: ["percentage-calculator", "tip-calculator", "loan-calculator"],
  },
  {
    slug: "cidr-calculator",
    name: "CIDR / Subnet Calculator",
    tagline: "Calculate subnet range, mask, and host counts from CIDR.",
    description:
      "Free online CIDR subnet calculator. Enter an IPv4 address and prefix to get the network, broadcast, host range, netmask, and host count.",
    keywords: ["cidr calculator", "subnet calculator", "ip subnet calculator", "cidr to ip range"],
    icon: NetworkIcon,
    intro:
      "Enter an IPv4 address in CIDR notation to instantly get the network and broadcast addresses, usable host range, netmask, wildcard mask, and total and usable host counts. Everything is computed locally in your browser.",
    steps: [
      "Type an address and prefix, e.g. 192.168.1.10/24.",
      "Read the network, broadcast, and host range.",
      "Copy the values you need.",
    ],
    faqs: [
      { q: "What does the /24 mean?", a: "The number after the slash is the prefix length — how many leading bits are the network portion. /24 means a 255.255.255.0 mask with 254 usable hosts." },
      { q: "Does it handle /31 and /32?", a: "Yes — /31 is treated as a 2-address point-to-point link and /32 as a single host, per common practice." },
    ],
    related: ["number-base-converter", "chmod-calculator", "hash-generator"],
  },
  {
    slug: "roman-numeral",
    name: "Roman Numeral Converter",
    tagline: "Convert numbers to Roman numerals and back.",
    description:
      "Free online Roman numeral converter. Convert numbers to Roman numerals and Roman numerals to numbers, from 1 to 3999.",
    keywords: ["roman numeral converter", "number to roman numerals", "roman numerals to number", "roman numeral translator"],
    icon: ScrollIcon,
    intro:
      "Convert numbers to Roman numerals and Roman numerals back to numbers, anywhere from 1 to 3999. It auto-detects which way you're converting and validates the numeral.",
    steps: [
      "Type a number (1–3999) or a Roman numeral.",
      "The conversion appears instantly.",
      "Copy the result.",
    ],
    faqs: [
      { q: "What's the largest number supported?", a: "Standard Roman numerals go up to 3999 (MMMCMXCIX); larger values need overlines, which aren't part of the basic system." },
      { q: "Does it validate Roman numerals?", a: "Yes — malformed numerals like 'IIII' or 'VX' are rejected, so only correctly formed numerals convert." },
    ],
    related: ["number-base-converter", "unit-converter", "text-to-binary"],
  },
  {
    slug: "timezone-converter",
    name: "Time Zone Converter",
    tagline: "Convert a time between any two time zones.",
    description:
      "Free online time zone converter. Convert a date and time between any two IANA time zones, with automatic daylight-saving handling.",
    keywords: ["time zone converter", "timezone converter", "convert time zones", "world clock converter"],
    icon: GlobeIcon,
    intro:
      "Convert a specific date and time from one time zone to another. Pick the source and target zones and the exact moment, and get the converted local time — daylight-saving transitions are handled automatically.",
    steps: [
      "Enter a date and time (or click Now).",
      "Choose the time zone it's in, and the one to convert to.",
      "Read the converted local time.",
    ],
    faqs: [
      { q: "Does it handle daylight saving time?", a: "Yes — conversions use each zone's DST rules for the exact date you enter, so spring-forward and fall-back are accounted for." },
      { q: "Which time zones are supported?", a: "All IANA time zones your browser knows about — hundreds of cities and regions worldwide." },
    ],
    related: ["timestamp-converter", "unit-converter", "date-difference"],
  },
  {
    slug: "json-yaml",
    name: "JSON to YAML Converter",
    tagline: "Convert between JSON and YAML in both directions.",
    description:
      "Free online JSON to YAML converter. Convert JSON to YAML and YAML back to JSON instantly and privately in your browser.",
    keywords: ["json to yaml", "yaml to json", "json yaml converter", "convert json to yaml"],
    icon: ArrowLeftRightIcon,
    intro:
      "Convert JSON to YAML or YAML to JSON with a real parser, so nested structures, arrays, and types are preserved correctly. Everything runs in your browser — your data never leaves your device.",
    steps: [
      "Choose JSON → YAML or YAML → JSON.",
      "Paste your data.",
      "Copy the converted output.",
    ],
    faqs: [
      { q: "Is the conversion accurate for nested data?", a: "Yes — it uses a proper YAML parser and serializer, so objects, arrays, and scalar types round-trip correctly." },
      { q: "Why convert JSON to YAML?", a: "YAML is often easier to read and edit for configuration files (CI pipelines, Kubernetes, Docker Compose), while JSON is common for APIs and data exchange." },
    ],
    related: ["json-formatter", "json-to-csv", "json-to-typescript"],
  },
  {
    slug: "gst-vat-calculator",
    name: "GST / VAT / Sales Tax Calculator",
    tagline: "Add or remove GST, VAT, or sales tax from a price.",
    description:
      "Free online GST, VAT, and sales tax calculator. Add tax to a net price or extract the tax from a gross price at any rate.",
    keywords: ["vat calculator", "gst calculator", "sales tax calculator", "add or remove vat"],
    icon: CoinsIcon,
    intro:
      "Calculate GST, VAT, or sales tax at any rate. Add tax to a net amount, or work backwards to extract the tax from a tax-inclusive (gross) price — with the net, tax, and gross totals shown.",
    steps: [
      "Choose Add tax or Remove tax.",
      "Enter the amount and the tax rate.",
      "See the net, tax, and gross totals.",
    ],
    faqs: [
      { q: "How do I remove VAT from a price?", a: "Use Remove tax: the tool divides the gross price by (1 + rate/100) to find the net amount, and the difference is the tax." },
      { q: "Does it work for any tax rate?", a: "Yes — enter any percentage, so it works for VAT, GST, or local sales tax anywhere." },
    ],
    related: ["percentage-calculator", "discount-calculator", "tip-calculator"],
  },
  {
    slug: "aspect-ratio-calculator",
    name: "Aspect Ratio Calculator",
    tagline: "Resize dimensions while keeping the same ratio.",
    description:
      "Free online aspect ratio calculator. Find the missing width or height to keep an image or video at the same aspect ratio, plus the simplified ratio.",
    keywords: ["aspect ratio calculator", "ratio calculator", "resize keeping ratio", "16:9 calculator"],
    icon: RatioIcon,
    intro:
      "Keep images and videos proportional. Enter your original width and height to see the simplified ratio (like 16:9), then scale to a new width or height and get the matching dimension automatically.",
    steps: [
      "Enter the original width and height.",
      "Enter a new width to get the height (or a new height to get the width).",
      "Use the proportional result.",
    ],
    faqs: [
      { q: "What is an aspect ratio?", a: "It's the proportional relationship between width and height, written like 16:9. Keeping it constant stops images and videos from looking stretched." },
      { q: "How is the ratio simplified?", a: "The width and height are divided by their greatest common divisor — so 1920×1080 simplifies to 16:9." },
    ],
    related: ["unit-converter", "percentage-calculator", "color-converter"],
  },
  {
    slug: "credit-card-validator",
    name: "Credit Card Validator (Luhn)",
    tagline: "Check a card number's Luhn checksum and detect its brand.",
    description:
      "Free online credit card validator. Check whether a card number passes the Luhn checksum and detect its brand — all in your browser.",
    keywords: ["credit card validator", "luhn check", "card number validator", "luhn algorithm"],
    icon: CreditCardIcon,
    intro:
      "Validate a credit card number's format using the Luhn checksum and detect its brand (Visa, Mastercard, Amex, and more). Useful for testing and form validation — it runs entirely in your browser.",
    steps: [
      "Paste or type a card number.",
      "See whether it passes the Luhn check.",
      "Check the detected card brand.",
    ],
    faqs: [
      { q: "What is the Luhn algorithm?", a: "It's a simple checksum formula used to catch accidental errors in card numbers. Passing it means the number is well-formed — not that the card is real or active." },
      { q: "Is it safe to enter a card number?", a: "Yes — validation happens entirely in your browser and nothing is sent anywhere. Still, only use test numbers, not sensitive live cards." },
    ],
    related: ["hash-generator", "regex-tester", "uuid-generator"],
  },
  {
    slug: "color-shades-generator",
    name: "Color Shades Generator",
    tagline: "Generate tints and shades from any base color.",
    description:
      "Free online color shades generator. Create a palette of tints and shades from any HEX color — perfect for design systems and UI themes.",
    keywords: ["color shades generator", "tints and shades", "color palette generator", "shade generator"],
    icon: PaletteIcon,
    intro:
      "Turn any base color into a full range of tints (lighter) and shades (darker) — ideal for building a consistent color scale for a design system or UI theme. Click any swatch to copy its HEX value.",
    steps: [
      "Enter a base HEX color or use the picker.",
      "See the generated tints and shades.",
      "Click a swatch to copy its HEX.",
    ],
    faqs: [
      { q: "What's the difference between a tint and a shade?", a: "A tint mixes the color with white to make it lighter; a shade mixes it with black to make it darker." },
      { q: "Can I use these for a design system?", a: "Yes — the scale from light to dark is exactly what you need for a color ramp (like 50–900) in a UI theme." },
    ],
    related: ["color-converter", "css-gradient-generator", "box-shadow-generator"],
  },
  {
    slug: "favicon-generator",
    name: "Favicon Generator",
    tagline: "Turn any image into favicons for your website.",
    description:
      "Free online favicon generator. Upload an image to create favicons in every size, download them as a ZIP, and copy the HTML tags — all in your browser.",
    keywords: ["favicon generator", "create favicon", "favicon from image", "favicon maker"],
    icon: AppWindowIcon,
    intro:
      "Upload any image and generate favicons in all the sizes modern browsers and devices need (16 to 512 px). Preview them, download individually or as a ZIP, and copy the HTML tags to drop into your site. Nothing is uploaded — it all happens in your browser.",
    steps: [
      "Upload a square image (512×512 or larger works best).",
      "Download the sizes you need, or all of them as a ZIP.",
      "Paste the provided tags into your page's <head>.",
    ],
    faqs: [
      { q: "What size should a favicon be?", a: "Provide 16×16 and 32×32 for browser tabs and 180×180 for Apple touch icons; 192 and 512 are used for Android and PWAs. This tool generates all of them." },
      { q: "Is my image uploaded?", a: "No — the image is processed entirely in your browser using a canvas, so it never leaves your device." },
    ],
    related: ["image-to-base64", "meta-tag-generator", "qr-code"],
  },
  {
    slug: "image-converter",
    name: "Image Converter (PNG, JPG, WebP)",
    tagline: "Convert images between PNG, JPG, and WebP.",
    description:
      "Free online image converter. Convert PNG to JPG, JPG to PNG, or images to WebP with adjustable quality — all in your browser, nothing uploaded.",
    keywords: ["png to jpg", "jpg to png", "image to webp", "image converter", "convert image online"],
    icon: ImagesIcon,
    intro:
      "Convert an image between PNG, JPG, and WebP with an adjustable quality setting, and see the new file size before you download. Everything happens in your browser — your image is never uploaded.",
    steps: [
      "Choose an image.",
      "Pick the output format and quality.",
      "Download the converted image.",
    ],
    faqs: [
      { q: "Is my image uploaded to a server?", a: "No — conversion happens entirely in your browser using a canvas, so the file never leaves your device." },
      { q: "Which format should I use?", a: "JPG is best for photos, PNG for graphics with transparency, and WebP for the smallest size at good quality on the modern web." },
    ],
    related: ["bulk-image-converter", "image-resizer", "favicon-generator"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    tagline: "Resize an image to exact dimensions online.",
    description:
      "Free online image resizer. Resize any image to exact pixel dimensions while keeping the aspect ratio — privately in your browser.",
    keywords: ["image resizer", "resize image online", "resize image", "photo resizer"],
    icon: ScalingIcon,
    intro:
      "Resize any image to the exact width and height you need, with an option to lock the aspect ratio so it never looks stretched. It all runs in your browser — nothing is uploaded.",
    steps: [
      "Choose an image.",
      "Enter a new width or height (lock the ratio to keep proportions).",
      "Resize and download the result.",
    ],
    faqs: [
      { q: "Will resizing distort my image?", a: "Not if you keep &quot;Lock ratio&quot; enabled — the other dimension is calculated automatically to preserve the proportions." },
      { q: "Are my images private?", a: "Yes — resizing is done locally in your browser, so images never leave your device." },
    ],
    related: ["bulk-image-converter", "image-converter", "favicon-generator"],
  },
  {
    slug: "password-strength-checker",
    name: "Password Strength Checker",
    tagline: "Test how strong a password is, privately.",
    description:
      "Free online password strength checker. Estimate a password's entropy, strength, and time to crack — analyzed entirely in your browser.",
    keywords: ["password strength checker", "password strength test", "how strong is my password", "password entropy"],
    icon: ShieldCheckIcon,
    intro:
      "Test how strong a password is. This tool estimates its entropy, rates its strength, and shows a rough time-to-crack, with tips to improve it. Your password is analyzed entirely in your browser and never sent anywhere.",
    steps: [
      "Type or paste a password.",
      "See its strength rating and entropy.",
      "Follow the tips to make it stronger.",
    ],
    faqs: [
      { q: "Is it safe to type my password here?", a: "Yes — the analysis runs entirely in your browser and nothing is transmitted or stored. Still, avoid testing a password you're actively using anywhere sensitive." },
      { q: "What is entropy?", a: "Entropy measures unpredictability in bits — higher is stronger. It grows with password length and the variety of characters used." },
    ],
    related: ["password-generator", "hash-generator", "random-string"],
  },
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    tagline: "Generate random numbers in any range.",
    description:
      "Free online random number generator. Generate one or many random numbers in a custom range, with an option for no duplicates.",
    keywords: ["random number generator", "random number", "number picker", "rng"],
    icon: Dice5Icon,
    intro:
      "Generate random numbers within any range you choose — one at a time or many at once, with an option to keep them all unique. Great for draws, sampling, games, and testing.",
    steps: [
      "Set the minimum and maximum.",
      "Choose how many numbers you need.",
      "Generate and copy the results.",
    ],
    faqs: [
      { q: "Can I generate numbers with no repeats?", a: "Yes — enable &quot;No duplicates&quot; and every number in the result set will be unique (as long as the range is large enough)." },
      { q: "Is the range inclusive?", a: "Yes — both the minimum and maximum values can be generated." },
    ],
    related: ["random-string", "uuid-generator", "password-generator"],
  },
  {
    slug: "strip-html",
    name: "HTML to Text (Strip Tags)",
    tagline: "Remove HTML tags to get clean plain text.",
    description:
      "Free online HTML to text converter. Strip HTML tags to get clean plain text, with an option to keep line breaks — right in your browser.",
    keywords: ["strip html", "html to text", "remove html tags", "html tag remover"],
    icon: RemoveFormattingIcon,
    intro:
      "Paste HTML and get clean plain text with all the tags removed. Keep the line breaks from block elements, or collapse everything into a single flow. Handy for cleaning up rich-text copy, emails, and CMS content.",
    steps: [
      "Paste your HTML.",
      "Choose whether to keep line breaks.",
      "Copy the plain-text result.",
    ],
    faqs: [
      { q: "Does it run any scripts in the HTML?", a: "No — the HTML is parsed safely to extract text only; no scripts or markup are ever executed." },
      { q: "What happens to entities like &amp;amp;?", a: "They're decoded to their real characters (for example &amp;amp; becomes &amp;) in the plain-text output." },
    ],
    related: ["html-entities", "find-replace", "word-counter"],
  },
  {
    slug: "bmr-calculator",
    name: "BMR & Calorie Calculator",
    tagline: "Estimate daily calories from BMR and activity.",
    description:
      "Free online BMR and calorie calculator. Estimate your basal metabolic rate and daily calorie needs using the Mifflin-St Jeor equation.",
    keywords: ["bmr calculator", "calorie calculator", "tdee calculator", "daily calorie needs"],
    icon: FlameIcon,
    intro:
      "Estimate your Basal Metabolic Rate (BMR) — the calories your body burns at rest — and your total daily energy expenditure (TDEE) based on activity level, using the accurate Mifflin-St Jeor equation. Includes calorie targets for losing or gaining weight.",
    steps: [
      "Choose metric or imperial and enter age, sex, height, and weight.",
      "Pick your activity level.",
      "See your BMR, maintenance calories, and goals.",
    ],
    faqs: [
      { q: "What's the difference between BMR and TDEE?", a: "BMR is the energy you burn at complete rest; TDEE multiplies BMR by an activity factor to estimate the calories you burn in a full day." },
      { q: "How accurate is this?", a: "The Mifflin-St Jeor equation is one of the most accurate estimates, but individual needs vary — treat it as a starting point." },
    ],
    related: ["bmi-calculator", "unit-converter", "percentage-calculator"],
  },
  {
    slug: "gpa-calculator",
    name: "GPA Calculator",
    tagline: "Calculate your GPA on a 4.0 scale.",
    description:
      "Free online GPA calculator. Enter your course grades and credit hours to calculate your weighted GPA on a 4.0 scale.",
    keywords: ["gpa calculator", "calculate gpa", "college gpa calculator", "weighted gpa"],
    icon: GraduationCapIcon,
    intro:
      "Calculate your grade point average on a 4.0 scale. Add each course with its letter grade and credit hours, and get your weighted GPA instantly. Add or remove courses as needed.",
    steps: [
      "Add a row for each course.",
      "Pick the letter grade and enter the credit hours.",
      "See your weighted GPA update live.",
    ],
    faqs: [
      { q: "How is GPA weighted by credits?", a: "Each course's grade points are multiplied by its credit hours, summed, then divided by the total credits — so higher-credit courses count more." },
      { q: "What grade scale is used?", a: "A standard unweighted 4.0 scale (A = 4.0, B = 3.0, and so on down to F = 0.0)." },
    ],
    related: ["percentage-calculator", "unit-converter", "aspect-ratio-calculator"],
  },
  {
    slug: "bulk-image-converter",
    name: "Bulk Image Converter & Resizer",
    tagline: "Convert and resize many images at once, then download a ZIP.",
    description:
      "Free online bulk image converter and resizer. Convert and resize multiple images to PNG, JPG, or WebP at once and download them all as a ZIP — in your browser.",
    keywords: ["bulk image converter", "batch image resizer", "convert multiple images", "bulk resize images", "batch convert images"],
    icon: FilesIcon,
    intro:
      "Convert and resize a whole batch of images in one go — pick your format, quality, and maximum size, process them all at once, and download everything as a ZIP. Free processes up to 3 images at a time; Pro removes the limit and enables one-click ZIP export. Everything runs in your browser, so your images are never uploaded.",
    steps: [
      "Add multiple images.",
      "Choose the output format, quality, and optional max size.",
      "Convert them all and download as a ZIP.",
    ],
    faqs: [
      { q: "How many images can I convert at once?", a: "The free tier processes up to 3 images per batch. OhoTool Pro removes the limit and adds a one-click ZIP download for the whole batch." },
      { q: "Are my images uploaded?", a: "No — every image is processed locally in your browser using a canvas, so nothing ever leaves your device." },
      { q: "Which formats are supported?", a: "Convert to PNG, JPG, or WebP, with an adjustable quality setting for the lossy formats and an optional maximum width/height." },
    ],
    related: ["image-converter", "image-resizer", "favicon-generator"],
    pro: true,
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    tagline: "Combine multiple PDFs into one file.",
    description:
      "Free online PDF merger. Combine multiple PDF files into a single document, reorder them, and download — all privately in your browser.",
    keywords: ["merge pdf", "combine pdf", "pdf merger", "join pdf files", "merge pdf online"],
    icon: FileStackIcon,
    intro:
      "Combine several PDFs into one file. Add your PDFs, drag them into the order you want, and merge — the whole thing runs in your browser, so your documents are never uploaded. Free merges up to 2 files; Pro merges as many as you need.",
    steps: [
      "Add the PDF files you want to combine.",
      "Reorder them with the arrows.",
      "Merge and download the single PDF.",
    ],
    faqs: [
      { q: "Are my PDFs uploaded to a server?", a: "No — merging happens entirely in your browser with a local PDF engine, so your files never leave your device." },
      { q: "How many PDFs can I merge?", a: "The free tier merges up to 2 PDFs at a time. OhoTool Pro removes the limit so you can merge any number." },
    ],
    related: ["split-pdf", "images-to-pdf", "image-converter"],
    pro: true,
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    tagline: "Extract pages or split a PDF into separate files.",
    description:
      "Free online PDF splitter. Extract specific pages or page ranges from a PDF, or split every page into its own file — privately in your browser.",
    keywords: ["split pdf", "pdf splitter", "extract pdf pages", "separate pdf pages", "split pdf online"],
    icon: ScissorsIcon,
    intro:
      "Pull specific pages or ranges out of a PDF into a new file — or, with Pro, burst a PDF into one file per page and download them all as a ZIP. Everything runs locally in your browser, so your document stays private.",
    steps: [
      "Choose a PDF.",
      "Enter the pages to extract (e.g. 1-3, 5).",
      "Extract them, or split every page (Pro).",
    ],
    faqs: [
      { q: "How do I extract certain pages?", a: "Enter page numbers and ranges separated by commas, like 1-3, 5, 8-10, then click Extract to get a new PDF with just those pages." },
      { q: "Can I split a PDF into single pages?", a: "Yes — with OhoTool Pro, &quot;Split all&quot; saves each page as its own PDF and downloads them together as a ZIP." },
    ],
    related: ["merge-pdf", "images-to-pdf", "image-resizer"],
    pro: true,
  },
  {
    slug: "images-to-pdf",
    name: "Images to PDF",
    tagline: "Combine JPG, PNG, and WebP images into a PDF.",
    description:
      "Free online image to PDF converter. Combine JPG, PNG, and WebP images into a single PDF, reorder them, and choose the page size — in your browser.",
    keywords: ["images to pdf", "jpg to pdf", "png to pdf", "image to pdf converter", "combine images to pdf"],
    icon: FileImageIcon,
    intro:
      "Turn a set of images into a single PDF — great for scans, receipts, and photos. Reorder the pages and choose fit-to-image or A4 layout. It all runs in your browser, so nothing is uploaded. Free combines up to 3 images; Pro is unlimited.",
    steps: [
      "Add your images.",
      "Reorder them and pick a page size.",
      "Create and download the PDF.",
    ],
    faqs: [
      { q: "Which image formats are supported?", a: "JPG, PNG, WebP, and other common formats — each image is added as its own page in the PDF." },
      { q: "How many images can I combine?", a: "The free tier combines up to 3 images. OhoTool Pro removes the limit for larger documents." },
    ],
    related: ["merge-pdf", "split-pdf", "image-converter"],
    pro: true,
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    tagline: "Rotate all pages of a PDF and save.",
    description:
      "Free online PDF rotator. Rotate every page of a PDF 90, 180, or 270 degrees and download the fixed file — privately in your browser.",
    keywords: ["rotate pdf", "rotate pdf pages", "turn pdf sideways", "fix pdf orientation"],
    icon: RotateCwIcon,
    intro:
      "Rotate the pages of a PDF that scanned or exported sideways. Choose 90°, 180°, or 270° and download the corrected file — it all happens in your browser, so nothing is uploaded.",
    steps: ["Choose a PDF.", "Pick the rotation angle.", "Rotate and download."],
    faqs: [
      { q: "Does this rotate every page?", a: "Yes — the selected rotation is applied to all pages and added to any existing rotation." },
      { q: "Are my files uploaded?", a: "No — rotation is done locally in your browser and nothing leaves your device." },
    ],
    related: ["split-pdf", "delete-pdf-pages", "merge-pdf"],
  },
  {
    slug: "delete-pdf-pages",
    name: "Delete PDF Pages",
    tagline: "Remove pages from a PDF and keep the rest.",
    description:
      "Free online tool to delete pages from a PDF. Remove specific pages or ranges and download the trimmed document — privately in your browser.",
    keywords: ["delete pdf pages", "remove pages from pdf", "pdf page remover", "delete pages pdf"],
    icon: FileMinusIcon,
    intro:
      "Remove unwanted pages from a PDF — enter the page numbers or ranges to delete and download the trimmed file. Everything runs in your browser, so your document stays private.",
    steps: ["Choose a PDF.", "Enter the pages to delete (e.g. 1, 4-6).", "Download the trimmed PDF."],
    faqs: [
      { q: "How do I remove several pages at once?", a: "List page numbers and ranges separated by commas, like 1, 4-6, 10 — all of them are removed and the rest are kept." },
      { q: "Can I delete every page?", a: "No — at least one page must remain, so the tool won't let you remove them all." },
    ],
    related: ["split-pdf", "rotate-pdf", "merge-pdf"],
  },
  {
    slug: "pdf-page-numbers",
    name: "Add Page Numbers to PDF",
    tagline: "Stamp page numbers onto a PDF.",
    description:
      "Free online tool to add page numbers to a PDF. Choose the position and starting number, then download — privately in your browser.",
    keywords: ["add page numbers to pdf", "pdf page numbers", "number pdf pages", "pdf pagination"],
    icon: ListOrderedIcon,
    intro:
      "Add page numbers to a PDF in one click. Choose the position (bottom center, left, or right) and the starting number, then download the numbered file — all in your browser.",
    steps: ["Choose a PDF.", "Pick the position and starting number.", "Download the numbered PDF."],
    faqs: [
      { q: "Can I start numbering from a specific number?", a: "Yes — set any starting number (for example, start at 1 while skipping a cover page by choosing 0)." },
      { q: "Where are the numbers placed?", a: "At the bottom of each page — centered, left, or right, depending on your choice." },
    ],
    related: ["watermark-pdf", "merge-pdf", "split-pdf"],
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    tagline: "Add a text watermark across every page.",
    description:
      "Free online PDF watermark tool. Add a diagonal text watermark to every page of a PDF with adjustable opacity — privately in your browser.",
    keywords: ["watermark pdf", "add watermark to pdf", "pdf watermark", "stamp pdf"],
    icon: StampIcon,
    intro:
      "Stamp a text watermark — like DRAFT or CONFIDENTIAL — diagonally across every page of a PDF, with adjustable opacity. It runs entirely in your browser, so your document is never uploaded.",
    steps: ["Choose a PDF.", "Enter the watermark text and opacity.", "Add the watermark and download."],
    faqs: [
      { q: "Can I control how visible the watermark is?", a: "Yes — the opacity slider lets you make it a faint background mark or a bold overlay." },
      { q: "Does it watermark all pages?", a: "Yes — the watermark is applied to every page of the document." },
    ],
    related: ["pdf-page-numbers", "merge-pdf", "images-to-pdf"],
  },
  {
    slug: "pdf-to-images",
    name: "PDF to Images (JPG, PNG)",
    tagline: "Convert each PDF page to a JPG or PNG.",
    description:
      "Free online PDF to image converter. Turn each page of a PDF into a high-quality JPG or PNG and download them — all privately in your browser.",
    keywords: ["pdf to jpg", "pdf to png", "pdf to image", "convert pdf to jpg", "pdf to images"],
    icon: ImageDownIcon,
    intro:
      "Convert a PDF into images — each page becomes a crisp JPG or PNG at the resolution you choose. Preview them, download individually, or grab them all as a ZIP with Pro. Everything is rendered in your browser, so your document is never uploaded.",
    steps: [
      "Choose a PDF.",
      "Pick the format, resolution, and quality.",
      "Convert, then download the pages (ZIP on Pro).",
    ],
    faqs: [
      { q: "How many pages can I convert?", a: "The free tier converts the first 3 pages. OhoTool Pro converts every page and lets you download them all as a ZIP." },
      { q: "Are my PDFs uploaded?", a: "No — pages are rendered to images locally in your browser, so the file never leaves your device." },
      { q: "JPG or PNG — which should I pick?", a: "JPG is smaller and best for scanned or photo pages; PNG is lossless and best for sharp text and line art." },
    ],
    related: ["images-to-pdf", "split-pdf", "image-converter"],
    pro: true,
  },
  {
    slug: "bulk-qr-generator",
    name: "Bulk QR Code Generator",
    tagline: "Generate many QR codes at once and download a ZIP.",
    description:
      "Free online bulk QR code generator. Paste a list of URLs or text to generate many QR codes at once, customize colors, and download them as a ZIP.",
    keywords: ["bulk qr code generator", "batch qr code", "multiple qr codes", "qr code list", "mass qr generator"],
    icon: QrCodeIcon,
    intro:
      "Generate a whole batch of QR codes in one go — paste one URL or piece of text per line, customize the size and colors, and download them individually or all at once as a ZIP. Perfect for events, product labels, and campaigns. Free generates up to 3 at a time; Pro removes the limit and enables ZIP export.",
    steps: [
      "Paste one URL or text per line.",
      "Set the size and colors.",
      "Generate and download the codes (ZIP on Pro).",
    ],
    faqs: [
      { q: "How many QR codes can I generate at once?", a: "The free tier generates up to 3 codes per batch. OhoTool Pro removes the limit and lets you download them all as a ZIP." },
      { q: "Can I customize the colors?", a: "Yes — set the foreground and background colors and the size in pixels for every code in the batch." },
    ],
    related: ["qr-code", "wifi-qr", "bulk-image-converter"],
    pro: true,
  },
  {
    slug: "compress-image",
    name: "Compress Image",
    tagline: "Shrink JPG, PNG, and WebP images to a smaller size.",
    description:
      "Free online image compressor. Reduce JPG, PNG, and WebP file size by quality or to a target size — privately in your browser, nothing uploaded.",
    keywords: ["compress image", "compress jpeg", "compress png", "reduce image size", "compress image to kb"],
    icon: ShrinkIcon,
    intro:
      "Reduce image file size without the hassle. Compress by quality, or set a target size in KB and let the tool find the best quality that fits. Great for faster websites and email attachments. Free compresses up to 3 images; Pro removes the limit and adds one-click ZIP. Everything runs in your browser — your images are never uploaded.",
    steps: [
      "Add your images.",
      "Compress by quality, or enter a target size in KB.",
      "Download the smaller images (ZIP on Pro).",
    ],
    faqs: [
      { q: "Can I compress an image to a specific size?", a: "Yes — choose &quot;Target size&quot;, enter a value in KB, and the tool finds the highest quality that stays under it." },
      { q: "Does it reduce quality?", a: "Compression is lossy for JPG and WebP, but at 60–80% quality the difference is usually invisible while the file gets much smaller." },
      { q: "Are my images uploaded?", a: "No — compression happens locally in your browser using a canvas, so nothing leaves your device." },
    ],
    related: ["image-converter", "image-resizer", "bulk-image-converter"],
    pro: true,
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    tagline: "Reduce PDF file size to share and upload faster.",
    description:
      "Free online PDF compressor. Reduce PDF file size with adjustable quality — privately in your browser, with nothing uploaded to a server.",
    keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "make pdf smaller", "shrink pdf"],
    icon: FileArchiveIcon,
    intro:
      "Make PDFs smaller so they're easy to email and upload. Choose the quality and resolution, and the tool re-renders the pages to shrink the file — ideal for scanned and image-heavy PDFs. Free compresses one PDF at a time; Pro compresses in batches and downloads a ZIP. Everything runs in your browser, so your documents stay private.",
    steps: [
      "Choose your PDF files.",
      "Pick the quality and resolution.",
      "Compress and download (ZIP on Pro).",
    ],
    faqs: [
      { q: "How does the compression work?", a: "It re-renders each page as a compressed image and rebuilds the PDF, which dramatically shrinks scanned and image-heavy files. Selectable text becomes part of the image." },
      { q: "Is my PDF uploaded?", a: "No — everything is processed locally in your browser, so your document never leaves your device." },
    ],
    related: ["merge-pdf", "split-pdf", "pdf-to-images"],
    pro: true,
  },
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    tagline: "Beautify and format SQL queries for any dialect.",
    description:
      "Free online SQL formatter and beautifier. Format messy SQL into clean, readable queries for MySQL, PostgreSQL, SQL Server, and more — in your browser.",
    keywords: ["sql formatter", "sql beautifier", "format sql", "sql pretty print", "sql formatter online"],
    icon: DatabaseIcon,
    intro:
      "Turn a cramped, one-line SQL query into clean, readable, properly indented SQL. Supports MySQL, PostgreSQL, SQL Server, SQLite, BigQuery, Oracle, and standard SQL. It all runs in your browser, so your queries stay private.",
    steps: [
      "Paste your SQL.",
      "Choose the SQL dialect.",
      "Format it and copy the clean result.",
    ],
    faqs: [
      { q: "Which SQL dialects are supported?", a: "Standard SQL, MySQL, MariaDB, PostgreSQL, SQLite, BigQuery, SQL Server (T-SQL), and Oracle (PL/SQL)." },
      { q: "Is my SQL sent anywhere?", a: "No — formatting happens entirely in your browser, so your queries are never uploaded." },
    ],
    related: ["json-formatter", "json-to-typescript", "regex-tester"],
  },
  {
    slug: "xml-formatter",
    name: "XML Formatter",
    tagline: "Beautify, indent, and validate XML.",
    description:
      "Free online XML formatter and beautifier. Pretty-print, indent, minify, and validate XML instantly and privately in your browser.",
    keywords: ["xml formatter", "xml beautifier", "format xml", "xml validator", "pretty print xml"],
    icon: FileCodeIcon,
    intro:
      "Turn cramped or minified XML into clean, indented, readable markup — or minify it back down. Invalid XML is flagged with the parser error. Everything runs in your browser, so your data stays private.",
    steps: ["Paste your XML.", "Click Format to indent it, or Minify to compact it.", "Copy the result."],
    faqs: [
      { q: "Does it validate my XML?", a: "Yes — if the XML is malformed, the tool shows the parser error instead of formatting it." },
      { q: "Is my XML uploaded?", a: "No — parsing and formatting happen entirely in your browser." },
    ],
    related: ["json-formatter", "code-beautifier", "json-to-csv"],
  },
  {
    slug: "code-beautifier",
    name: "Code Beautifier",
    tagline: "Format JavaScript, CSS, HTML, and JSON.",
    description:
      "Free online code beautifier. Format and indent messy JavaScript, TypeScript, CSS, HTML, and JSON — instantly and privately in your browser.",
    keywords: ["code beautifier", "javascript beautifier", "css beautifier", "html formatter", "js beautifier"],
    icon: WandSparklesIcon,
    intro:
      "Clean up minified or messy code into readable, properly indented source. Supports JavaScript, TypeScript, JSON, CSS/SCSS/LESS, and HTML. It all runs in your browser, so your code is never uploaded.",
    steps: ["Paste your code.", "Pick the language.", "Beautify it and copy the result."],
    faqs: [
      { q: "Which languages are supported?", a: "JavaScript, TypeScript, JSON, CSS (including SCSS/LESS), and HTML." },
      { q: "Is my code sent anywhere?", a: "No — formatting runs entirely in your browser, so your code stays on your device." },
    ],
    related: ["json-formatter", "sql-formatter", "xml-formatter"],
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    tagline: "Draw or upload a signature and place it on a PDF.",
    description:
      "Free online PDF signer. Draw or upload your signature, place it anywhere on a PDF, and download — privately in your browser, nothing uploaded.",
    keywords: ["sign pdf", "sign pdf online", "add signature to pdf", "esign pdf", "pdf signature"],
    icon: SignatureIcon,
    intro:
      "Add your signature to a PDF without printing and scanning. Draw it with your mouse or trackpad, or upload a signature image, then place it on any page. Everything happens in your browser, so your document is never uploaded — ideal for contracts and forms.",
    steps: [
      "Choose your PDF.",
      "Draw your signature or upload an image.",
      "Pick the page and position, then sign and download.",
    ],
    faqs: [
      { q: "Is my document uploaded to sign it?", a: "No — the PDF is opened and signed entirely in your browser, so it never leaves your device. That makes it safe for sensitive contracts." },
      { q: "Can I use an existing signature image?", a: "Yes — switch to &quot;Upload image&quot; and use a PNG of your signature (a transparent background looks best)." },
    ],
    related: ["merge-pdf", "watermark-pdf", "pdf-page-numbers"],
  },
  {
    slug: "markdown-to-html",
    name: "Markdown to HTML",
    tagline: "Convert Markdown to clean HTML with a live preview.",
    description:
      "Free online Markdown to HTML converter. Turn Markdown into clean HTML with a live preview — instantly and privately in your browser.",
    keywords: ["markdown to html", "md to html", "markdown converter", "markdown preview", "convert markdown"],
    icon: FileTypeIcon,
    intro:
      "Convert Markdown into clean HTML and preview the rendered result side by side. Great for blogs, docs, and README files. Everything runs in your browser, so your content stays private.",
    steps: ["Type or paste your Markdown.", "See the HTML and a live preview.", "Copy the HTML."],
    faqs: [
      { q: "What Markdown features are supported?", a: "Standard Markdown — headings, bold/italic, links, lists, code blocks, blockquotes, tables, and more." },
      { q: "Is my content uploaded?", a: "No — conversion happens entirely in your browser." },
    ],
    related: ["html-to-markdown", "code-beautifier", "html-entities"],
  },
  {
    slug: "html-to-markdown",
    name: "HTML to Markdown",
    tagline: "Convert HTML into clean Markdown.",
    description:
      "Free online HTML to Markdown converter. Turn HTML into clean, readable Markdown — instantly and privately in your browser.",
    keywords: ["html to markdown", "html to md", "convert html to markdown", "markdown from html"],
    icon: FileTextIcon,
    intro:
      "Convert HTML into clean Markdown — perfect for moving web content into docs, READMEs, or a CMS. Headings, links, lists, and code blocks are preserved. It all runs in your browser.",
    steps: ["Paste your HTML.", "Get the Markdown instantly.", "Copy the result."],
    faqs: [
      { q: "Does it keep links and formatting?", a: "Yes — headings, bold/italic, links, lists, and fenced code blocks are converted to their Markdown equivalents." },
      { q: "Is my HTML sent anywhere?", a: "No — the conversion runs locally in your browser." },
    ],
    related: ["markdown-to-html", "strip-html", "html-entities"],
  },
  {
    slug: "text-to-pdf",
    name: "Text to PDF",
    tagline: "Turn plain text into a clean, selectable PDF.",
    description:
      "Free online text to PDF converter. Turn plain text into a clean PDF with selectable text, choosing the page size and font — in your browser.",
    keywords: ["text to pdf", "txt to pdf", "convert text to pdf", "create pdf from text"],
    icon: FileOutputIcon,
    intro:
      "Turn plain text or notes into a tidy PDF with real, selectable text (not an image). Choose A4 or Letter and the font size, and it paginates automatically. Everything runs in your browser.",
    steps: ["Paste your text.", "Pick the page size and font size.", "Create and download the PDF."],
    faqs: [
      { q: "Is the text selectable in the PDF?", a: "Yes — the text is drawn as real text, so it stays selectable and searchable (not rasterized)." },
      { q: "Does it handle long text?", a: "Yes — lines wrap to the page width and new pages are added automatically." },
    ],
    related: ["images-to-pdf", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "office-to-pdf",
    name: "Office to PDF (Word, Excel, PowerPoint)",
    tagline: "Convert Word, PowerPoint, and Excel files to PDF.",
    description:
      "Convert Word (DOCX), PowerPoint (PPTX), and Excel (XLSX) documents to PDF online. High-fidelity Office to PDF conversion for OhoTool Pro.",
    keywords: ["office to pdf", "doc to pdf", "docx to pdf", "ppt to pdf", "xls to pdf", "convert to pdf"],
    icon: FileInputIcon,
    intro:
      "Convert Microsoft Office documents — Word, PowerPoint, and Excel — into clean, high-fidelity PDFs. Because faithful Office conversion needs a real document engine, this tool processes your file securely on our server (unlike our in-browser tools) and is available on OhoTool Pro.",
    steps: [
      "Sign in with a Pro account.",
      "Upload a Word, PowerPoint, or Excel file.",
      "Convert and download the PDF.",
    ],
    faqs: [
      { q: "Which formats are supported?", a: "Word (.doc, .docx), PowerPoint (.ppt, .pptx), Excel (.xls, .xlsx), and OpenDocument (.odt, .ods, .odp) — converted to PDF." },
      { q: "Why isn't this done in my browser like your other tools?", a: "Faithful Office-to-PDF conversion requires a full document engine that can't run in the browser, so the file is processed securely on our server and then deleted. That's why it's a Pro feature." },
      { q: "Is my document kept?", a: "No — it's used only to perform the conversion and is not stored afterward." },
    ],
    related: ["merge-pdf", "compress-pdf", "images-to-pdf"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    tagline: "Convert Word documents (DOC, DOCX) to PDF.",
    description:
      "Convert Word to PDF online. Turn DOC and DOCX documents into high-fidelity PDFs — an OhoTool Pro feature.",
    keywords: ["word to pdf", "doc to pdf", "docx to pdf", "convert word to pdf", "word document to pdf"],
    icon: FileTextIcon,
    intro:
      "Convert a Microsoft Word document (.doc or .docx) into a clean, high-fidelity PDF that looks exactly right on any device. Because faithful conversion needs a real document engine, your file is processed securely on our server (then deleted). Available on OhoTool Pro.",
    steps: ["Sign in with Pro.", "Upload your Word document.", "Convert and download the PDF."],
    faqs: [
      { q: "Does it keep my formatting?", a: "Yes — fonts, layout, images, and styles are preserved for a faithful PDF." },
      { q: "Is my document stored?", a: "No — it's used only for the conversion and deleted afterward." },
    ],
    related: ["office-to-pdf", "pdf-to-word", "merge-pdf"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    tagline: "Convert PowerPoint (PPT, PPTX) to PDF.",
    description:
      "Convert PowerPoint to PDF online. Turn PPT and PPTX slide decks into shareable PDFs — an OhoTool Pro feature.",
    keywords: ["ppt to pdf", "pptx to pdf", "powerpoint to pdf", "convert powerpoint to pdf", "slides to pdf"],
    icon: PresentationIcon,
    intro:
      "Convert a PowerPoint deck (.ppt or .pptx) into a PDF that's easy to share and prints cleanly — one slide per page. Your file is processed securely on our server and then deleted. Available on OhoTool Pro.",
    steps: ["Sign in with Pro.", "Upload your PowerPoint file.", "Convert and download the PDF."],
    faqs: [
      { q: "Will each slide become a page?", a: "Yes — every slide is rendered as its own page in the PDF." },
      { q: "Is my file kept?", a: "No — it's only used to perform the conversion and isn't stored." },
    ],
    related: ["office-to-pdf", "excel-to-pdf", "merge-pdf"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    tagline: "Convert Excel spreadsheets (XLS, XLSX) to PDF.",
    description:
      "Convert Excel to PDF online. Turn XLS and XLSX spreadsheets into clean PDFs — an OhoTool Pro feature.",
    keywords: ["excel to pdf", "xls to pdf", "xlsx to pdf", "convert excel to pdf", "spreadsheet to pdf"],
    icon: SheetIcon,
    intro:
      "Convert an Excel spreadsheet (.xls or .xlsx) into a PDF for easy sharing and printing. Your file is processed securely on our server and then deleted. Available on OhoTool Pro.",
    steps: ["Sign in with Pro.", "Upload your Excel file.", "Convert and download the PDF."],
    faqs: [
      { q: "Which formats are supported?", a: "Excel .xls and .xlsx, plus OpenDocument .ods and CSV." },
      { q: "Is my spreadsheet stored?", a: "No — it's used only for the conversion and deleted afterward." },
    ],
    related: ["office-to-pdf", "word-to-pdf", "merge-pdf"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    tagline: "Convert a PDF into an editable Word document.",
    description:
      "Convert PDF to Word online. Turn a PDF into an editable DOCX document while keeping the layout — an OhoTool Pro feature.",
    keywords: ["pdf to word", "pdf to docx", "convert pdf to word", "pdf to doc", "pdf to editable word"],
    icon: FileType2Icon,
    intro:
      "Turn a PDF into an editable Microsoft Word (.docx) document, keeping the text and layout so you can make changes. Your file is processed securely on our server and then deleted. Available on OhoTool Pro.",
    steps: ["Sign in with Pro.", "Upload your PDF.", "Convert and download the editable Word file."],
    faqs: [
      { q: "Will the result be editable?", a: "Yes — you get a .docx you can open and edit in Word, Google Docs, or Pages." },
      { q: "How accurate is the layout?", a: "It uses high-fidelity conversion, though very complex layouts and scanned PDFs may need minor cleanup." },
    ],
    related: ["office-to-pdf", "word-to-pdf", "pdf-to-images"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "heic-to-jpg",
    name: "HEIC to JPG",
    tagline: "Convert iPhone HEIC photos to JPG.",
    description:
      "Convert HEIC to JPG online. Turn iPhone HEIC/HEIF photos into universally compatible JPG images — an OhoTool Pro feature.",
    keywords: ["heic to jpg", "convert heic to jpg", "heic to jpeg", "iphone photo to jpg", "heic converter"],
    icon: CameraIcon,
    intro:
      "Convert Apple HEIC/HEIF photos (the default iPhone format) into JPG images that open everywhere. Browsers can't decode HEIC, so your photo is processed securely on our server and then deleted. Available on OhoTool Pro.",
    steps: ["Sign in with Pro.", "Upload a .heic photo.", "Convert and download the JPG."],
    faqs: [
      { q: "Why can't this run in my browser?", a: "Web browsers can't decode Apple's HEIC format, so the conversion is done on our server (and the file is deleted afterward). That's why it's a Pro feature." },
      { q: "Will I lose quality?", a: "The image is converted at high quality; JPG is lossy but the difference is typically invisible." },
    ],
    related: ["heic-to-png", "image-converter", "compress-image"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "heic-to-png",
    name: "HEIC to PNG",
    tagline: "Convert iPhone HEIC photos to PNG.",
    description:
      "Convert HEIC to PNG online. Turn iPhone HEIC/HEIF photos into lossless PNG images — an OhoTool Pro feature.",
    keywords: ["heic to png", "convert heic to png", "heic to png converter", "iphone photo to png"],
    icon: ImagesIcon,
    intro:
      "Convert Apple HEIC/HEIF photos into lossless PNG images that work everywhere. Because browsers can't decode HEIC, your photo is processed securely on our server and then deleted. Available on OhoTool Pro.",
    steps: ["Sign in with Pro.", "Upload a .heic photo.", "Convert and download the PNG."],
    faqs: [
      { q: "JPG or PNG for HEIC photos?", a: "JPG gives much smaller files for photos; choose PNG only if you need lossless quality or transparency." },
      { q: "Is my photo kept?", a: "No — it's used only for the conversion and deleted afterward." },
    ],
    related: ["heic-to-jpg", "image-converter", "compress-image"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "pdf-to-text",
    name: "PDF to Text",
    tagline: "Extract the text from a PDF.",
    description:
      "Free online PDF to text converter. Extract all the text from a PDF and copy it — privately in your browser, nothing uploaded.",
    keywords: ["pdf to text", "extract text from pdf", "pdf to txt", "copy text from pdf", "pdf text extractor"],
    icon: FileTextIcon,
    intro:
      "Pull the text out of a PDF so you can copy, edit, or reuse it. It reads the PDF directly in your browser — nothing is uploaded. Note: scanned (image-only) PDFs have no selectable text to extract.",
    steps: ["Choose a PDF.", "The text is extracted automatically.", "Copy the extracted text."],
    faqs: [
      { q: "Does it work on scanned PDFs?", a: "No — scanned PDFs are images with no embedded text. This extracts text from PDFs that contain real (selectable) text." },
      { q: "Is my PDF uploaded?", a: "No — the text is extracted locally in your browser, so the file never leaves your device." },
    ],
    related: ["pdf-to-images", "split-pdf", "strip-html"],
  },
  {
    slug: "image-to-text",
    name: "Image to Text (OCR)",
    tagline: "Extract text from images, photos, and scans.",
    description:
      "Convert image to text online with OCR. Extract text from photos, screenshots, and scanned documents (JPG, PNG) — an OhoTool Pro feature.",
    keywords: ["image to text", "photo to text", "ocr online", "extract text from image", "picture to text"],
    icon: ScanTextIcon,
    intro:
      "Pull the text out of an image, screenshot, photo, or scanned document using optical character recognition (OCR). Accurate OCR needs a real recognition engine, so your image is processed securely on our server and then deleted. Available on OhoTool Pro.",
    steps: ["Sign in with Pro.", "Upload an image or photo of text.", "Extract and copy the recognized text."],
    faqs: [
      { q: "What images work best?", a: "Clear, well-lit images and scans with readable text. Higher resolution and good contrast improve accuracy." },
      { q: "Why isn't this free/in-browser like your other tools?", a: "Accurate OCR requires a machine-learning engine that can't run in the browser, so it's processed on our server (and the image is deleted afterward). That's why it's a Pro feature." },
    ],
    related: ["pdf-to-text", "image-converter", "strip-html"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "url-to-pdf",
    name: "URL to PDF",
    tagline: "Save any web page as a PDF.",
    description:
      "Convert a URL to PDF online. Save any web page as a high-fidelity PDF, rendered on our server — an OhoTool Pro feature.",
    keywords: ["url to pdf", "webpage to pdf", "website to pdf", "save web page as pdf", "html page to pdf"],
    icon: Globe2Icon,
    intro:
      "Turn any web page into a clean PDF — great for archiving articles, receipts, and documentation. The page is rendered on our server with a real browser engine for high fidelity (then discarded). Available on OhoTool Pro.",
    steps: ["Sign in with Pro.", "Paste the page URL.", "Convert and download the PDF."],
    faqs: [
      { q: "Does it capture the whole page?", a: "Yes — the full rendered page is captured, not just the visible part, using a real browser engine on our server." },
      { q: "Can it open pages behind a login?", a: "No — it can only render publicly accessible URLs, since it fetches the page from our server." },
    ],
    related: ["merge-pdf", "compress-pdf", "office-to-pdf"],
    pro: true,
    serverSide: true,
  },
];

export function getTool(slug: string) {
  return devTools.find((t) => t.slug === slug);
}

/** A stable anchor id for a category section on the /tools hub. */
export function categoryAnchor(name: string) {
  return "cat-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Find the category a tool belongs to (for breadcrumbs). */
export function getToolCategory(slug: string) {
  return toolCategories.find((c) => c.slugs.includes(slug));
}

// Grouping for the hub — improves navigation and topical SEO structure.
export const toolCategories: { name: string; blurb: string; slugs: string[] }[] = [
  {
    name: "Developer",
    blurb: "Format, inspect, and test.",
    slugs: [
      "json-formatter",
      "sql-formatter",
      "xml-formatter",
      "code-beautifier",
      "json-to-typescript",
      "jwt-decoder",
      "regex-tester",
      "cron-explainer",
      "chmod-calculator",
      "cidr-calculator",
      "credit-card-validator",
      "password-strength-checker",
    ],
  },
  {
    name: "Web & SEO",
    blurb: "Ship and market your site.",
    slugs: ["utm-builder", "meta-tag-generator", "favicon-generator"],
  },
  {
    name: "Converters",
    blurb: "Transform between formats.",
    slugs: [
      "unit-converter",
      "timezone-converter",
      "json-yaml",
      "markdown-to-html",
      "html-to-markdown",
      "image-converter",
      "image-resizer",
      "compress-image",
      "bulk-image-converter",
      "heic-to-jpg",
      "heic-to-png",
      "image-to-text",
      "base64",
      "url-encoder",
      "html-entities",
      "string-escape",
      "json-to-csv",
      "image-to-base64",
      "text-to-binary",
      "number-base-converter",
      "roman-numeral",
      "color-converter",
      "timestamp-converter",
    ],
  },
  {
    name: "PDF",
    blurb: "Merge, split, edit, and create PDFs.",
    slugs: [
      "merge-pdf",
      "split-pdf",
      "compress-pdf",
      "pdf-to-images",
      "pdf-to-text",
      "images-to-pdf",
      "text-to-pdf",
      "url-to-pdf",
      "office-to-pdf",
      "word-to-pdf",
      "powerpoint-to-pdf",
      "excel-to-pdf",
      "pdf-to-word",
      "sign-pdf",
      "rotate-pdf",
      "delete-pdf-pages",
      "pdf-page-numbers",
      "watermark-pdf",
    ],
  },
  {
    name: "Calculators",
    blurb: "Everyday math, money, and dates.",
    slugs: [
      "percentage-calculator",
      "tip-calculator",
      "discount-calculator",
      "gst-vat-calculator",
      "loan-calculator",
      "bmi-calculator",
      "bmr-calculator",
      "gpa-calculator",
      "aspect-ratio-calculator",
      "age-calculator",
      "date-difference",
    ],
  },
  {
    name: "Text",
    blurb: "Work with words and strings.",
    slugs: [
      "word-counter",
      "case-converter",
      "find-replace",
      "remove-line-breaks",
      "strip-html",
      "word-frequency",
      "text-repeater",
      "slugify",
      "line-sorter",
      "text-diff",
      "lorem-ipsum",
    ],
  },
  {
    name: "Generators",
    blurb: "Create codes, styles, and values.",
    slugs: [
      "qr-code",
      "bulk-qr-generator",
      "wifi-qr",
      "css-gradient-generator",
      "box-shadow-generator",
      "color-shades-generator",
      "password-generator",
      "random-string",
      "random-number-generator",
      "uuid-generator",
      "hash-generator",
    ],
  },
];
