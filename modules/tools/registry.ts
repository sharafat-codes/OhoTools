import {
  BracesIcon,
  BinaryIcon,
  ContrastIcon,
  DivideIcon,
  Disc3Icon,
  FingerprintIcon,
  GitCommitVerticalIcon,
  IdCardIcon,
  ImageUpscaleIcon,
  KeyRoundIcon,
  LockKeyholeIcon,
  MonitorIcon,
  ShuffleIcon,
  TerminalIcon,
  TrendingUpIcon,
  TypeIcon,
  TypeOutlineIcon,
  WeightIcon,
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
  ScrollTextIcon,
  LanguagesIcon,
  LaughIcon,
  ScanLineIcon,
  EraserIcon,
  PenToolIcon,
  Minimize2Icon,
  SpellCheckIcon,
  FilmIcon,
  VideoIcon,
  Music2Icon,
  AudioLinesIcon,
  ListMusicIcon,
  Volume2Icon,
  CropIcon,
  CircleUserRoundIcon,
  ExpandIcon,
  MailIcon,
  PackageIcon,
  NotebookPenIcon,
  TimerIcon,
  HourglassIcon,
  AlarmClockIcon,
  RocketIcon,
  BriefcaseIcon,
  UserRoundIcon,
  HeadingIcon,
  MessagesSquareIcon,
  BookOpenIcon,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

import { SITE_URL, SITE_NAME } from "@/lib/site";
import { conversionTools, conversionSlugs } from "@/modules/tools/conversions";
import { imageFormatTools, imageFormatSlugs } from "@/modules/tools/image-formats";
import { gameTools, gameSlugs } from "@/modules/tools/games";
import { extraTools } from "@/modules/tools/extras";

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

const baseDevTools: DevTool[] = [
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
    related: ["url-encoder", "jwt-decoder", "hash-generator"],
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
    related: ["word-frequency", "case-converter", "text-diff"],
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
    related: ["word-counter", "word-frequency", "slugify"],
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
      { q: "Should I use SHA-256 to hash passwords?", a: "No. SHA hashes are fast and unsalted, which makes them easy to brute-force — and frameworks like Laravel won't accept them. For passwords use a slow, salted algorithm like bcrypt (see our Bcrypt Generator)." },
    ],
    related: ["bcrypt-generator", "password-generator", "base64"],
  },
  {
    slug: "bcrypt-generator",
    name: "Bcrypt Generator",
    tagline: "Generate and verify bcrypt password hashes — Laravel & PHP compatible.",
    description:
      "Free online bcrypt generator and verifier. Create Laravel- and PHP-compatible $2y$ password hashes with a custom cost factor, and check a password against a hash — all in your browser.",
    keywords: [
      "bcrypt generator",
      "bcrypt hash",
      "laravel password hash",
      "bcrypt online",
      "password_hash",
      "bcrypt verify",
    ],
    icon: LockKeyholeIcon,
    intro:
      "Hash a password with bcrypt the same way Laravel's Hash::make() and PHP's password_hash() do, then paste the $2y$ result straight into your database. Pick a cost factor, or switch to Verify to check whether a plain password matches an existing hash. Everything runs locally in your browser — nothing is uploaded.",
    steps: [
      "Enter the password and choose a cost factor (12 matches Laravel's default).",
      "Keep the $2y$ prefix for Laravel/PHP, then click Generate.",
      "Copy the hash into your users.password column — or use Verify to test a password against a hash.",
    ],
    faqs: [
      {
        q: "Why didn't my hash work in Laravel?",
        a: "A plain SHA-256 or MD5 digest won't authenticate — Laravel stores bcrypt hashes that start with $2y$. This tool produces exactly that format, so it drops straight into the password column and passes Hash::check().",
      },
      {
        q: "What's the difference between $2y$, $2b$, and $2a$?",
        a: "They're all the same bcrypt algorithm — only the version marker differs. PHP and Laravel write $2y$, Node libraries use $2b$, and $2a$ is legacy. A $2y$ hash verifies everywhere, which is why it's the default here.",
      },
      {
        q: "Why does the hash change every time?",
        a: "bcrypt mixes in a random salt on each run, so the same password produces a different hash each time. That's by design — the salt and cost are stored inside the hash string, so verification still works.",
      },
      {
        q: "Which cost factor should I use?",
        a: "12 is Laravel's current default and a good balance. Higher values are more resistant to brute force but slower to compute and verify.",
      },
    ],
    related: ["hash-generator", "password-generator", "password-strength-checker"],
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
    related: ["word-frequency", "word-counter", "case-converter"],
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
    name: "Word Frequency & Keyword Density Counter",
    tagline: "Count word frequency and keyword density in any text.",
    description:
      "Free word frequency and keyword density counter. See how often each word appears and its share of your content (density %), with a common-word filter for on-page SEO. Runs in your browser, with CSV export.",
    keywords: [
      "word frequency counter",
      "keyword frequency counter",
      "keyword density checker",
      "keyword density tool",
      "word frequency",
      "count word occurrences",
    ],
    icon: BarChart3Icon,
    intro:
      "Analyze any text to see how often each word appears and its keyword density — each word's percentage share of the total content — ranked with a visual bar. Filter out common stop words for on-page SEO analysis, or keep them for style and readability checks. Export the full list as CSV.",
    steps: [
      "Paste your text.",
      "Optionally ignore case, hide common words, or set a minimum word length.",
      "Review each word's count and density %, or copy the list as CSV.",
    ],
    faqs: [
      { q: "What is keyword density?", a: "Keyword density is how often a word appears as a percentage of the total words — count ÷ total words × 100. It's used in on-page SEO to check a page isn't over- or under-using a target keyword." },
      { q: "How do I ignore filler words?", a: "Turn on 'Ignore common words' to exclude stop words like 'the', 'and', and 'of', so the ranking shows the meaningful keywords in your content." },
      { q: "Can I export the results?", a: "Yes — click Copy CSV to get the complete word, count, and density list, ready for a spreadsheet." },
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
    slug: "svg-to-png",
    name: "SVG to PNG",
    tagline: "Convert SVG files to PNG, JPG, or WebP.",
    description:
      "Free online SVG converter. Turn an SVG into a crisp PNG, JPG, or WebP at any scale — all in your browser, nothing uploaded.",
    keywords: [
      "svg to png",
      "svg to jpg",
      "svg to webp",
      "svg converter",
      "convert svg to image",
      "svg to png converter",
    ],
    icon: FileImageIcon,
    intro:
      "Upload an SVG and export it as a PNG, JPG, or WebP at the exact size you need. Pick a scale (1×, 2×, 3×) to render sharp, high-resolution output — everything runs in your browser, so your file is never uploaded.",
    steps: [
      "Choose or drop an SVG file.",
      "Pick the output format and a scale.",
      "Download the rasterized image.",
    ],
    faqs: [
      { q: "Is my SVG uploaded to a server?", a: "No — the SVG is rendered to a canvas and exported entirely in your browser, so the file never leaves your device." },
      { q: "Can I export at a higher resolution?", a: "Yes — choose a 2×, 3×, or 4× scale to render the SVG larger for crisp, high-DPI output." },
      { q: "What happens to transparency in JPG?", a: "JPG has no transparency, so transparent areas are filled with white. Choose PNG or WebP to keep transparency." },
    ],
    related: ["svg-to-image", "image-converter", "image-resizer"],
  },
  {
    slug: "svg-to-image",
    name: "SVG Code to Image",
    tagline: "Paste SVG code and export it as PNG or JPG.",
    description:
      "Free online SVG code to image converter. Paste SVG markup, preview it live, and download it as a PNG, JPG, or WebP — privately in your browser.",
    keywords: [
      "svg code to png",
      "svg code to image",
      "svg to image",
      "render svg online",
      "svg markup to png",
      "convert svg code",
    ],
    icon: CodeXmlIcon,
    intro:
      "Paste raw SVG markup, see a live preview, and export it as a PNG, JPG, or WebP at any scale. Great for turning an icon or illustration snippet into a shareable image — all in your browser, nothing uploaded.",
    steps: [
      "Paste your SVG code.",
      "Check the live preview, then pick a format and scale.",
      "Download the image.",
    ],
    faqs: [
      { q: "Does my SVG code get sent anywhere?", a: "No — the markup is rendered and exported locally in your browser; nothing is uploaded." },
      { q: "Why isn't my SVG rendering?", a: "Make sure it's a complete, valid <svg>…</svg> element with a width/height or viewBox. Images or fonts referenced by external URL may not render, for security reasons." },
      { q: "Can I control the output size?", a: "Yes — pick a scale multiplier to render larger, sharper output than the SVG's intrinsic size." },
    ],
    related: ["svg-to-png", "image-converter", "add-text-to-image"],
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
      "Free online OCR — convert image to text right in your browser. Extract text from photos, screenshots, and scanned documents in JPG, PNG, WebP, GIF, or BMP. Private: your image never leaves your device.",
    keywords: ["image to text", "photo to text", "ocr online", "extract text from image", "ocr extraction", "picture to text"],
    icon: ScanTextIcon,
    intro:
      "Pull the text out of an image, screenshot, photo, or scanned document using optical character recognition (OCR). Works with JPG, PNG, WebP, GIF, and BMP images. It runs entirely in your browser — your image is never uploaded, so it stays completely private. The recognition engine downloads once on first use, then works offline.",
    steps: ["Upload an image or photo of text (JPG, PNG, WebP, GIF, or BMP).", "Click Extract text (the engine loads on first use).", "Copy the recognized text."],
    faqs: [
      { q: "Which image formats are supported?", a: "JPG, PNG, WebP, GIF, and BMP. For best results use a clear, high-contrast image of real text." },
      { q: "Is my image uploaded anywhere?", a: "No — recognition happens locally in your browser using an in-page OCR engine, so the image never leaves your device." },
      { q: "What images work best?", a: "Clear, well-lit photos and scans of real text with good contrast. Stylized graphics, decorative fonts, and low-resolution images are harder to read accurately." },
      { q: "Why does the first run take a moment?", a: "The OCR engine (a few MB) downloads once on your first extraction, then it's cached for instant use afterward." },
    ],
    related: ["pdf-to-text", "image-converter", "strip-html"],
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
  {
    slug: "ai-summarizer",
    name: "AI Summarizer",
    tagline: "Summarize any text in seconds.",
    description:
      "Free AI text summarizer. Paste an article, report, or document and get a concise summary or key bullet points — powered by advanced AI. Free daily runs; unlimited on Pro.",
    keywords: ["ai summarizer", "text summarizer", "summarize text", "tl;dr generator", "summary generator"],
    icon: ScrollTextIcon,
    intro:
      "Turn long text into a clear summary or bullet-point takeaways. Paste an article, meeting notes, or a report and get the gist in seconds — powered by advanced AI. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your text.", "Choose the length and format.", "Summarize and copy the result."],
    faqs: [
      { q: "What can I summarize?", a: "Articles, reports, transcripts, emails, notes — any text up to about 20,000 characters per run." },
      { q: "Is my text stored?", a: "No — your text is sent to the AI model to generate the summary and is not stored on our servers afterward." },
    ],
    related: ["ai-paraphraser", "ai-translator", "word-counter"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "ai-paraphraser",
    name: "AI Paraphraser",
    tagline: "Rewrite text in any tone.",
    description:
      "Free AI paraphrasing tool. Rewrite and rephrase text while keeping the meaning — choose a professional, casual, or concise tone. Powered by advanced AI. Free daily runs; unlimited on Pro.",
    keywords: ["ai paraphraser", "paraphrasing tool", "rewrite text", "rephrase text", "reword"],
    icon: WandSparklesIcon,
    intro:
      "Rephrase text without losing its meaning — great for polishing emails, rewording drafts, or adjusting tone. Pick a style and let AI rewrite it. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your text.", "Pick a tone.", "Rewrite and copy the result."],
    faqs: [
      { q: "Will it keep my meaning?", a: "Yes — the paraphraser preserves your original meaning and key details while changing the wording and tone." },
      { q: "Is my text stored?", a: "No — your text is sent to the AI model to rewrite it and is not stored on our servers afterward." },
    ],
    related: ["ai-summarizer", "ai-grammar-checker", "case-converter"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "ai-translator",
    name: "AI Translator",
    tagline: "Translate text into 20+ languages.",
    description:
      "Free AI translator. Translate text between English, Spanish, French, German, Chinese, Arabic, and more — with natural, context-aware results. Free daily runs; unlimited on Pro.",
    keywords: ["ai translator", "translate text", "language translator", "online translator", "translate english to spanish"],
    icon: LanguagesIcon,
    intro:
      "Translate text into 20+ languages with natural, context-aware results — powered by advanced AI. Great for messages, documents, and content. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your text.", "Choose the target language.", "Translate and copy the result."],
    faqs: [
      { q: "Which languages are supported?", a: "20+ major languages including Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Hindi, and more." },
      { q: "Is it better than a basic translator?", a: "It's context-aware, so it handles tone and idioms more naturally than word-for-word tools." },
    ],
    related: ["ai-summarizer", "ai-paraphraser", "image-to-text"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "ai-grammar-checker",
    name: "AI Grammar Checker",
    tagline: "Fix grammar, spelling & punctuation.",
    description:
      "Free AI grammar checker. Fix spelling, grammar, and punctuation while keeping your meaning and tone — powered by advanced AI. Free daily runs; unlimited on Pro.",
    keywords: ["ai grammar checker", "grammar checker", "spell checker", "fix grammar", "proofreader"],
    icon: SpellCheckIcon,
    intro:
      "Clean up spelling, grammar, and punctuation while keeping your voice intact — powered by advanced AI. Paste a draft and get a corrected version back. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your text.", "Run the checker.", "Copy the corrected text."],
    faqs: [
      { q: "Will it change my meaning?", a: "No — it corrects mechanics (spelling, grammar, punctuation) while preserving your meaning and tone." },
      { q: "Is my text stored?", a: "No — your text is sent to the AI model to correct it and is not stored on our servers afterward." },
    ],
    related: ["ai-paraphraser", "ai-summarizer", "word-counter"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "ai-humanizer",
    name: "AI Humanizer",
    tagline: "Make AI-generated text read naturally.",
    description:
      "Free AI humanizer. Rewrite AI-generated text so it reads naturally and human-written, while keeping the meaning. Free daily runs, unlimited on Pro.",
    keywords: ["ai humanizer", "humanize ai text", "make ai text sound human", "ai to human text", "humanize text"],
    icon: WandSparklesIcon,
    intro:
      "Paste AI-generated text and get a version that reads more naturally — varied sentences, natural phrasing, and none of the robotic, repetitive patterns — with the original meaning intact. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your text.", "Run the humanizer.", "Copy the natural-sounding result."],
    faqs: [
      { q: "Does it change the meaning?", a: "No — it rewrites the phrasing and flow for a more natural read while preserving your meaning and facts." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["ai-paraphraser", "tone-changer", "ai-grammar-checker"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "text-expander",
    name: "Text Expander",
    tagline: "Make text longer and more detailed.",
    description:
      "Free AI text expander. Turn short notes into longer, more detailed writing while keeping your meaning and tone. Free daily runs, unlimited on Pro.",
    keywords: ["text expander", "make text longer", "expand text", "sentence expander", "lengthen text"],
    icon: ExpandIcon,
    intro:
      "Turn brief notes or a short draft into a fuller, more detailed piece — with added explanation and examples, keeping your meaning and tone. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your short text.", "Run the expander.", "Copy the longer version."],
    faqs: [
      { q: "Will it invent facts?", a: "It adds explanation and detail around what you wrote and avoids inventing specific facts or figures." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["text-shortener", "ai-paraphraser", "ai-summarizer"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "text-shortener",
    name: "Text Shortener",
    tagline: "Shorten text while keeping the meaning.",
    description:
      "Free AI text shortener. Condense long text into a shorter version that keeps the key meaning and tone. Free daily runs, unlimited on Pro.",
    keywords: ["text shortener", "make text shorter", "shorten text", "sentence shortener", "condense text"],
    icon: ShrinkIcon,
    intro:
      "Trim wordy text down to a shorter, tighter version that keeps the key points and tone — great for fitting a limit or cutting fluff. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your text.", "Run the shortener.", "Copy the shorter version."],
    faqs: [
      { q: "Will it lose important points?", a: "It removes filler and redundancy while keeping the essential meaning of your text." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["text-expander", "ai-summarizer", "ai-paraphraser"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "tone-changer",
    name: "Tone Changer",
    tagline: "Rewrite text in a different tone.",
    description:
      "Free AI tone changer. Rewrite text in a professional, friendly, formal, casual, or confident tone while keeping the meaning. Free daily runs, unlimited on Pro.",
    keywords: ["tone changer", "change tone of text", "rewrite tone", "make text professional", "make text friendly"],
    icon: PaletteIcon,
    intro:
      "Paste your text and rewrite it in the tone you need — professional, friendly, formal, casual, confident, or empathetic — while keeping the meaning. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your text.", "Pick the tone.", "Run and copy the rewritten text."],
    faqs: [
      { q: "Which tones are available?", a: "Professional, friendly, formal, casual, confident, and empathetic — pick the one that fits." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["ai-paraphraser", "ai-humanizer", "ai-email-writer"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "ai-email-writer",
    name: "AI Email Writer",
    tagline: "Write clear emails from a few notes.",
    description:
      "Free AI email writer. Turn a few notes into a clear, well-structured email with the tone and length you choose. Free daily runs, unlimited on Pro.",
    keywords: ["ai email writer", "email generator", "write an email", "professional email generator", "email writing ai"],
    icon: MailIcon,
    intro:
      "Describe what you want to say and get a polished email back — with a subject line, greeting, and sign-off — in the tone and length you choose. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Describe the email (or paste a rough draft).", "Pick tone and length.", "Run and copy the email."],
    faqs: [
      { q: "Can it reply to an email?", a: "Yes — paste the message you received plus a note on how you want to respond, and it drafts a reply." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["tone-changer", "ai-paraphraser", "ai-grammar-checker"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "product-description-generator",
    name: "Product Description Generator",
    tagline: "Write product descriptions that sell.",
    description:
      "Free AI product description generator. Turn product details into a compelling, scannable description for your store. Free daily runs, unlimited on Pro.",
    keywords: ["product description generator", "ai product description", "ecommerce description writer", "write product description", "shopify description generator"],
    icon: PackageIcon,
    intro:
      "Enter your product name and a few features, and get a compelling, benefit-focused description ready for your store or marketplace. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Enter the product name and key features.", "Pick a tone.", "Run and copy the description."],
    faqs: [
      { q: "Will it make up specs?", a: "No — it writes around the details you provide and avoids inventing specifications, prices, or claims." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["caption-generator", "ai-paraphraser", "tone-changer"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "caption-generator",
    name: "Caption Generator",
    tagline: "Generate social media captions with hashtags.",
    description:
      "Free AI caption generator. Get engaging social media captions with hashtags for Instagram, LinkedIn, X, and more. Free daily runs, unlimited on Pro.",
    keywords: ["caption generator", "instagram caption generator", "social media caption", "ai captions", "hashtag caption generator"],
    icon: HashIcon,
    intro:
      "Describe your post or topic and get several ready-to-use caption options with relevant hashtags, tuned to the platform you choose. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Describe your post or topic.", "Pick the platform.", "Run and copy your favorite caption."],
    faqs: [
      { q: "Which platforms are supported?", a: "Instagram, LinkedIn, X (Twitter), Facebook, and TikTok — each with a fitting voice and hashtags." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["product-description-generator", "ai-paraphraser", "tone-changer"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "business-name-generator",
    name: "Business Name Generator",
    tagline: "Brainstorm brandable business names with AI.",
    description:
      "Free AI business name generator. Describe your business and get brandable, available-sounding name ideas in seconds. Free daily runs, unlimited on Pro.",
    keywords: ["business name generator", "company name generator", "brand name generator", "startup name ideas", "name generator"],
    icon: RocketIcon,
    intro:
      "Stuck on what to call your business? Describe what you do and get a batch of short, brandable name ideas to shortlist. Pick a style, run it as many times as you like for fresh options. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Describe your business, product, or industry.", "Pick a naming style.", "Generate and shortlist your favorites."],
    faqs: [
      { q: "Are the names available to register?", a: "Always check domain and trademark availability yourself — the tool suggests ideas but can't verify registration." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["slogan-generator", "caption-generator", "bio-generator"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "slogan-generator",
    name: "Slogan Generator",
    tagline: "Create catchy slogans and taglines.",
    description:
      "Free AI slogan generator. Describe your business or product and get catchy, memorable taglines. Free daily runs, unlimited on Pro.",
    keywords: ["slogan generator", "tagline generator", "catchphrase generator", "motto generator", "business slogan"],
    icon: MegaphoneIcon,
    intro:
      "Get a batch of catchy slogan and tagline ideas for your business or product — just describe it and pick a tone. Run it again for fresh angles. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Describe your business or product.", "Pick a tone.", "Generate and pick your favorite tagline."],
    faqs: [
      { q: "Can I use these commercially?", a: "Yes — but check that a slogan isn't already trademarked by someone else before you build a brand around it." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["business-name-generator", "caption-generator", "product-description-generator"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "cover-letter-generator",
    name: "Cover Letter Generator",
    tagline: "Write a tailored cover letter in seconds.",
    description:
      "Free AI cover letter generator. Enter the role and your background and get a polished, tailored cover letter. Free daily runs, unlimited on Pro.",
    keywords: ["cover letter generator", "ai cover letter", "write a cover letter", "cover letter maker", "job application letter"],
    icon: FileTextIcon,
    intro:
      "Turn the job details and your background into a polished, tailored cover letter — greeting, a strong opening, experience matched to the role, and a confident close. Pick a tone and edit to taste. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste the job description and your key experience.", "Pick a tone.", "Generate, then tweak and send."],
    faqs: [
      { q: "Will it make things up about me?", a: "It writes around the details you provide and avoids inventing employers, dates, or achievements — always review before sending." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["resume-summary-generator", "ai-email-writer", "ai-grammar-checker"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "resume-summary-generator",
    name: "Resume Summary Generator",
    tagline: "Write a strong resume summary or profile.",
    description:
      "Free AI resume summary generator. Turn your role, experience, and skills into a concise professional summary for your resume. Free daily runs, unlimited on Pro.",
    keywords: ["resume summary generator", "professional summary generator", "cv summary", "resume profile", "resume summary examples"],
    icon: BriefcaseIcon,
    intro:
      "Get a concise, results-oriented professional summary for the top of your resume — just enter your role, experience, and key skills, and pick your level. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Enter your role, experience, and skills.", "Pick your experience level.", "Generate and paste it into your resume."],
    faqs: [
      { q: "How long is the summary?", a: "Two to four punchy sentences — the ideal length for a resume profile that recruiters actually read." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["cover-letter-generator", "ai-paraphraser", "ai-grammar-checker"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "bio-generator",
    name: "Bio Generator",
    tagline: "Write a catchy bio for any profile.",
    description:
      "Free AI bio generator. Create a short, engaging bio for Instagram, LinkedIn, X, or any profile. Free daily runs, unlimited on Pro.",
    keywords: ["bio generator", "instagram bio generator", "linkedin bio generator", "profile bio", "social media bio"],
    icon: UserRoundIcon,
    intro:
      "Tell it a bit about yourself and get short, engaging bio options tuned to the platform — Instagram, LinkedIn, X, and more. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Describe yourself — what you do and your vibe.", "Pick the platform.", "Generate and pick your favorite bio."],
    faqs: [
      { q: "Does it fit character limits?", a: "It aims for the typical length of the platform you choose; trim as needed for hard limits." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["hashtag-generator", "caption-generator", "business-name-generator"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "hashtag-generator",
    name: "Hashtag Generator",
    tagline: "Get relevant hashtags for any post.",
    description:
      "Free AI hashtag generator. Enter a topic and get a mix of popular and niche hashtags for Instagram, TikTok, and more. Free daily runs, unlimited on Pro.",
    keywords: ["hashtag generator", "instagram hashtag generator", "tiktok hashtags", "hashtags for reels", "best hashtags"],
    icon: TagsIcon,
    intro:
      "Enter your topic or describe your post and get a set of relevant hashtags — a mix of popular and niche tags to widen reach. Choose how many you want. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Describe your post or topic.", "Choose how many hashtags.", "Generate and copy the set."],
    faqs: [
      { q: "How many hashtags should I use?", a: "It varies by platform — the tool lets you generate 10, 20, or 30 so you can match each network's best practice." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["caption-generator", "bio-generator", "headline-generator"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "headline-generator",
    name: "Headline Generator",
    tagline: "Generate click-worthy titles and headlines.",
    description:
      "Free AI headline generator. Get attention-grabbing titles for blog posts, YouTube videos, ads, and more. Free daily runs, unlimited on Pro.",
    keywords: ["headline generator", "title generator", "blog title generator", "youtube title generator", "ai headline"],
    icon: HeadingIcon,
    intro:
      "Enter your topic and get a batch of compelling headline options — for blog posts, YouTube videos, news, or ads. Varied angles, clear and clickable without the cheap clickbait. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Enter your topic or article summary.", "Pick the content type.", "Generate and choose the strongest headline."],
    faqs: [
      { q: "What kinds of headlines can it write?", a: "Blog posts, YouTube video titles, news headlines, and ad headlines — pick the type to match the format." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["ai-summarizer", "hashtag-generator", "faq-generator"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "faq-generator",
    name: "FAQ Generator",
    tagline: "Generate an FAQ from any topic or page.",
    description:
      "Free AI FAQ generator. Turn a topic, product, or page into a set of clear question-and-answer pairs — great for SEO and support. Free daily runs, unlimited on Pro.",
    keywords: ["faq generator", "faq maker", "questions and answers generator", "faq schema content", "generate faqs"],
    icon: MessagesSquareIcon,
    intro:
      "Paste a topic, product summary, or page content and get a ready-to-use FAQ — clear questions with concise answers. Great for support pages and SEO. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste your topic, product, or page content.", "Generate the FAQ.", "Copy the question-and-answer pairs."],
    faqs: [
      { q: "Will it invent facts like prices?", a: "No — it writes around what you provide and avoids inventing specifics like prices or policies, so review and fill those in." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["headline-generator", "ai-summarizer", "meta-tag-generator"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "simplify-text",
    name: "Simplify Text",
    tagline: "Rewrite complex text in plain language.",
    description:
      "Free AI text simplifier. Turn complex or jargon-heavy writing into clear, plain language anyone can understand. Free daily runs, unlimited on Pro.",
    keywords: ["simplify text", "text simplifier", "plain english converter", "explain simply", "make text easier to read"],
    icon: BookOpenIcon,
    intro:
      "Paste dense, technical, or jargon-heavy text and get a version that's easy to understand — short sentences, everyday words, meaning intact. Choose how simple you want it. Free users get a few runs a day; Pro is unlimited.",
    steps: ["Paste the text you want to simplify.", "Pick how simple to make it.", "Generate the plain-language version."],
    faqs: [
      { q: "Does it keep the meaning?", a: "Yes — it simplifies the wording and structure while preserving the key meaning of your text." },
      { q: "Is it free?", a: "You get a set number of free AI runs per day. Go Pro for unlimited use." },
    ],
    related: ["ai-summarizer", "ai-paraphraser", "text-shortener"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "screen-recorder",
    name: "Screen Recorder",
    tagline: "Record your screen in the browser — no watermark, no time limit, nothing uploaded.",
    description:
      "Free online screen recorder. Record your screen, a window, or a tab with audio and your mic — right in your browser. No sign-up, no watermark, no time limit, and nothing is uploaded.",
    keywords: ["screen recorder", "free screen recorder", "online screen recorder", "record screen online", "screen recorder no watermark"],
    icon: MonitorIcon,
    intro:
      "Record your screen, a window, or a browser tab — with system audio and your microphone if you want — entirely in your browser. No sign-up, no watermark, and no time limit. The recording is created on your device and never uploaded, then you download it as a video file.",
    steps: [
      "Choose whether to include your microphone, then click Start recording.",
      "Pick a screen, window, or tab to share (tick 'Share audio' to capture system sound).",
      "Pause or stop when done — preview and download your recording (.webm).",
    ],
    faqs: [
      { q: "Is it really free and without a watermark?", a: "Yes — no sign-up, no watermark, and no time limit. Unlike many recorders, it records locally in your browser, so there's nothing to pay for and nothing uploaded." },
      { q: "Does it record audio and my microphone?", a: "Yes. Tick 'Share audio' in the browser prompt to capture system/tab sound, and turn on the microphone toggle to add narration. Both are mixed into the recording." },
      { q: "Why is the file a .webm?", a: "Browsers record to WebM. It plays in most players and browsers — and if you need MP4, you can convert it for free with our Video to MP4 tool." },
      { q: "Does it work on my phone?", a: "Screen recording uses a browser feature that's only available on desktop browsers (Chrome, Edge, Firefox). On a phone, use your device's built-in screen recorder." },
    ],
    related: ["video-to-mp4", "compress-video", "trim-video"],
  },
  {
    slug: "video-to-gif",
    name: "Video to GIF",
    tagline: "Turn a video clip into an animated GIF.",
    description:
      "Free online video to GIF converter. Turn MP4, WebM, or MOV clips into animated GIFs right in your browser — choose the frame rate and size. Nothing is uploaded.",
    keywords: ["video to gif", "mp4 to gif", "convert video to gif", "gif maker", "webm to gif"],
    icon: FilmIcon,
    intro:
      "Convert a short video clip into an animated GIF — great for reactions, demos, and social posts. It runs entirely in your browser, so your video never leaves your device. Best for short clips.",
    steps: ["Choose a video.", "Pick the frame rate and width.", "Convert and download the GIF."],
    faqs: [
      { q: "Is my video uploaded?", a: "No — the conversion runs locally in your browser, so your video never leaves your device." },
      { q: "Why keep clips short?", a: "GIFs are large and processing happens in your browser, so short clips (a few seconds) give the best size and speed." },
    ],
    related: ["compress-video", "video-to-mp4", "image-converter"],
  },
  {
    slug: "video-to-mp4",
    name: "Video to MP4",
    tagline: "Convert WebM, MOV, MKV & more to MP4.",
    description:
      "Free online video converter. Convert WebM, MOV, MKV, AVI, and more to MP4 (H.264) right in your browser — no upload, no watermark.",
    keywords: ["video to mp4", "webm to mp4", "mov to mp4", "mkv to mp4", "video converter"],
    icon: VideoIcon,
    intro:
      "Convert videos to the universally-compatible MP4 (H.264) format — great for playback anywhere. It runs entirely in your browser, so your video never leaves your device. Best for short clips.",
    steps: ["Choose a video.", "Click Convert.", "Download the MP4."],
    faqs: [
      { q: "Which formats can I convert?", a: "WebM, MOV, MKV, AVI, and most common video formats — all converted to MP4 (H.264 video, AAC audio)." },
      { q: "Is my video uploaded?", a: "No — conversion runs locally in your browser; your video never leaves your device." },
    ],
    related: ["compress-video", "video-to-gif", "video-to-mp3"],
  },
  {
    slug: "compress-video",
    name: "Compress Video",
    tagline: "Shrink video file size in your browser.",
    description:
      "Free online video compressor. Reduce MP4 and other video file sizes right in your browser — pick a quality level. No upload, no watermark.",
    keywords: ["compress video", "video compressor", "reduce video size", "make video smaller", "shrink mp4"],
    icon: ShrinkIcon,
    intro:
      "Make a video smaller so it fits an upload limit or shares faster. Choose a quality level and compress — all in your browser, so your video never leaves your device. Best for short clips.",
    steps: ["Choose a video.", "Pick a quality level.", "Compress and download."],
    faqs: [
      { q: "How much smaller will it get?", a: "It depends on the source, but re-encoding at a higher compression level often cuts size substantially with little visible loss." },
      { q: "Is my video uploaded?", a: "No — compression runs locally in your browser; your video never leaves your device." },
    ],
    related: ["video-to-mp4", "video-to-gif", "compress-image"],
  },
  {
    slug: "trim-video",
    name: "Trim Video",
    tagline: "Cut a clip from your video.",
    description:
      "Free online video trimmer. Cut a start-to-end clip from any video right in your browser — fast, no upload, no watermark.",
    keywords: ["trim video", "cut video", "video trimmer", "video cutter", "clip video"],
    icon: ScissorsIcon,
    intro:
      "Cut out just the part you need by setting a start and end time. It runs entirely in your browser, so your video never leaves your device. Best for short clips.",
    steps: ["Choose a video.", "Drag the Start and End sliders to select the clip range.", "Trim and download the clip."],
    faqs: [
      { q: "How accurate is the cut?", a: "Trimming is fast and cuts to the nearest keyframe, so the start may shift by a fraction of a second." },
      { q: "Is my video uploaded?", a: "No — trimming runs locally in your browser; your video never leaves your device." },
    ],
    related: ["compress-video", "video-to-gif", "video-to-mp3"],
  },
  {
    slug: "video-to-mp3",
    name: "Video to MP3",
    tagline: "Extract audio from a video as MP3.",
    description:
      "Free online video to MP3 converter. Extract the audio track from any video as an MP3 right in your browser — pick the bitrate. No upload.",
    keywords: ["video to mp3", "extract audio from video", "mp4 to mp3", "video to audio", "convert video to mp3"],
    icon: Music2Icon,
    intro:
      "Pull the audio out of a video and save it as an MP3 — great for talks, music, and podcasts. It runs entirely in your browser, so your video never leaves your device.",
    steps: ["Choose a video.", "Pick the audio bitrate.", "Extract and download the MP3."],
    faqs: [
      { q: "What quality can I get?", a: "Choose 128, 192, or 320 kbps — higher bitrate means better quality and a larger file." },
      { q: "Is my video uploaded?", a: "No — extraction runs locally in your browser; your video never leaves your device." },
    ],
    related: ["video-to-mp4", "trim-video", "compress-video"],
  },
  {
    slug: "audio-converter",
    name: "Audio Converter",
    tagline: "Convert audio to MP3, WAV, or M4A.",
    description:
      "Free online audio converter. Convert MP3, WAV, M4A, and more between formats right in your browser — no upload, no watermark.",
    keywords: ["audio converter", "convert to mp3", "wav to mp3", "m4a to mp3", "audio format converter"],
    icon: AudioLinesIcon,
    intro:
      "Convert an audio file to MP3, WAV, or M4A — great for compatibility with any player or app. It runs entirely in your browser, so your audio never leaves your device.",
    steps: ["Choose an audio file.", "Pick the output format.", "Convert and download."],
    faqs: [
      { q: "Which formats are supported?", a: "You can convert most common audio files to MP3, WAV, or M4A (AAC)." },
      { q: "Is my audio uploaded?", a: "No — conversion runs locally in your browser, so your audio never leaves your device." },
    ],
    related: ["trim-audio", "merge-audio", "change-volume"],
  },
  {
    slug: "trim-audio",
    name: "Trim Audio",
    tagline: "Cut a clip from an audio file.",
    description:
      "Free online audio trimmer. Cut a start-to-end clip from any MP3 or audio file right in your browser — fast, no upload, no watermark.",
    keywords: ["trim audio", "cut audio", "audio trimmer", "mp3 cutter", "audio cutter online"],
    icon: ScissorsIcon,
    intro:
      "Keep just the part of an audio file you need by dragging a start and end point. It runs entirely in your browser, so your audio never leaves your device.",
    steps: ["Choose an audio file.", "Drag the Start and End sliders to select the clip.", "Trim and download."],
    faqs: [
      { q: "Does trimming re-compress my audio?", a: "No — it copies the selected span without re-encoding, so there's no quality loss and it's fast." },
      { q: "Is my audio uploaded?", a: "No — trimming runs locally in your browser; your audio never leaves your device." },
    ],
    related: ["audio-converter", "merge-audio", "change-volume"],
  },
  {
    slug: "merge-audio",
    name: "Merge Audio",
    tagline: "Join multiple audio files into one.",
    description:
      "Free online audio joiner. Combine multiple MP3 or audio files into a single track right in your browser — reorder them, no upload, no watermark.",
    keywords: ["merge audio", "join audio", "combine mp3", "audio joiner", "concatenate audio"],
    icon: ListMusicIcon,
    intro:
      "Combine several audio files into one continuous track — reorder them however you like. It runs entirely in your browser, so your files never leave your device. The result is saved as an MP3.",
    steps: ["Add two or more audio files.", "Drag to reorder them.", "Merge and download the combined MP3."],
    faqs: [
      { q: "Can I reorder the files?", a: "Yes — use the up/down arrows to set the order before merging." },
      { q: "Is my audio uploaded?", a: "No — merging runs locally in your browser; your files never leave your device." },
    ],
    related: ["trim-audio", "audio-converter", "change-volume"],
  },
  {
    slug: "change-volume",
    name: "Change Audio Volume",
    tagline: "Make audio louder, quieter, or normalized.",
    description:
      "Free online audio volume changer. Boost, reduce, or normalize the loudness of any audio file right in your browser — no upload, no watermark.",
    keywords: ["change audio volume", "make audio louder", "increase mp3 volume", "normalize audio", "audio volume booster"],
    icon: Volume2Icon,
    intro:
      "Turn an audio file up or down, or normalize it to a consistent loudness. It runs entirely in your browser, so your audio never leaves your device. The result is saved as an MP3.",
    steps: ["Choose an audio file.", "Pick louder, quieter, or normalize.", "Apply and download."],
    faqs: [
      { q: "What does normalize do?", a: "Normalize adjusts the whole track toward a standard loudness level — useful when a file is too quiet or uneven." },
      { q: "Is my audio uploaded?", a: "No — processing runs locally in your browser; your audio never leaves your device." },
    ],
    related: ["audio-converter", "trim-audio", "enhance-audio"],
  },
  {
    slug: "enhance-audio",
    name: "Audio Enhancer & Cleaner",
    tagline: "Reduce noise and make audio clearer.",
    description:
      "Free online audio enhancer and cleaner. Reduce background noise, enhance voice clarity, and normalize loudness right in your browser — no upload, no watermark.",
    keywords: ["audio enhancer", "clean audio", "reduce background noise", "noise reduction online", "improve audio quality", "enhance voice recording"],
    icon: WandSparklesIcon,
    intro:
      "Clean up a noisy recording — cut background hiss and hum, enhance voice clarity, and even out the loudness. It runs entirely in your browser, so your audio never leaves your device. The result is saved as an MP3.",
    steps: ["Choose an audio file.", "Pick an enhancement mode.", "Enhance and download the MP3."],
    faqs: [
      { q: "What does the noise reduction do?", a: "It applies a spectral denoiser that lowers steady background noise — hiss, fans, hum — while keeping the main sound intact." },
      { q: "Will it fix any recording?", a: "It helps most with mild-to-moderate background noise and quiet or uneven voice recordings. Very heavy noise or distortion can't be fully removed." },
      { q: "Is my audio uploaded?", a: "No — enhancement runs locally in your browser; your audio never leaves your device." },
    ],
    related: ["change-volume", "audio-converter", "trim-audio"],
  },
  {
    slug: "crop-image",
    name: "Crop Image",
    tagline: "Crop an image to any size or aspect ratio.",
    description:
      "Free online image cropper. Drag to crop any JPG, PNG, or WebP to the exact size or aspect ratio you need — right in your browser, no upload.",
    keywords: ["crop image", "image cropper", "crop photo online", "crop picture", "crop jpg"],
    icon: CropIcon,
    intro:
      "Crop an image down to just the part you want — drag the box, resize the corners, or pick an aspect ratio like 1:1 or 16:9. It runs entirely in your browser, so your image never leaves your device.",
    steps: ["Choose an image.", "Drag the crop box and resize the corners (or pick an aspect ratio).", "Crop and download."],
    faqs: [
      { q: "Is my image uploaded?", a: "No — cropping happens entirely in your browser; your image never leaves your device." },
      { q: "Does cropping reduce quality?", a: "No — it keeps the original pixels inside your selection at full quality (JPEGs are re-saved at high quality)." },
    ],
    related: ["rotate-image", "circle-crop", "image-resizer"],
  },
  {
    slug: "rotate-image",
    name: "Rotate & Flip Image",
    tagline: "Rotate or flip an image in your browser.",
    description:
      "Free online image rotator. Rotate an image left or right and flip it horizontally or vertically — right in your browser, no upload, no watermark.",
    keywords: ["rotate image", "flip image", "rotate photo", "flip photo horizontally", "turn image sideways"],
    icon: RotateCwIcon,
    intro:
      "Rotate an image 90° at a time or mirror it horizontally or vertically, with a live preview. It runs entirely in your browser, so your image never leaves your device.",
    steps: ["Choose an image.", "Rotate or flip until it looks right.", "Download the result."],
    faqs: [
      { q: "Is my image uploaded?", a: "No — everything happens in your browser; your image never leaves your device." },
      { q: "Will rotating lose quality?", a: "No — 90° rotations and flips are lossless. JPEGs are re-saved at high quality." },
    ],
    related: ["crop-image", "circle-crop", "image-converter"],
  },
  {
    slug: "circle-crop",
    name: "Circle Crop",
    tagline: "Crop an image into a circle for avatars.",
    description:
      "Free online circle image cropper. Crop any photo into a perfect circle with a transparent background — great for avatars and profile pictures. In your browser, no upload.",
    keywords: ["circle crop", "round profile picture", "crop image into circle", "circular crop", "round avatar maker"],
    icon: CircleUserRoundIcon,
    intro:
      "Turn a photo into a round avatar or profile picture. It crops from the center to a circle and saves a PNG with a transparent background. Everything runs in your browser, so your image never leaves your device.",
    steps: ["Choose an image.", "Preview the circular crop.", "Download the PNG."],
    faqs: [
      { q: "Does the result have a transparent background?", a: "Yes — the corners outside the circle are transparent, so it drops cleanly onto any background." },
      { q: "Is my image uploaded?", a: "No — cropping happens in your browser; your image never leaves your device." },
    ],
    related: ["crop-image", "rotate-image", "favicon-generator"],
  },
  {
    slug: "add-text-to-image",
    name: "Add Text to Image",
    tagline: "Add a caption or watermark to an image.",
    description:
      "Free online tool to add text to an image. Add a caption, title, or watermark with your choice of size, color, and position — right in your browser, no upload.",
    keywords: ["add text to image", "add text to photo", "caption image", "text on picture", "image watermark text"],
    icon: TypeIcon,
    intro:
      "Add a caption, title, or watermark to an image and position it top, center, or bottom — with a live preview and your choice of size and color. Everything runs in your browser, so your image never leaves your device.",
    steps: ["Choose an image.", "Type your text and set the size, color, and position.", "Download the result."],
    faqs: [
      { q: "Can I control where the text goes?", a: "Yes — place it at the top, center, or bottom, and adjust the size and color to fit." },
      { q: "Is my image uploaded?", a: "No — the text is drawn in your browser; your image never leaves your device." },
    ],
    related: ["crop-image", "rotate-image", "watermark-pdf"],
  },
  {
    slug: "image-to-ico",
    name: "Image to ICO",
    tagline: "Convert an image to a Windows .ico icon.",
    description:
      "Free online image to ICO converter. Turn a PNG or JPG into a multi-size Windows .ico icon (favicon) right in your browser — no upload, no watermark.",
    keywords: ["image to ico", "png to ico", "ico converter", "favicon ico", "convert image to icon"],
    icon: AppWindowIcon,
    intro:
      "Convert an image into a Windows .ico icon containing multiple sizes — perfect for a favicon or app icon. It runs entirely in your browser, so your image never leaves your device.",
    steps: ["Choose an image (a square PNG works best).", "Pick which sizes to include.", "Create and download the .ico."],
    faqs: [
      { q: "What sizes are included?", a: "Standard makes a 16, 32, and 48 px icon; All sizes adds 64, 128, and 256 px for high-DPI displays." },
      { q: "Is my image uploaded?", a: "No — the ICO is built in your browser; your image never leaves your device." },
    ],
    related: ["favicon-generator", "crop-image", "image-converter"],
  },
  {
    slug: "csv-to-xlsx",
    name: "CSV to Excel",
    tagline: "Convert a CSV file to an Excel spreadsheet — free.",
    description:
      "Free CSV to Excel (XLSX) converter. Turn a comma-separated file into a proper .xlsx spreadsheet with columns ready to sort and filter. No sign-up, no upload — it runs entirely in your browser.",
    keywords: ["csv to excel", "csv to xlsx", "convert csv to excel", "csv to spreadsheet", "open csv in excel"],
    icon: FileSpreadsheetIcon,
    intro:
      "Turn a raw CSV file into a real Excel spreadsheet (.xlsx) — with the data split into proper columns you can sort, filter, and format, and numbers stored as real numbers. It's free with no sign-up, and it runs entirely in your browser, so your file is never uploaded.",
    steps: ["Drop or choose your CSV file.", "It converts to Excel automatically.", "Download the .xlsx spreadsheet."],
    faqs: [
      { q: "Is it really free with no sign-up?", a: "Yes — the conversion happens right in your browser, so it's completely free with no account and no watermark." },
      { q: "Are my files uploaded?", a: "No — your CSV is read and converted locally in your browser and never leaves your device." },
      { q: "Why convert CSV to XLSX?", a: "CSV is just plain text; XLSX is a full Excel workbook with typed cells. Converting stores numbers as numbers and makes the data easier to sort, filter, and format in Excel." },
    ],
    related: ["xlsx-to-csv", "excel-to-pdf", "json-to-csv"],
  },
  {
    slug: "xlsx-to-csv",
    name: "Excel to CSV",
    tagline: "Convert an Excel spreadsheet to a CSV file.",
    description:
      "Convert Excel (XLSX) to CSV online. Export a spreadsheet to a clean comma-separated file for imports, databases, and data tools. An OhoTool Pro tool.",
    keywords: ["excel to csv", "xlsx to csv", "convert excel to csv", "spreadsheet to csv", "export excel as csv"],
    icon: SheetIcon,
    intro:
      "Export an Excel spreadsheet (.xlsx) to a clean CSV file — perfect for importing into databases, analytics tools, or anything that expects comma-separated values. The file is processed securely on our server and deleted right after.",
    steps: ["Choose your .xlsx file.", "Click Convert to CSV.", "Download the .csv file."],
    faqs: [
      { q: "Which sheet gets exported?", a: "The first worksheet is exported to CSV, since CSV files hold a single table of data." },
      { q: "Is my file kept?", a: "No — it's processed on our server only to perform the conversion, then deleted." },
    ],
    related: ["csv-to-xlsx", "excel-to-pdf", "json-to-csv"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "pdf-to-pptx",
    name: "PDF to PowerPoint",
    tagline: "Convert a PDF into an editable PowerPoint.",
    description:
      "Convert PDF to PowerPoint (PPTX) online. Turn a PDF into editable slides you can reuse and present. An OhoTool Pro tool.",
    keywords: ["pdf to powerpoint", "pdf to pptx", "convert pdf to ppt", "pdf to slides", "pdf to presentation"],
    icon: PresentationIcon,
    intro:
      "Turn a PDF into an editable PowerPoint presentation (.pptx) — each page becomes a slide you can reuse, re-order, and present. The file is processed securely on our server and deleted right after.",
    steps: ["Choose your PDF.", "Click Convert to PowerPoint.", "Download the .pptx presentation."],
    faqs: [
      { q: "Will the slides be fully editable?", a: "Text and elements are converted to editable slide content where possible. Complex or heavily-designed PDFs may need some tidying up." },
      { q: "Is my file kept?", a: "No — it's processed on our server only to perform the conversion, then deleted." },
    ],
    related: ["pdf-to-word", "powerpoint-to-pdf", "pdf-to-images"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    tagline: "Convert an HTML file into a PDF.",
    description:
      "Convert HTML to PDF online. Turn an .html file into a clean, shareable PDF with the layout preserved. An OhoTool Pro tool.",
    keywords: ["html to pdf", "convert html to pdf", "webpage html to pdf", "save html as pdf", "html file to pdf"],
    icon: CodeXmlIcon,
    intro:
      "Convert an HTML file into a polished PDF with the page layout preserved — great for invoices, reports, and templates. The file is processed securely on our server and deleted right after.",
    steps: ["Choose your .html file.", "Click Convert to PDF.", "Download the PDF."],
    faqs: [
      { q: "What about a live web page?", a: "To convert a page by its address, use the URL to PDF tool instead. This tool converts an HTML file you upload." },
      { q: "Is my file kept?", a: "No — it's processed on our server only to perform the conversion, then deleted." },
    ],
    related: ["url-to-pdf", "markdown-to-html", "text-to-pdf"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "online-notepad",
    name: "Online Notepad",
    tagline: "A simple notepad that saves as you type.",
    description:
      "Free online notepad. A distraction-free place to write quick notes that autosave in your browser — with word count and one-click download. No sign-up.",
    keywords: ["online notepad", "notepad online", "notes online", "web notepad", "quick notes"],
    icon: NotebookPenIcon,
    intro:
      "A clean, distraction-free notepad in your browser. Everything you type saves automatically to this device, so your notes are still here when you come back. Nothing is uploaded — download a .txt copy any time.",
    steps: ["Start typing — your notes save automatically.", "Come back any time; they'll still be here.", "Download a .txt copy or copy the text when you need it."],
    faqs: [
      { q: "Where are my notes stored?", a: "Only in this browser, on this device. Nothing is uploaded to a server. Clearing your browser data will remove them." },
      { q: "Do I need an account?", a: "No — it works instantly with no sign-up." },
    ],
    related: ["word-counter", "case-converter", "countdown-timer"],
  },
  {
    slug: "stopwatch",
    name: "Online Stopwatch",
    tagline: "Start, stop, and lap — right in your browser.",
    description:
      "Free online stopwatch with lap times. Start, pause, and record laps with a big, clear display. No download, no sign-up.",
    keywords: ["online stopwatch", "stopwatch", "stopwatch online", "lap timer", "web stopwatch"],
    icon: TimerIcon,
    intro:
      "A precise online stopwatch with a big, easy-to-read display and lap times — perfect for workouts, cooking, study sessions, and timing anything. Runs entirely in your browser.",
    steps: ["Press Start to begin timing.", "Tap Lap to record split times.", "Pause or Reset whenever you're done."],
    faqs: [
      { q: "Does it keep timing if I switch tabs?", a: "It keeps counting based on the real clock, so the elapsed time stays accurate when you come back." },
      { q: "Is there a sound?", a: "The stopwatch is silent; for an alert when time runs out, use the Countdown Timer." },
    ],
    related: ["countdown-timer", "pomodoro-timer", "online-notepad"],
  },
  {
    slug: "countdown-timer",
    name: "Countdown Timer",
    tagline: "Set a timer with a sound alert.",
    description:
      "Free online countdown timer. Set minutes and seconds, hit start, and get a sound alert when time's up. Quick presets, big display, no sign-up.",
    keywords: ["countdown timer", "online timer", "timer online", "set a timer", "timer with alarm"],
    icon: HourglassIcon,
    intro:
      "Set a countdown, press start, and get a clear chime when time runs out — great for cooking, workouts, breaks, and focus sessions. Use the quick presets or set an exact time. Runs in your browser.",
    steps: ["Enter minutes and seconds (or tap a preset).", "Press Start.", "Hear the alert when the timer reaches zero."],
    faqs: [
      { q: "Will it alert me when done?", a: "Yes — it plays a chime when the countdown reaches zero. Keep the tab open and your volume on." },
      { q: "Do I need to install anything?", a: "No — it runs entirely in your browser with no sign-up." },
    ],
    related: ["pomodoro-timer", "stopwatch", "online-notepad"],
  },
  {
    slug: "pomodoro-timer",
    name: "Pomodoro Timer",
    tagline: "Focus in sprints with work/break cycles.",
    description:
      "Free online Pomodoro timer. Work in focused 25-minute sprints with short breaks and a chime between phases. Adjustable, no sign-up.",
    keywords: ["pomodoro timer", "pomodoro", "focus timer", "study timer", "25 minute timer"],
    icon: AlarmClockIcon,
    intro:
      "The Pomodoro technique: focus for a set sprint, take a short break, repeat. This timer runs the cycle for you with a chime between phases and a round counter, and you can adjust the focus and break lengths. Runs in your browser.",
    steps: ["Set your focus and break lengths (defaults 25 / 5).", "Start the focus sprint.", "When the chime sounds, start your break — then the next sprint."],
    faqs: [
      { q: "What is the Pomodoro technique?", a: "A time-management method: work in focused intervals (traditionally 25 minutes) separated by short breaks to stay fresh and productive." },
      { q: "Can I change the lengths?", a: "Yes — set any focus and break duration before you start." },
    ],
    related: ["countdown-timer", "stopwatch", "online-notepad"],
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    tagline: "Create and download a professional invoice PDF.",
    description:
      "Free invoice generator. Fill in your details and line items and download a clean, professional invoice as a PDF — built in your browser, nothing uploaded.",
    keywords: ["invoice generator", "free invoice generator", "create invoice", "invoice maker", "invoice template pdf"],
    icon: ReceiptIcon,
    intro:
      "Create a clean, professional invoice in minutes — add your business and client details, line items, tax, and notes, then download it as a PDF. Everything is built right in your browser, so your data is never uploaded.",
    steps: ["Fill in your business and client details.", "Add line items, tax, and any notes.", "Download the finished invoice as a PDF."],
    faqs: [
      { q: "Is my invoice data uploaded?", a: "No — the PDF is generated entirely in your browser, so nothing you enter leaves your device." },
      { q: "Can I use my own currency?", a: "Yes — set any currency symbol, and totals and tax are calculated automatically." },
    ],
    related: ["excel-to-pdf", "text-to-pdf", "online-notepad"],
  },
  {
    slug: "meme-generator",
    name: "Meme Generator",
    tagline: "Add captions to an image — or get caption ideas with AI.",
    description:
      "Free online meme generator. Upload an image, add classic top and bottom captions (or get AI caption ideas), pick a text size and color, and download — no watermark, nothing uploaded.",
    keywords: ["meme generator", "ai meme generator", "meme maker", "make a meme", "meme caption generator", "add text to meme"],
    icon: LaughIcon,
    intro:
      "Turn any image into a meme — add bold top and bottom captions in the classic Impact style, choose the text size and color, then download a PNG. Stuck for words? Describe the vibe and get AI caption ideas. The editor runs in your browser and there's no watermark.",
    steps: ["Upload an image.", "Type captions, or get ideas with AI.", "Pick size/color and download your meme."],
    faqs: [
      { q: "Is my image uploaded anywhere?", a: "No — the meme is drawn on a canvas entirely in your browser, so your image never leaves your device." },
      { q: "How do the AI captions work?", a: "Describe your topic or situation and AI suggests classic top/bottom caption pairs — tap one to use it, then tweak. AI captions need a free account; the manual editor is free with no sign-up." },
      { q: "Is there a watermark?", a: "No — your downloaded meme is clean, with no watermark or branding." },
    ],
    related: ["add-text-to-image", "crop-image", "image-converter"],
  },
  {
    slug: "time-calculator",
    name: "Time Calculator",
    tagline: "Add or subtract hours, minutes, and seconds.",
    description:
      "Free online time calculator. Add or subtract hours, minutes, and seconds, or get the duration between two times — instantly in your browser.",
    keywords: ["time calculator", "hours calculator", "add time", "subtract time", "time duration calculator", "add hours and minutes"],
    icon: ClockIcon,
    intro:
      "Add or subtract spans of time, or find the duration between a start and end time — handy for timesheets, cooking, and scheduling. Everything calculates instantly in your browser.",
    steps: ["Choose add/subtract or duration mode.", "Enter your times or durations.", "See the result instantly."],
    faqs: [
      { q: "Can it handle more than 24 hours?", a: "Yes — totals can exceed 24 hours (e.g. a full timesheet), shown as total hours, minutes, and seconds." },
      { q: "Does it work across midnight?", a: "Yes — in duration mode, an end time earlier than the start is treated as the next day." },
    ],
    related: ["date-difference", "age-calculator", "timestamp-converter"],
  },
  {
    slug: "color-picker-from-image",
    name: "Color Picker from Image",
    tagline: "Pick colors from an image — get HEX, RGB, and HSL.",
    description:
      "Free online image color picker. Upload an image and click any pixel to grab its HEX, RGB, and HSL values — privately in your browser.",
    keywords: ["color picker from image", "image color picker", "get color from image", "hex from image", "pick color from photo", "eyedropper online"],
    icon: PipetteIcon,
    intro:
      "Upload an image and click anywhere to sample that pixel's exact color — with HEX, RGB, and HSL ready to copy. Great for matching brand colors from a screenshot. It all runs in your browser; your image is never uploaded.",
    steps: ["Upload an image.", "Click any spot to pick its color.", "Copy the HEX, RGB, or HSL value."],
    faqs: [
      { q: "Is my image uploaded?", a: "No — the image is read into a canvas locally in your browser, so it never leaves your device." },
      { q: "What values do I get?", a: "Each picked color is shown as HEX, RGB, and HSL, and you can copy any of them with one click." },
    ],
    related: ["color-converter", "color-shades-generator", "css-gradient-generator"],
  },
  {
    slug: "svg-optimizer",
    name: "SVG Optimizer",
    tagline: "Minify and clean up SVG code to shrink the file.",
    description:
      "Free online SVG optimizer and minifier. Strip editor metadata, comments, and extra whitespace to make SVGs smaller — in your browser, nothing uploaded.",
    keywords: ["svg optimizer", "minify svg", "optimize svg online", "svg minifier", "svgo online", "compress svg"],
    icon: Minimize2Icon,
    intro:
      "Paste an SVG and get a smaller, cleaner version — comments, editor metadata (Inkscape/Illustrator), and redundant whitespace are stripped and long decimals rounded, without changing how it looks. Everything runs in your browser.",
    steps: ["Paste your SVG code.", "See the optimized output and how much smaller it is.", "Copy or download the result."],
    faqs: [
      { q: "Will optimizing change how my SVG looks?", a: "No — it only removes invisible bloat (comments, editor metadata, extra whitespace) and rounds long decimals, so the rendering stays the same." },
      { q: "Is my SVG uploaded?", a: "No — optimization runs entirely in your browser; the code never leaves your device." },
    ],
    related: ["svg-to-png", "svg-to-image", "code-beautifier"],
  },
  {
    slug: "html-minifier",
    name: "HTML Minifier",
    tagline: "Minify HTML — strip comments and whitespace.",
    description:
      "Free online HTML minifier. Remove comments and collapse whitespace to shrink your HTML, while keeping <pre>, <script>, and <style> intact — in your browser.",
    keywords: ["html minifier", "minify html", "html minify online", "compress html", "html compressor"],
    icon: CodeIcon,
    intro:
      "Paste HTML and get a minified version — comments removed and whitespace collapsed — while the contents of <pre>, <textarea>, <script>, and <style> are preserved exactly. It all runs in your browser.",
    steps: ["Paste your HTML.", "See the minified output and the size saved.", "Copy or download the result."],
    faqs: [
      { q: "Does it break my scripts or preformatted text?", a: "No — the contents of <pre>, <textarea>, <script>, and <style> are preserved exactly; only the surrounding markup is minified." },
      { q: "Is my HTML uploaded?", a: "No — minification happens entirely in your browser." },
    ],
    related: ["code-beautifier", "strip-html", "html-entities"],
  },
  {
    slug: "css-minifier",
    name: "CSS Minifier",
    tagline: "Minify CSS to shrink stylesheet size.",
    description:
      "Free online CSS minifier. Compress and optimize your CSS — remove comments and whitespace and compact rules — in your browser with the csso engine.",
    keywords: ["css minifier", "minify css", "css compressor", "compress css", "css minify online", "optimize css"],
    icon: FileCode2Icon,
    intro:
      "Paste CSS and get a minified, optimized stylesheet using the csso engine — comments and whitespace removed and rules compacted. See how many bytes you save. It all runs in your browser.",
    steps: ["Paste your CSS.", "See the minified output and size saved.", "Copy or download the result."],
    faqs: [
      { q: "Is my CSS uploaded?", a: "No — minification runs entirely in your browser with the csso library; your code never leaves your device." },
      { q: "Is the output safe to use?", a: "Yes — csso is a well-established optimizer that preserves your styles while compacting the output." },
    ],
    related: ["css-gradient-generator", "code-beautifier", "html-minifier"],
  },
  {
    slug: "js-minifier",
    name: "JavaScript Minifier",
    tagline: "Minify JavaScript with Terser.",
    description:
      "Free online JavaScript minifier. Compress and mangle your JS with the Terser engine to shrink file size — in your browser, nothing uploaded.",
    keywords: ["javascript minifier", "js minifier", "minify javascript", "minify js", "js compressor", "terser online"],
    icon: BracesIcon,
    intro:
      "Paste JavaScript and get a minified version using Terser — whitespace and comments removed and names shortened where safe. See the size you save. Everything runs in your browser.",
    steps: ["Paste your JavaScript.", "See the minified output and size saved.", "Copy or download the result."],
    faqs: [
      { q: "Is my code uploaded?", a: "No — minification runs entirely in your browser with the Terser library; your code never leaves your device." },
      { q: "What if my JS has a syntax error?", a: "Terser reports it — fix the syntax and the minified output appears automatically." },
    ],
    related: ["json-formatter", "code-beautifier", "css-minifier"],
  },
  {
    slug: "json-xml",
    name: "JSON to XML Converter",
    tagline: "Convert JSON to XML and XML to JSON.",
    description:
      "Free online JSON to XML and XML to JSON converter. Paste JSON or XML and convert between them instantly — in your browser, nothing uploaded.",
    keywords: ["json to xml", "xml to json", "json xml converter", "convert json to xml", "convert xml to json"],
    icon: ArrowLeftRightIcon,
    intro:
      "Convert JSON to XML or XML to JSON in one click. Paste your data, pick a direction, and copy the result — attributes and nested structures are preserved. It all runs in your browser.",
    steps: ["Paste your JSON or XML.", "Choose the conversion direction.", "Copy the converted output."],
    faqs: [
      { q: "Is my data uploaded?", a: "No — conversion runs entirely in your browser; your data never leaves your device." },
      { q: "Are XML attributes handled?", a: "Yes — attributes are preserved using an @_ prefix when converting between XML and JSON." },
    ],
    related: ["json-yaml", "json-to-csv", "xml-formatter"],
  },
  {
    slug: "qr-scanner",
    name: "QR Code Scanner",
    tagline: "Scan or upload a QR code to read its content.",
    description:
      "Free online QR code scanner and reader. Upload a QR image or scan live with your camera to decode its text or link — in your browser, nothing uploaded.",
    keywords: ["qr code scanner", "qr scanner", "qr code reader", "scan qr code", "read qr code", "qr decoder"],
    icon: ScanLineIcon,
    intro:
      "Read any QR code — upload an image of it or scan it live with your camera — and instantly see the text or link it contains. Decoding happens entirely in your browser, so nothing is uploaded.",
    steps: ["Upload a QR image, or start your camera.", "The code is decoded automatically.", "Copy the text or open the link."],
    faqs: [
      { q: "Is my image or camera uploaded?", a: "No — decoding runs entirely in your browser; images and camera frames never leave your device." },
      { q: "Does camera scanning work on my phone?", a: "Yes — on a secure (https) connection it uses your device's camera. If it can't access the camera, upload a photo of the QR code instead." },
    ],
    related: ["qr-code", "wifi-qr", "bulk-qr-generator"],
  },
  {
    slug: "markdown-to-pdf",
    name: "Markdown to PDF",
    tagline: "Convert Markdown to a clean PDF document.",
    description:
      "Free online Markdown to PDF converter. Paste Markdown, preview it, and download a clean PDF with selectable text — in your browser, nothing uploaded.",
    keywords: ["markdown to pdf", "md to pdf", "convert markdown to pdf", "markdown pdf", "export markdown as pdf"],
    icon: FileTextIcon,
    intro:
      "Turn Markdown into a clean, shareable PDF — headings, lists, quotes, and code blocks are laid out with real, selectable text. Preview as you type, then download. It all runs in your browser.",
    steps: ["Paste or write your Markdown.", "Check the live preview.", "Download the PDF."],
    faqs: [
      { q: "Is my content uploaded?", a: "No — both the preview and the PDF are generated entirely in your browser." },
      { q: "Is the PDF text selectable?", a: "Yes — the text is rendered as real, selectable text, not a flat image." },
    ],
    related: ["markdown-to-html", "html-to-pdf", "text-to-pdf"],
  },
  {
    slug: "image-to-svg",
    name: "Image to SVG",
    tagline: "Vectorize a PNG or JPG into a scalable SVG.",
    description:
      "Free online image to SVG converter (vectorizer). Trace a PNG or JPG into a scalable SVG — in your browser, nothing uploaded.",
    keywords: ["image to svg", "png to svg", "jpg to svg", "vectorize image", "image vectorizer", "convert image to svg", "raster to vector"],
    icon: PenToolIcon,
    intro:
      "Turn a raster image (PNG or JPG) into a scalable SVG by tracing its shapes and colors. Pick a detail level, preview the result, then copy or download the SVG. It all runs in your browser.",
    steps: ["Upload a PNG or JPG.", "Choose a detail level.", "Copy or download the traced SVG."],
    faqs: [
      { q: "Is my image uploaded?", a: "No — tracing runs entirely in your browser; your image never leaves your device." },
      { q: "What works best?", a: "Logos, icons, and flat graphics vectorize cleanly. Detailed photos produce large SVGs and may look posterized — lower the detail for a smaller file." },
    ],
    related: ["svg-to-png", "svg-optimizer", "image-converter"],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    tagline: "Convert between world currencies at live rates.",
    description:
      "Free online currency converter with live exchange rates for 160+ currencies. Convert any amount between currencies instantly.",
    keywords: ["currency converter", "exchange rate calculator", "convert currency", "money converter", "usd to eur", "live exchange rates"],
    icon: CoinsIcon,
    intro:
      "Convert any amount between 160+ world currencies using up-to-date exchange rates. Pick your currencies, enter an amount, and see the conversion and the current rate instantly.",
    steps: ["Enter an amount.", "Pick the currencies to convert from and to.", "See the converted amount and live rate."],
    faqs: [
      { q: "How current are the rates?", a: "Rates come from a live source and refresh hourly. The last update time is shown below the result." },
      { q: "Which currencies are supported?", a: "Over 160 world currencies, including USD, EUR, GBP, JPY, PKR, INR, and more." },
    ],
    related: ["unit-converter", "percentage-calculator", "discount-calculator"],
  },
  {
    slug: "remove-background",
    name: "Remove Image Background",
    tagline: "Automatically remove the background from an image.",
    description:
      "Free online background remover. Automatically erase the background from a photo and download a transparent PNG — runs in your browser, nothing uploaded.",
    keywords: ["remove background", "background remover", "remove image background", "transparent background", "erase background", "background eraser"],
    icon: EraserIcon,
    intro:
      "Remove the background from any photo automatically and get a clean transparent PNG. The AI model runs entirely in your browser, so your image is never uploaded. The first run downloads a one-time model.",
    steps: ["Upload an image.", "Click Remove background and wait a moment.", "Download the transparent PNG."],
    faqs: [
      { q: "Is my image uploaded?", a: "No — background removal runs on your device using an in-browser AI model; your image never leaves your browser." },
      { q: "Why does the first run take longer?", a: "The first use downloads a one-time AI model (a few MB). After that it's cached and runs much faster." },
      { q: "What do I get?", a: "A PNG with a transparent background, ready to drop onto any color or design." },
    ],
    related: ["crop-image", "circle-crop", "image-converter"],
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF (Add Password)",
    tagline: "Password-protect a PDF with encryption.",
    description:
      "Free online tool to password-protect a PDF. Add a password and AES-256 encryption so only people who have the password can open it — in your browser, nothing uploaded.",
    keywords: ["protect pdf", "password protect pdf", "encrypt pdf", "add password to pdf", "lock pdf", "pdf password"],
    icon: ShieldCheckIcon,
    intro:
      "Add a password to a PDF so only people who know it can open the document. Encryption (AES-256) runs entirely in your browser, so your file is never uploaded.",
    steps: ["Upload a PDF.", "Choose a password.", "Download the protected PDF."],
    faqs: [
      { q: "Is my PDF uploaded?", a: "No — encryption runs entirely in your browser (via qpdf compiled to WebAssembly), so your file never leaves your device." },
      { q: "What does the password do?", a: "The PDF is encrypted with AES-256 so it can't be opened without the password you set." },
      { q: "Can I remove the password later?", a: "Yes — use the Unlock PDF tool with the password to produce an unprotected copy." },
    ],
    related: ["unlock-pdf", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF (Remove Password)",
    tagline: "Remove the password from a PDF you can open.",
    description:
      "Free online tool to unlock a PDF. Enter the current password to remove it and download an unprotected copy — in your browser, nothing uploaded.",
    keywords: ["unlock pdf", "remove pdf password", "decrypt pdf", "pdf password remover", "remove password from pdf"],
    icon: FileKey2Icon,
    intro:
      "Remove the password from a PDF you're allowed to open by entering its current password. It works on any standard password-protected PDF and runs entirely in your browser, so your file is never uploaded.",
    steps: ["Upload the protected PDF.", "Enter its current password.", "Download the unlocked PDF."],
    faqs: [
      { q: "Do I need the password?", a: "Yes — you must know the PDF's current password. This tool removes a known password; it can't crack an unknown one." },
      { q: "Is my PDF uploaded?", a: "No — decryption runs entirely in your browser (via qpdf compiled to WebAssembly), so your file never leaves your device." },
      { q: "Is this allowed?", a: "Only unlock PDFs you own or have permission to modify." },
    ],
    related: ["protect-pdf", "merge-pdf", "compress-pdf"],
  },

  // --- AI developer tools (single-prompt, Pro-gated with free daily quota) ---
  {
    slug: "regex-generator",
    name: "AI Regex Generator",
    tagline: "Turn plain English into a regular expression.",
    description:
      "Free AI regex generator. Describe what you want to match in plain English and get a working regular expression with an explanation and example. JavaScript, Python, or PCRE. Free daily runs; unlimited on Pro.",
    keywords: ["regex generator", "regex from english", "ai regex", "regular expression generator", "generate regex"],
    icon: RegexIcon,
    intro:
      "Describe what you want to match — an email, a phone number, a date — and get a working regular expression with a plain-English breakdown and a matching example. Choose JavaScript, Python, or PCRE flavor. Test the result in the Regex Tester.",
    steps: ["Describe what you want to match.", "Pick the regex flavor.", "Generate, then copy or test the pattern."],
    faqs: [
      { q: "Which regex flavors are supported?", a: "JavaScript, Python, and PCRE — pick the one that matches your language or tool so the syntax is correct." },
      { q: "Can I test the generated pattern?", a: "Yes — paste it into the Regex Tester to check it against sample text and see matches highlighted." },
    ],
    related: ["regex-tester", "code-explainer", "sql-generator"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "sql-generator",
    name: "AI SQL Generator",
    tagline: "Write SQL queries from plain English.",
    description:
      "Free AI SQL generator. Describe the query you need in plain English — optionally with your table schema — and get a clean, formatted SQL query. PostgreSQL, MySQL, SQLite, or SQL Server. Free daily runs; unlimited on Pro.",
    keywords: ["sql generator", "text to sql", "ai sql", "sql from english", "generate sql query"],
    icon: DatabaseIcon,
    intro:
      "Describe the data you want — 'top 5 customers by revenue in 2024' — and get a correct, readable SQL query for your dialect. Paste your table schema for more accurate joins and column names. Format the result with the SQL Formatter.",
    steps: ["Describe the query (and paste your schema if you have it).", "Choose your SQL dialect.", "Generate and copy the query."],
    faqs: [
      { q: "Which databases are supported?", a: "PostgreSQL, MySQL, SQLite, and SQL Server — pick your dialect so the syntax and functions are correct." },
      { q: "Should I include my schema?", a: "It helps — pasting your table and column names lets the AI use the right names and joins instead of guessing." },
    ],
    related: ["sql-formatter", "regex-generator", "code-explainer"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "commit-message-generator",
    name: "AI Commit Message Generator",
    tagline: "Generate clear commit messages from a diff.",
    description:
      "Free AI commit message generator. Paste your git diff or describe your changes and get a clean commit message — Conventional Commits or plain style. Free daily runs; unlimited on Pro.",
    keywords: ["commit message generator", "conventional commits generator", "git commit message ai", "generate commit message"],
    icon: GitCommitVerticalIcon,
    intro:
      "Paste the output of `git diff` (or just describe what you changed) and get a clear, well-formed commit message. Choose Conventional Commits (feat/fix/…) or a plain imperative style, with a concise subject and an optional body.",
    steps: ["Paste your git diff or describe the changes.", "Pick Conventional or plain style.", "Generate and copy the message."],
    faqs: [
      { q: "What should I paste?", a: "The output of `git diff` (staged or unstaged) works best, but a short description of what you changed also works." },
      { q: "What is Conventional Commits?", a: "A convention where the subject starts with a type like feat, fix, docs, or refactor — useful for changelogs and semantic versioning." },
    ],
    related: ["code-explainer", "regex-generator", "json-formatter"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "code-explainer",
    name: "AI Code Explainer",
    tagline: "Understand what any code does, in plain English.",
    description:
      "Free AI code explainer. Paste code in any language and get a clear, plain-English explanation of what it does, step by step — beginner-friendly or detailed. Free daily runs; unlimited on Pro.",
    keywords: ["code explainer", "explain code ai", "what does this code do", "code explanation", "understand code"],
    icon: FileCodeIcon,
    intro:
      "Paste a snippet or a whole function and get a clear explanation of its purpose, the key steps, and any edge cases or bugs — in any language. Choose a simple, beginner-friendly explanation or a thorough one.",
    steps: ["Paste the code you want explained.", "Choose the explanation depth.", "Read the explanation and copy it."],
    faqs: [
      { q: "Which languages are supported?", a: "Any common language — JavaScript, Python, Go, Rust, SQL, shell, and more. Paste the snippet and it detects the language." },
      { q: "Is my code stored?", a: "No — your code is sent to the AI model to generate the explanation and isn't stored on our servers afterward." },
    ],
    related: ["regex-generator", "commit-message-generator", "sql-generator"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "cron-generator",
    name: "AI Cron Expression Generator",
    tagline: "Turn a schedule in plain English into cron.",
    description:
      "Free AI cron expression generator. Describe a schedule in plain English — 'every weekday at 9am' — and get the correct cron expression with a plain-English confirmation. Free daily runs; unlimited on Pro.",
    keywords: ["cron generator", "cron expression generator", "english to cron", "crontab generator", "cron from text"],
    icon: CalendarClockIcon,
    intro:
      "Describe when you want something to run — 'every 15 minutes', 'the first of every month at midnight', 'weekdays at 9am' — and get the matching 5-field cron expression, with a plain-English confirmation so you can double-check it. Verify it with the Cron Explainer.",
    steps: ["Describe the schedule in plain English.", "Generate the cron expression.", "Copy it, or confirm it in the Cron Explainer."],
    faqs: [
      { q: "What cron format is used?", a: "Standard 5-field cron (minute, hour, day-of-month, month, day-of-week) used by crontab, most schedulers, and CI systems." },
      { q: "How do I check it's right?", a: "The tool includes a plain-English confirmation of when it runs, and you can paste the result into the Cron Explainer for a full breakdown." },
    ],
    related: ["cron-explainer", "code-explainer", "regex-generator"],
    pro: true,
    serverSide: true,
  },

  // --- Random & fun (client-side, no sign-up) ---
  {
    slug: "coin-flip",
    name: "Coin Flip",
    tagline: "Flip a virtual coin — heads or tails.",
    description:
      "Free online coin flip. Flip a virtual coin for a fair heads-or-tails result, with a running tally. Instant, private, and free — no sign-up.",
    keywords: ["coin flip", "flip a coin", "heads or tails", "coin toss", "online coin flip"],
    icon: CoinsIcon,
    intro:
      "Flip a virtual coin for a quick, fair heads-or-tails decision. Each flip is random, and the tool keeps a running tally of heads and tails. Runs entirely in your browser.",
    steps: ["Click Flip the coin.", "See heads or tails.", "Keep flipping — the tally updates automatically."],
    faqs: [
      { q: "Is the coin flip fair?", a: "Yes — each flip has an equal 50/50 chance of heads or tails, generated randomly in your browser." },
      { q: "Can I flip more than once?", a: "Yes — flip as many times as you like; the tool tracks how many heads and tails you've had." },
    ],
    related: ["dice-roller", "random-picker", "spin-the-wheel"],
  },
  {
    slug: "dice-roller",
    name: "Dice Roller",
    tagline: "Roll virtual dice — d4 to d20.",
    description:
      "Free online dice roller. Roll one or more virtual dice (d4, d6, d8, d10, d12, d20) and see each result and the total. Great for board games and tabletop RPGs. Free, no sign-up.",
    keywords: ["dice roller", "roll dice online", "virtual dice", "d20 roller", "dice simulator"],
    icon: DicesIcon,
    intro:
      "Roll virtual dice for board games, D&D, or any decision. Choose how many dice and how many sides (d4 through d20) and see every result plus the total. Runs entirely in your browser.",
    steps: ["Pick the number of dice and sides.", "Click Roll dice.", "Read each die and the total."],
    faqs: [
      { q: "Which dice can I roll?", a: "Standard polyhedral dice: d4, d6, d8, d10, d12, and d20 — roll up to 12 at once." },
      { q: "Are the rolls random?", a: "Yes — every roll is generated randomly in your browser, so results are fair and unpredictable." },
    ],
    related: ["coin-flip", "random-number-generator", "spin-the-wheel"],
  },
  {
    slug: "spin-the-wheel",
    name: "Spin the Wheel",
    tagline: "Add names and spin to pick a winner.",
    description:
      "Free spin the wheel — a random name picker wheel. Add names or options, spin, and land on a random winner. Perfect for giveaways, classrooms, and decisions. Free, no sign-up.",
    keywords: ["spin the wheel", "wheel of names", "random name picker wheel", "spinner wheel", "picker wheel"],
    icon: Disc3Icon,
    intro:
      "Add names or options, hit spin, and let the wheel land on a random winner. Great for giveaways, picking who goes first, classroom activities, or settling a decision. Everything runs in your browser.",
    steps: ["Type your entries, one per line.", "Click Spin.", "The wheel lands on a random winner."],
    faqs: [
      { q: "How many entries can I add?", a: "As many as you like — each entry becomes a slice of the wheel. Add at least two to spin." },
      { q: "Is the winner truly random?", a: "Yes — the winning slice is chosen randomly in your browser, and the wheel animates to it." },
    ],
    related: ["random-picker", "coin-flip", "dice-roller"],
  },
  {
    slug: "random-picker",
    name: "Random Picker",
    tagline: "Pick a random name or item from a list.",
    description:
      "Free random picker / name picker. Paste a list and pick a random winner, with an option to remove picks so there are no repeats. Great for raffles and giveaways. Free, no sign-up.",
    keywords: ["random picker", "random name picker", "name picker", "raffle picker", "random choice generator"],
    icon: ShuffleIcon,
    intro:
      "Paste a list of names or items and pick a random winner instantly. Turn on 'remove after picking' to draw a raffle with no repeats. Runs entirely in your browser — nothing is uploaded.",
    steps: ["Paste your list, one item per line.", "Click Pick random.", "See the winner — repeat for more draws."],
    faqs: [
      { q: "Can I avoid picking the same item twice?", a: "Yes — enable 'Remove after picking' and each winner is removed from the list, so there are no repeats." },
      { q: "Is my list uploaded anywhere?", a: "No — picking happens entirely in your browser, so your list never leaves your device." },
    ],
    related: ["spin-the-wheel", "coin-flip", "dice-roller"],
  },

  // --- Calculators & designer tools (client-side) ---
  {
    slug: "calorie-calculator",
    name: "Calorie Calculator",
    tagline: "Estimate your daily calories (TDEE).",
    description:
      "Free calorie & TDEE calculator. Estimate the calories you burn daily and how many to eat to lose, maintain, or gain weight — based on age, sex, height, weight, and activity. Free and private.",
    keywords: ["calorie calculator", "tdee calculator", "daily calorie needs", "maintenance calories", "calorie intake calculator"],
    icon: FlameIcon,
    intro:
      "Estimate your Total Daily Energy Expenditure (TDEE) — the calories you burn in a day — using the Mifflin-St Jeor equation, then see targets to lose, maintain, or gain weight. Enter your details in metric or imperial; everything is calculated in your browser.",
    steps: ["Enter your age, sex, height, and weight.", "Choose your activity level.", "Read your maintenance calories and goal targets."],
    faqs: [
      { q: "How are the calories calculated?", a: "It uses the Mifflin-St Jeor equation for BMR, then multiplies by an activity factor to estimate your TDEE (maintenance calories)." },
      { q: "How much of a deficit should I use?", a: "A ~500 calorie/day deficit is a common target for about 0.5 kg (1 lb) of weight loss per week. These are general estimates, not medical advice." },
    ],
    related: ["bmr-calculator", "bmi-calculator", "ideal-weight-calculator"],
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    tagline: "See how savings grow over time.",
    description:
      "Free compound interest calculator. See how an initial amount plus monthly contributions grow with compound interest, and how much of the total is interest. Fast, private, no sign-up.",
    keywords: ["compound interest calculator", "investment calculator", "savings growth calculator", "interest calculator", "compounding calculator"],
    icon: TrendingUpIcon,
    intro:
      "See how your money grows with compound interest. Enter a starting amount, an interest rate, a time horizon, and an optional monthly contribution to see the future value — and how much of it is interest versus what you put in.",
    steps: ["Enter your initial amount and monthly contribution.", "Set the interest rate and number of years.", "See the future value and total interest."],
    faqs: [
      { q: "How is it compounded?", a: "Interest is compounded monthly, and contributions are added at the end of each month — the most common setup for savings and investments." },
      { q: "What currency does it use?", a: "It's currency-agnostic: the figures are shown in whatever currency you enter, with no symbol assumed." },
    ],
    related: ["loan-calculator", "percentage-calculator", "discount-calculator"],
  },
  {
    slug: "fraction-calculator",
    name: "Fraction Calculator",
    tagline: "Add, subtract, multiply, and divide fractions.",
    description:
      "Free fraction calculator. Add, subtract, multiply, and divide two fractions and get the result simplified, as a decimal, and as a mixed number. Instant and free.",
    keywords: ["fraction calculator", "add fractions", "multiply fractions", "divide fractions", "simplify fractions"],
    icon: DivideIcon,
    intro:
      "Do arithmetic with fractions and get a clean result. Enter two fractions and an operation to see the answer simplified to lowest terms, plus its decimal value and mixed-number form.",
    steps: ["Enter the first fraction.", "Pick an operation and enter the second fraction.", "Read the simplified result, decimal, and mixed number."],
    faqs: [
      { q: "Does it simplify the result?", a: "Yes — the answer is automatically reduced to lowest terms using the greatest common divisor, and shown as a decimal and mixed number too." },
      { q: "Can it handle negative fractions?", a: "Yes — enter a negative numerator (e.g. -3) and the sign is handled correctly." },
    ],
    related: ["percentage-calculator", "unit-converter", "roman-numeral"],
  },
  {
    slug: "ideal-weight-calculator",
    name: "Ideal Weight Calculator",
    tagline: "Find a healthy weight range for your height.",
    description:
      "Free ideal weight calculator. Find a healthy weight range for your height using the Devine, Robinson, Miller, and Hamwi formulas plus the healthy BMI range. Metric or imperial, free and private.",
    keywords: ["ideal weight calculator", "ideal body weight", "healthy weight for height", "ideal weight for height", "target weight calculator"],
    icon: WeightIcon,
    intro:
      "Estimate a healthy weight for your height using four classic formulas (Devine, Robinson, Miller, Hamwi) alongside the healthy weight range from a BMI of 18.5–25. Choose metric or imperial; it's calculated in your browser.",
    steps: ["Choose metric or imperial and your sex.", "Enter your height.", "See the healthy range and each formula's estimate."],
    faqs: [
      { q: "Which is the right number?", a: "There's no single 'ideal' — the formulas give a range, and the healthy BMI range is a good practical guide. They don't account for muscle or build." },
      { q: "Are these formulas accurate for everyone?", a: "No — they're rough estimates and less accurate for very short/tall people, athletes, or children. Treat them as a guideline." },
    ],
    related: ["bmi-calculator", "calorie-calculator", "bmr-calculator"],
  },
  {
    slug: "color-contrast-checker",
    name: "Color Contrast Checker",
    tagline: "Check WCAG contrast between two colors.",
    description:
      "Free WCAG color contrast checker. Enter a text and background color to see the contrast ratio and whether it passes AA and AAA for normal and large text, with a live preview. Free and private.",
    keywords: ["color contrast checker", "wcag contrast checker", "contrast ratio calculator", "accessibility contrast", "aa aaa contrast"],
    icon: ContrastIcon,
    intro:
      "Check whether your text and background colors have enough contrast for accessibility. Enter two colors to see the WCAG contrast ratio, pass/fail badges for AA and AAA (normal and large text), and a live preview of the combination.",
    steps: ["Pick or paste a text color.", "Pick or paste a background color.", "Read the contrast ratio and AA/AAA results."],
    faqs: [
      { q: "What contrast ratio do I need?", a: "WCAG AA requires 4.5:1 for normal text and 3:1 for large text; AAA requires 7:1 and 4.5:1. Aim for AA at minimum." },
      { q: "What counts as large text?", a: "Roughly 18pt and up, or 14pt and up if bold. Large text is allowed a lower contrast ratio." },
    ],
    related: ["color-converter", "css-gradient-generator", "color-shades-generator"],
  },

  // --- Text-style & image generators (client-side) ---
  {
    slug: "fancy-text-generator",
    name: "Fancy Text Generator",
    tagline: "Turn text into 𝓯𝓪𝓷𝓬𝔂 fonts, bold, italic & more.",
    description:
      "Free fancy text generator. Turn plain text into 𝐛𝐨𝐥𝐝, 𝑖𝑡𝑎𝑙𝑖𝑐, 𝓼𝓬𝓻𝓲𝓹𝓽, strikethrough and dozens of cool Unicode font styles you can copy-paste into Instagram, TikTok, and bios. Free, instant, in your browser.",
    keywords: ["fancy text generator", "font generator", "cool text generator", "instagram fonts", "stylish text", "bold text generator"],
    icon: TypeOutlineIcon,
    intro:
      "Turn plain text into dozens of stylish Unicode fonts — 𝐛𝐨𝐥𝐝, 𝑖𝑡𝑎𝑙𝑖𝑐, 𝓈𝒸𝓇𝒾𝓅𝓉, 𝔤𝔬𝔱𝔥𝔦𝔠, 𝕕𝕠𝕦𝕓𝕝𝕖-𝕤𝕥𝕣𝕦𝕔𝕜, strikethrough, underline, and upside-down. They're real Unicode characters, so you can paste them straight into Instagram, TikTok, X, Discord, and most bios. Type once and copy any style.",
    steps: ["Type or paste your text.", "Browse the generated font styles.", "Tap Copy on the one you like and paste it anywhere."],
    faqs: [
      { q: "Will these fonts work on Instagram and TikTok?", a: "Yes — they're standard Unicode characters, not images, so they paste into bios, captions, and posts on most apps. A few apps may not render every style." },
      { q: "Is it really free?", a: "Completely free with no sign-up. Everything runs in your browser." },
    ],
    related: ["case-converter", "ascii-art-generator", "word-counter"],
  },
  {
    slug: "ascii-art-generator",
    name: "ASCII Art Generator",
    tagline: "Turn any image into ASCII art.",
    description:
      "Free ASCII art generator. Turn a photo or image into text-based ASCII art, adjust the detail, and copy or download it. Runs entirely in your browser — no upload.",
    keywords: ["ascii art generator", "image to ascii", "photo to ascii art", "ascii art", "text art generator"],
    icon: TerminalIcon,
    intro:
      "Turn any image or photo into ASCII art — a picture made of text characters. Upload an image, adjust the width and contrast, then copy the result or download it as a .txt file. Everything runs in your browser, so your image is never uploaded.",
    steps: ["Upload an image.", "Adjust the width and, if needed, invert for dark backgrounds.", "Copy the ASCII art or download it as text."],
    faqs: [
      { q: "What makes a good ASCII art source?", a: "High-contrast images with a clear subject work best. Increase the width for more detail, or lower it for a chunkier, more classic look." },
      { q: "Where can I use the result?", a: "Anywhere monospaced text is supported — code comments, README files, terminals, Discord code blocks, and forum posts." },
    ],
    related: ["fancy-text-generator", "image-to-text", "meme-generator"],
  },
  {
    slug: "passport-photo-maker",
    name: "Passport Photo Maker",
    tagline: "Make a passport-size photo (US, UK, EU, India…).",
    description:
      "Free passport photo maker. Crop and resize a photo to standard passport sizes (US 2×2 in, UK/EU 35×45 mm, India, Canada, China) at 300 DPI, and download a single photo or a printable 4×6 sheet. Runs in your browser.",
    keywords: ["passport photo maker", "passport size photo", "passport photo online", "id photo maker", "2x2 photo", "35x45 photo"],
    icon: IdCardIcon,
    intro:
      "Turn a photo into a passport-size picture. Pick your country's size (US 2×2 in, UK/EU/Schengen 35×45 mm, India, Canada, China), drag and zoom to position your face, and download a print-ready photo at 300 DPI — or a 4×6 inch sheet tiled with multiple copies for cheap printing. Everything runs in your browser.",
    steps: [
      "Upload your photo.",
      "Choose the passport size and drag/zoom to position your face.",
      "Download a single photo or a 4×6 print sheet.",
    ],
    faqs: [
      { q: "Which sizes are supported?", a: "US (2×2 in), UK/EU/Schengen (35×45 mm), India (35×45 mm), Canada (50×70 mm), and China (33×48 mm) — all exported at 300 DPI for printing." },
      { q: "Will it meet official requirements?", a: "It gives you the correct size and resolution, but you're responsible for the photo itself — a plain light background, correct head size, neutral expression, and good lighting. Always check your country's official guidelines." },
      { q: "Are my photos uploaded?", a: "No — cropping and export happen entirely in your browser, so your photo never leaves your device." },
    ],
    related: ["crop-image", "circle-crop", "remove-background"],
  },
  {
    slug: "chat-with-pdf",
    name: "Chat with PDF",
    tagline: "Upload a PDF and ask it questions.",
    description:
      "Free AI Chat with PDF. Upload a document and ask questions in plain English — get answers, summaries, and key points drawn straight from the file. The PDF is read in your browser. Free daily use; unlimited on Pro.",
    keywords: ["chat with pdf", "ask pdf questions", "ai pdf reader", "talk to your pdf", "pdf question answering"],
    icon: MessagesSquareIcon,
    intro:
      "Turn any PDF into something you can talk to. Upload a document — a report, contract, paper, or manual — and ask questions in plain English to get answers, summaries, and the key points, drawn from the document itself. The text is extracted right in your browser; only that text (not the file) is sent to the AI to answer. Free users get a few questions a day; Pro is unlimited.",
    steps: ["Upload a PDF (the text is read in your browser).", "Ask a question, or pick a starter prompt.", "Get an answer grounded in the document — keep the conversation going."],
    faqs: [
      { q: "What kind of PDFs work?", a: "PDFs with selectable text (exported from Word, Google Docs, most tools). Scanned image-only PDFs won't work unless they've been OCR'd first — try the Image to Text tool for those." },
      { q: "Is my document uploaded?", a: "The file itself never leaves your browser — the text is extracted locally, and only that text is sent to the AI to answer your question." },
      { q: "Is there a size limit?", a: "Very long documents are truncated (answers use roughly the first 60,000 characters) to keep responses fast." },
    ],
    related: ["pdf-to-text", "ai-summarizer", "merge-pdf"],
    pro: true,
    serverSide: true,
  },
  {
    slug: "image-upscaler",
    name: "AI Image Upscaler",
    tagline: "Upscale and sharpen images 2× with AI.",
    description:
      "Free AI image upscaler. Increase image resolution 2× and sharpen details with an on-device AI model — great for small or blurry photos. No upload, no sign-up; runs in your browser.",
    keywords: ["image upscaler", "ai image upscaler", "upscale image", "enhance photo", "increase image resolution", "upscale image free"],
    icon: ImageUpscaleIcon,
    intro:
      "Make small or low-resolution images bigger and sharper. This AI upscaler doubles the resolution and reconstructs detail using a super-resolution model that runs entirely on your device — your image is never uploaded. The model downloads once on first use; larger images take longer and use more memory.",
    steps: ["Upload an image.", "Click Upscale 2× and wait as the model processes it.", "Compare before/after and download the result."],
    faqs: [
      { q: "Is it really free and private?", a: "Yes — the upscaling runs in your browser on your own device, so it's free with no sign-up and your image is never uploaded to a server." },
      { q: "How much does it enlarge?", a: "It upscales by 2× (e.g., 500×500 → 1000×1000) while reconstructing detail, which looks far better than a plain resize." },
      { q: "Why is the first run slow?", a: "The AI model (a few MB) downloads once and then is cached. Processing time also depends on the image size and your device — a GPU makes it much faster." },
    ],
    related: ["remove-background", "compress-image", "image-resizer"],
  },
];

// Hand-written tools plus the generated unit-conversion pages (feet↔cm, kg↔lbs,
// °C↔°F, …). Conversions are appended so search, categories, the sitemap, and
// metadata pick them up automatically.
export const devTools: DevTool[] = [...baseDevTools, ...conversionTools, ...imageFormatTools, ...gameTools, ...extraTools];

/** Exact number of tools. */
export const TOOL_COUNT = devTools.length;
/**
 * Marketing label for the tool count, rounded down to a tidy "N+" (e.g. 150+).
 * Single source of truth — metadata, JSON-LD, and page copy read this, so the
 * count never has to be hand-edited across files again.
 */
export const TOOL_COUNT_LABEL = `${Math.floor(devTools.length / 10) * 10}+`;

export function getTool(slug: string) {
  return devTools.find((t) => t.slug === slug);
}

/**
 * Tool → companion blog guide (blog slug). Consolidates topical authority by
 * linking each tool page to its how-to guide (the guides already link back).
 */
export const TOOL_GUIDES: Record<string, string> = {
  "jwt-decoder": "how-to-decode-a-jwt",
  "image-to-text": "how-to-extract-text-from-an-image",
  "pdf-to-word": "how-to-convert-pdf-to-word",
  "csv-to-xlsx": "how-to-convert-csv-to-excel",
  "merge-pdf": "how-to-merge-pdf-files-free",
  "pdf-to-images": "how-to-convert-pdf-to-jpg",
  "bulk-image-converter": "how-to-bulk-convert-and-resize-images",
  "compress-pdf": "how-to-compress-a-pdf",
  "url-to-pdf": "how-to-save-a-webpage-as-pdf",
  "heic-to-jpg": "how-to-convert-heic-to-jpg",
  "word-to-pdf": "how-to-convert-word-to-pdf",
  "excel-to-pdf": "how-to-convert-excel-to-pdf",
  "powerpoint-to-pdf": "how-to-convert-powerpoint-to-pdf",
  "compress-image": "how-to-compress-an-image",
  "crop-image": "how-to-crop-an-image-online",
  "audio-converter": "how-to-convert-audio-to-mp3",
  "enhance-audio": "how-to-remove-background-noise-from-audio",
  "pdf-to-pptx": "how-to-convert-pdf-to-powerpoint",
  "html-to-pdf": "how-to-convert-html-to-pdf",
  "svg-to-png": "how-to-convert-svg-to-png",
  "json-xml": "how-to-convert-json-to-xml",
  "markdown-to-pdf": "how-to-convert-markdown-to-pdf",
  "json-formatter": "how-to-format-and-validate-json",
  "password-generator": "how-to-create-a-strong-password",
  base64: "what-is-base64-encoding",
  "ai-humanizer": "how-to-humanize-ai-text",
  "qr-scanner": "how-to-scan-a-qr-code",
  "meme-generator": "how-to-make-a-meme",
  "invoice-generator": "how-to-make-a-free-invoice",
  "time-calculator": "how-to-add-and-subtract-time",
  "color-picker-from-image": "how-to-get-hex-color-from-image",
  "image-to-svg": "how-to-convert-image-to-svg",
  "unlock-pdf": "how-to-unlock-a-pdf",
  "protect-pdf": "how-to-password-protect-a-pdf",
  "online-notepad": "free-online-notepad",
  "business-name-generator": "how-to-come-up-with-a-business-name",
  "pomodoro-timer": "what-is-the-pomodoro-technique",
  "cidr-calculator": "cidr-subnet-cheat-sheet",
  "remove-background": "how-to-remove-image-background",
  "qr-code": "how-to-add-a-logo-to-a-qr-code",
  "css-minifier": "how-to-minify-css-javascript-html",
  "js-minifier": "how-to-minify-css-javascript-html",
  "html-minifier": "how-to-minify-css-javascript-html",
  "jpg-to-webp": "how-to-convert-image-to-webp",
  "typing-speed-test": "what-is-a-good-typing-speed",
  "cps-test": "what-is-a-good-cps",
  "due-date-calculator": "how-to-calculate-your-due-date",
  "mortgage-calculator": "how-to-calculate-a-mortgage-payment",
  "what-is-my-ip": "what-is-my-ip-address",
  "word-frequency": "how-to-count-word-frequency",
  "barcode-generator": "how-to-generate-a-barcode",
  "salary-calculator": "how-to-convert-hourly-wage-to-salary",
  "reaction-time-test": "average-human-reaction-time",
  "markdown-editor": "markdown-cheat-sheet",
  "text-to-speech": "how-to-convert-text-to-speech",
  "countdown-to-date": "how-to-make-a-countdown-to-a-date",
  "scientific-calculator": "order-of-operations-pemdas",
};

/**
 * Curated "most-used" tools for the fast-path strip at the top of /tools.
 * Hand-picked (no analytics yet) to cover the highest-traffic intents.
 */
// Curated "Popular tools" strip on /tools (also feeds llms.txt). Kept aligned
// with what actually earns search impressions so the hub funnels internal link
// equity into the pages closest to breaking onto page 1.
export const POPULAR_SLUGS: string[] = [
  "merge-pdf",
  "compress-pdf",
  "pdf-to-word",
  "word-to-pdf",
  "jwt-decoder",
  "image-to-text",
  "remove-background",
  "compress-image",
  "image-converter",
  "bulk-image-converter",
  "word-counter",
  "word-frequency",
  "password-generator",
  "json-formatter",
  "cps-test",
  "typing-speed-test",
  "scientific-calculator",
  "text-to-speech",
  "what-is-my-ip",
  "barcode-generator",
  "birthday-card-maker",
];

/** URL of the dynamic branded OG image for a page (see app/og/route.tsx). */
export function ogImageUrl(p: { eyebrow?: string; title: string; subtitle?: string }): string {
  const q = new URLSearchParams();
  if (p.eyebrow) q.set("eyebrow", p.eyebrow);
  q.set("title", p.title);
  if (p.subtitle) q.set("subtitle", p.subtitle);
  return `${SITE_URL}/og?${q.toString()}`;
}

/**
 * Full page metadata for a tool — title, description, keywords, canonical, and
 * per-tool Open Graph / Twitter (so social previews name the actual tool
 * instead of inheriting the site-wide card). Used by every tool page.
 */
export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  if (!tool) return {};
  const path = `/tools/${slug}`;
  const ogTitle = `${tool.name} · ${SITE_NAME}`;
  const cat = getToolCategory(slug);
  const image = ogImageUrl({
    eyebrow: cat ? `${cat.name} tool` : "Online tool",
    title: tool.name,
    subtitle: tool.tagline,
  });
  const images = [{ url: image, width: 1200, height: 630 }];
  return {
    title: tool.name,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      title: ogTitle,
      description: tool.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: tool.description,
      images,
    },
  };
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
    name: "AI",
    blurb: "Chat with PDFs, summarize, rewrite, translate, and fix text with AI.",
    slugs: [
      "chat-with-pdf",
      "ai-summarizer",
      "ai-paraphraser",
      "ai-humanizer",
      "tone-changer",
      "text-expander",
      "text-shortener",
      "simplify-text",
      "ai-translator",
      "ai-grammar-checker",
      "ai-email-writer",
      "cover-letter-generator",
      "resume-summary-generator",
      "business-name-generator",
      "slogan-generator",
      "bio-generator",
      "hashtag-generator",
      "headline-generator",
      "caption-generator",
      "product-description-generator",
      "faq-generator",
    ],
  },
  {
    name: "Video & GIF",
    blurb: "Convert, compress, trim, and extract — in your browser.",
    slugs: ["screen-recorder", "video-to-gif", "video-to-mp4", "compress-video", "trim-video", "video-to-mp3"],
  },
  {
    name: "Audio",
    blurb: "Convert, trim, merge, clean, and adjust audio — in your browser.",
    slugs: ["audio-converter", "trim-audio", "merge-audio", "change-volume", "enhance-audio"],
  },
  {
    name: "Image Editing",
    blurb: "Crop, rotate, add text, and more — in your browser.",
    slugs: ["remove-background", "image-upscaler", "crop-image", "rotate-image", "circle-crop", "passport-photo-maker", "add-text-to-image", "meme-generator", "color-picker-from-image", "image-to-ico"],
  },
  {
    name: "Productivity",
    blurb: "Notepad, timers, invoices, and everyday utilities.",
    slugs: ["online-notepad", "text-to-speech", "stopwatch", "countdown-timer", "countdown-to-date", "pomodoro-timer", "invoice-generator"],
  },
  {
    name: "Developer",
    blurb: "Format, inspect, test, and generate with AI.",
    slugs: [
      "regex-generator",
      "sql-generator",
      "code-explainer",
      "commit-message-generator",
      "cron-generator",
      "json-formatter",
      "sql-formatter",
      "xml-formatter",
      "code-beautifier",
      "markdown-editor",
      "json-to-typescript",
      "jwt-decoder",
      "regex-tester",
      "cron-explainer",
      "color-contrast-checker",
      "chmod-calculator",
      "cidr-calculator",
      "what-is-my-ip",
      "credit-card-validator",
      "password-strength-checker",
      "bcrypt-generator",
      "svg-optimizer",
      "html-minifier",
      "css-minifier",
      "js-minifier",
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
      ...imageFormatSlugs,
      "unit-converter",
      "timezone-converter",
      "currency-converter",
      "json-yaml",
      "csv-to-xlsx",
      "xlsx-to-csv",
      "markdown-to-html",
      "markdown-to-pdf",
      "html-to-markdown",
      "image-converter",
      "image-resizer",
      "compress-image",
      "bulk-image-converter",
      "svg-to-png",
      "svg-to-image",
      "image-to-svg",
      "heic-to-jpg",
      "heic-to-png",
      "image-to-text",
      "base64",
      "url-encoder",
      "html-entities",
      "string-escape",
      "json-to-csv",
      "json-xml",
      "image-to-base64",
      "text-to-binary",
      "number-base-converter",
      "roman-numeral",
      "color-converter",
      "timestamp-converter",
    ],
  },
  {
    name: "Unit Conversions",
    blurb: "Convert length, weight, and temperature — feet to cm, kg to lbs, °C to °F, and more.",
    slugs: [...conversionSlugs],
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
      "html-to-pdf",
      "office-to-pdf",
      "word-to-pdf",
      "powerpoint-to-pdf",
      "excel-to-pdf",
      "pdf-to-word",
      "pdf-to-pptx",
      "sign-pdf",
      "rotate-pdf",
      "delete-pdf-pages",
      "pdf-page-numbers",
      "watermark-pdf",
      "protect-pdf",
      "unlock-pdf",
    ],
  },
  {
    name: "Calculators",
    blurb: "Everyday math, money, and dates.",
    slugs: [
      "scientific-calculator",
      "percentage-calculator",
      "tip-calculator",
      "discount-calculator",
      "gst-vat-calculator",
      "loan-calculator",
      "mortgage-calculator",
      "salary-calculator",
      "compound-interest-calculator",
      "bmi-calculator",
      "bmr-calculator",
      "calorie-calculator",
      "ideal-weight-calculator",
      "fraction-calculator",
      "gpa-calculator",
      "final-grade-calculator",
      "aspect-ratio-calculator",
      "age-calculator",
      "date-difference",
      "due-date-calculator",
      "time-calculator",
    ],
  },
  {
    name: "Text",
    blurb: "Work with words and strings.",
    slugs: [
      "fancy-text-generator",
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
      "qr-scanner",
      "barcode-generator",
      "css-gradient-generator",
      "box-shadow-generator",
      "color-shades-generator",
      "ascii-art-generator",
      "password-generator",
      "random-string",
      "random-number-generator",
      "uuid-generator",
      "hash-generator",
      "spin-the-wheel",
      "random-picker",
      "coin-flip",
      "dice-roller",
    ],
  },
  {
    name: "Games & Tests",
    blurb: "Fun browser challenges — click speed, reaction time, and keyboard tests.",
    slugs: [...gameSlugs],
  },
  {
    name: "Cards & Invitations",
    blurb: "Create animated cards and invitations, then share the link.",
    slugs: ["birthday-card-maker", "wedding-invitation-maker", "engagement-invitation-maker", "anniversary-card-maker"],
  },
];

// ── Category landing pages ───────────────────────────────────────────────────
// Dedicated, indexable pages per category (e.g. /tools/pdf) that target the
// fat head terms individual tool pages can't rank for ("pdf tools", etc.).
export type CategoryPage = {
  slug: string; // URL segment under /tools
  name: string; // must match a toolCategories name
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  h1: string;
  intro: string;
  faqs: ToolFaq[];
  /** Curated tool list (overrides the category's default slugs, e.g. a
   * cross-category collection like "image"). */
  toolSlugs?: string[];
};

export const categoryPages: CategoryPage[] = [
  {
    slug: "unit-conversions",
    name: "Unit Conversions",
    seoTitle: "Unit Conversion Tools",
    seoDescription:
      "Free unit conversion tools — feet to cm, cm to inches, kg to lbs, °C to °F, km to miles, and more. Accurate, instant, with formulas and reference tables. Runs in your browser.",
    keywords: [
      "unit conversion",
      "feet to cm",
      "cm to inches",
      "kg to lbs",
      "celsius to fahrenheit",
      "km to miles",
      "convert units",
    ],
    h1: "Unit conversion tools",
    intro:
      "Convert length, weight, and temperature between metric and imperial units — feet to centimeters, kilograms to pounds, Celsius to Fahrenheit, and many more. Each converter is instant and two-way, and shows the exact formula plus a reference table for common values. Everything runs in your browser.",
    faqs: [
      {
        q: "Are these converters accurate?",
        a: "Yes — they use the exact internationally defined factors (for example, 1 inch = 2.54 cm and 1 pound = 0.45359237 kg), and temperatures use the proper offset formulas rather than simple ratios.",
      },
      {
        q: "Do I need to press a button to convert?",
        a: "No. Every converter updates as you type, and works in both directions — type in either box to convert back and forth.",
      },
      {
        q: "Do you need a more general converter?",
        a: "For categories beyond these — volume, area, speed, digital storage, and time — use the all-in-one Unit Converter, which converts across every unit in a category at once.",
      },
    ],
  },
  {
    slug: "pdf",
    name: "PDF",
    seoTitle: "PDF Tools",
    seoDescription:
      "Free online PDF tools — merge, split, compress, rotate, watermark, add page numbers, sign, and convert PDF to and from Word, images, and text. Fast and private.",
    keywords: ["pdf tools", "merge pdf", "split pdf", "compress pdf", "pdf to word", "word to pdf", "edit pdf online"],
    h1: "Free PDF tools",
    intro:
      "Everything you need to work with PDFs — merge, split, compress, rotate, watermark, number, and sign, plus conversions to and from Word, images, and plain text. Most tools run right in your browser, so your files stay private.",
    faqs: [
      { q: "Are these PDF tools free?", a: "Yes. The core PDF tools are free and unlimited with no sign-up. A few advanced conversions (like Word↔PDF) are Pro features." },
      { q: "Are my PDFs uploaded to a server?", a: "Most PDF tools run entirely in your browser, so your files never leave your device. The advanced Office conversions are processed securely on our server and deleted right after." },
      { q: "Is there a file size limit?", a: "Browser-based tools are limited mainly by your device's memory; server conversions accept files up to 15 MB." },
    ],
  },
  {
    slug: "converters",
    name: "Converters",
    seoTitle: "Online Converters",
    seoDescription:
      "Free online converters — convert images (JPG, PNG, WebP, HEIC), extract text with OCR, Markdown ↔ HTML, Base64, JSON/YAML/CSV, units, timezones, and number bases. Browser-based and private.",
    keywords: ["online converter", "image converter", "heic to jpg", "markdown to html", "base64 converter", "unit converter", "image to text"],
    h1: "Free online converters",
    intro:
      "Convert between formats without installing anything — images, documents, data, units, and more. Everything runs in your browser unless noted, so your files stay on your device.",
    faqs: [
      { q: "Do these converters upload my files?", a: "No — image, text, and data converters run locally in your browser. Your files are never uploaded." },
      { q: "What image formats are supported?", a: "JPG, PNG, WebP, and HEIC, plus resizing, compression, and OCR (image to text)." },
    ],
  },
  {
    slug: "developer",
    name: "Developer",
    seoTitle: "Developer Tools",
    seoDescription:
      "Free online developer tools — JSON, SQL, and XML formatters, JWT decoder, regex tester, cron explainer, chmod and CIDR calculators, hashing, and validators. Fast, private, browser-based.",
    keywords: ["developer tools", "online dev tools", "json formatter", "jwt decoder", "regex tester", "cron expression", "hash generator"],
    h1: "Free developer tools",
    intro:
      "A fast, private toolkit for everyday development — format and validate code and data, decode tokens, test regular expressions, explain cron schedules, and more. No sign-up, nothing uploaded.",
    faqs: [
      { q: "Do these tools send my data anywhere?", a: "No. Every developer tool runs entirely in your browser — your code, tokens, and data never leave your device." },
      { q: "Is the JWT decoder safe to use?", a: "Yes — decoding happens locally in your browser, so your tokens are never transmitted or stored." },
    ],
  },
  {
    slug: "image",
    name: "Converters",
    seoTitle: "Image Tools",
    seoDescription:
      "Free online image tools — convert JPG, PNG, WebP, and HEIC, resize and compress images, bulk-convert, extract text with OCR, and turn images into PDFs. Private and browser-based.",
    keywords: ["image tools", "image converter", "compress image", "resize image", "heic to jpg", "image to text", "images to pdf"],
    h1: "Free image tools",
    intro:
      "Convert, resize, compress, and read text from images — all in your browser, so your photos never get uploaded. Handle one image or batches of them in seconds.",
    faqs: [
      { q: "Are my images uploaded?", a: "No — image tools process everything locally in your browser. Your images never leave your device." },
      { q: "Can I convert HEIC photos from my iPhone?", a: "Yes — convert HEIC to JPG or PNG instantly, right in the browser." },
    ],
    toolSlugs: [
      "image-converter",
      "image-resizer",
      "compress-image",
      "bulk-image-converter",
      "svg-to-png",
      "svg-to-image",
      "image-to-svg",
      "heic-to-jpg",
      "heic-to-png",
      "image-to-text",
      "remove-background",
      "images-to-pdf",
      "pdf-to-images",
      "image-to-base64",
      "favicon-generator",
    ],
  },
  {
    slug: "calculators",
    name: "Calculators",
    seoTitle: "Online Calculators",
    seoDescription:
      "Free online calculators — percentage, tip, discount, GST/VAT, loan, BMI, BMR, GPA, aspect ratio, age, and date difference. Instant, accurate, no sign-up.",
    keywords: ["online calculator", "percentage calculator", "loan calculator", "bmi calculator", "age calculator", "discount calculator"],
    h1: "Free online calculators",
    intro:
      "Quick, accurate calculators for money, health, dates, and everyday math. Each one works instantly in your browser — no sign-up required.",
    faqs: [
      { q: "Are these calculators free?", a: "Yes — every calculator is completely free to use, with no account and no limits." },
      { q: "Do they work on mobile?", a: "Yes — all calculators are responsive and work on phones, tablets, and desktops." },
    ],
  },
  {
    slug: "text",
    name: "Text",
    seoTitle: "Text Tools",
    seoDescription:
      "Free online text tools — word counter, case converter, find & replace, remove line breaks, strip HTML, word frequency, text diff, slugify, and lorem ipsum. Fast and private.",
    keywords: ["text tools", "word counter", "case converter", "text diff", "remove line breaks", "strip html"],
    h1: "Free text tools",
    intro:
      "Clean up, transform, and analyze text without leaving your browser — count words, change case, find and replace, compare versions, and more. Nothing is uploaded.",
    faqs: [
      { q: "Is my text sent to a server?", a: "No — every text tool runs locally in your browser, so your content stays private." },
      { q: "Is there a length limit?", a: "You can paste large amounts of text; the practical limit is your device's memory." },
    ],
  },
  {
    slug: "generators",
    name: "Generators",
    seoTitle: "Online Generators",
    seoDescription:
      "Free online generators — QR codes, Wi-Fi QR, bulk QR, CSS gradients, box-shadows, color shades, strong passwords, random strings and numbers, UUIDs, and hashes.",
    keywords: ["qr code generator", "password generator", "uuid generator", "css gradient generator", "hash generator", "wifi qr code"],
    h1: "Free online generators",
    intro:
      "Generate the codes, styles, and values you need in seconds — QR codes, CSS effects, secure passwords, UUIDs, and more. Everything runs privately in your browser.",
    faqs: [
      { q: "Are generated passwords safe?", a: "Yes — passwords and random values are generated locally in your browser and never transmitted or stored." },
      { q: "Can I create QR codes for free?", a: "Yes — static QR codes are free. Dynamic QR codes with scan analytics and branding are Pro features." },
    ],
  },
  {
    slug: "web-seo",
    name: "Web & SEO",
    seoTitle: "Web & SEO Tools",
    seoDescription:
      "Free web & SEO tools — UTM campaign link builder, meta tag generator with live preview, and favicon generator. Ship and market your site faster.",
    keywords: ["seo tools", "utm builder", "meta tag generator", "favicon generator", "open graph tags"],
    h1: "Free web & SEO tools",
    intro:
      "Handy utilities for shipping and marketing a website — build trackable campaign links, generate SEO and Open Graph meta tags, and create favicons. All free and browser-based.",
    faqs: [
      { q: "Are these tools free?", a: "Yes — every web & SEO tool here is free to use with no sign-up." },
      { q: "Do the meta tags work for social sharing?", a: "Yes — the meta tag generator produces title, description, and Open Graph tags for search engines and social previews." },
    ],
  },
  {
    slug: "ai",
    name: "AI",
    seoTitle: "AI Text Tools",
    seoDescription:
      "AI-powered text tools — summarize, paraphrase, humanize, translate, fix grammar, change tone, write emails, and more. Free daily runs; unlimited on Pro.",
    keywords: ["ai tools", "ai text tools", "ai summarizer", "ai paraphraser", "ai translator", "ai grammar checker"],
    h1: "AI text tools",
    intro:
      "Summarize, rewrite, humanize, translate, and proofread text — plus change tone, expand or shorten, write emails, product descriptions, and captions. Paste your text and get natural results in seconds. Free users get a few runs a day; go Pro for unlimited.",
    faqs: [
      { q: "Which AI powers these tools?", a: "They use leading large language models to produce high-quality, context-aware results." },
      { q: "Are the AI tools free?", a: "Yes, with a daily limit — sign in and you get a set number of free AI runs per day. The underlying AI has a per-use cost, so unlimited use is part of Pro." },
      { q: "Is my text stored?", a: "No — your text is sent to the AI model to produce the result and is not stored on our servers afterward." },
    ],
  },
  {
    slug: "video",
    name: "Video & GIF",
    seoTitle: "Video & GIF Tools",
    seoDescription:
      "Free online video tools — convert video to GIF or MP4, compress video, trim clips, and extract audio to MP3. Everything runs in your browser; nothing is uploaded.",
    keywords: ["video tools", "video to gif", "video to mp4", "compress video", "trim video", "video to mp3"],
    h1: "Free video & GIF tools",
    intro:
      "Convert, compress, trim, and extract audio from videos — all in your browser, so your files never leave your device. No sign-up, no watermarks. Best for short clips.",
    faqs: [
      { q: "Are my videos uploaded?", a: "No — these tools process video locally in your browser using an in-page engine, so your files never leave your device." },
      { q: "Why is there a file size limit?", a: "Processing happens in your browser's memory, so large videos can be slow or fail. Short clips work best." },
      { q: "Do I need an account?", a: "No — every video tool is free and works instantly with no sign-up." },
    ],
  },
  {
    slug: "audio",
    name: "Audio",
    seoTitle: "Audio Tools",
    seoDescription:
      "Free online audio tools — convert audio to MP3/WAV/M4A, trim and cut clips, merge tracks, and change or normalize volume. Everything runs in your browser; nothing is uploaded.",
    keywords: ["audio tools", "audio converter", "trim audio", "merge audio", "change audio volume", "mp3 cutter"],
    h1: "Free audio tools",
    intro:
      "Convert, trim, merge, and adjust the volume of audio files — all in your browser, so your files never leave your device. No sign-up, no watermarks.",
    faqs: [
      { q: "Are my audio files uploaded?", a: "No — these tools process audio locally in your browser using an in-page engine, so your files never leave your device." },
      { q: "What formats can I convert to?", a: "MP3, WAV, and M4A (AAC). Trimming keeps the original format; merging and volume changes output MP3." },
      { q: "Do I need an account?", a: "No — every audio tool is free and works instantly with no sign-up." },
    ],
  },
  {
    slug: "image-editing",
    name: "Image Editing",
    seoTitle: "Image Editing Tools",
    seoDescription:
      "Free online image editing tools — crop, rotate, flip, circle-crop for avatars, add text to photos, and convert images to ICO. Everything runs in your browser; nothing is uploaded.",
    keywords: ["image editing tools", "crop image", "rotate image", "add text to image", "circle crop", "image to ico"],
    h1: "Free image editing tools",
    intro:
      "Crop, rotate, flip, round-crop, and caption your images — all in your browser, so your photos never leave your device. No sign-up, no watermarks.",
    faqs: [
      { q: "Are my images uploaded?", a: "No — every image editing tool runs locally in your browser, so your photos never leave your device." },
      { q: "What formats can I edit?", a: "JPG, PNG, WebP, and most common image formats. Crop, rotate, and text keep your format; circle-crop outputs a transparent PNG and Image to ICO outputs a .ico file." },
      { q: "Do I need an account?", a: "No — all image editing tools are free with no sign-up." },
    ],
  },
  {
    slug: "productivity",
    name: "Productivity",
    seoTitle: "Productivity Tools",
    seoDescription:
      "Free online productivity tools — an autosaving notepad, stopwatch, countdown and Pomodoro timers, and an invoice generator. In your browser, no sign-up.",
    keywords: ["productivity tools", "online notepad", "online timer", "pomodoro timer", "invoice generator", "stopwatch"],
    h1: "Free productivity tools",
    intro:
      "Everyday utilities that just work — jot notes that autosave, time your focus sessions, listen to text read aloud, and generate a clean invoice PDF. Everything runs in your browser, so your data stays on your device.",
    faqs: [
      { q: "Do these tools upload my data?", a: "No — they run entirely in your browser. Your notes, invoices, and text never leave your device." },
      { q: "Do I need an account?", a: "No — every productivity tool here is free and works instantly with no sign-up." },
    ],
  },
  {
    slug: "games",
    name: "Games & Tests",
    seoTitle: "Games & Tests",
    seoDescription:
      "Free browser games and tests — CPS click speed test, reaction time test, keyboard tester, spin the wheel, dice roller, and coin flip. No sign-up, play instantly.",
    keywords: ["cps test", "click speed test", "reaction time test", "keyboard tester", "online tests", "browser games"],
    h1: "Games & tests",
    intro:
      "Quick browser challenges you can play in seconds — measure your click speed (CPS), test your reaction time, and check every key on your keyboard, plus classic randomizers like spin the wheel, dice, and coin flip. Everything runs in your browser, with no sign-up and nothing to install.",
    faqs: [
      { q: "Are these games and tests free?", a: "Yes — every game and test here is completely free, with no account and no limits. Just open one and start." },
      { q: "Do they work on mobile?", a: "The click speed and reaction tests work great on touchscreens. The keyboard tester needs a physical keyboard, so it's best on a laptop or desktop." },
      { q: "Are my scores saved?", a: "Your best scores are stored privately on your own device (in your browser), never uploaded — so they're there when you come back to beat them." },
    ],
    toolSlugs: [
      "cps-test",
      "reaction-time-test",
      "typing-speed-test",
      "spacebar-counter",
      "keyboard-tester",
      "spin-the-wheel",
      "random-picker",
      "coin-flip",
      "dice-roller",
    ],
  },
  {
    slug: "cards",
    name: "Cards & Invitations",
    seoTitle: "Card & Invitation Makers",
    seoDescription:
      "Free animated card & invitation makers — birthday cards, wedding and engagement invitations, and anniversary cards. Personalize and share a link. No sign-up.",
    keywords: ["card maker", "invitation maker", "birthday card maker", "wedding invitation maker", "engagement invitation", "anniversary card"],
    h1: "Card & invitation makers",
    intro:
      "Create beautiful animated cards and invitations in minutes — birthdays, weddings, engagements, and anniversaries. Personalize the names, message, photo, theme, and music, then share a link that opens as a full-screen animated card. Everything runs in your browser, with no sign-up.",
    faqs: [
      { q: "Are these card makers free?", a: "Yes — every card and invitation maker is free to use with no sign-up. The card is encoded in the share link, so nothing is stored on our servers." },
      { q: "How do people open the card?", a: "They just tap the link — it opens as a full-screen animated card on any phone or computer, no app needed. Great for WhatsApp." },
      { q: "Can I add a photo and music?", a: "Yes — add a photo and turn on music, and they play when the card is opened. Pro adds custom colors, no watermark, and image or video downloads." },
    ],
  },
];

export function getCategoryPage(slug: string) {
  return categoryPages.find((c) => c.slug === slug);
}

/** URL slug of the canonical category-landing page for a category name. */
export function categorySlugForName(name: string): string | undefined {
  return categoryPages.find((c) => c.name === name)?.slug;
}

/** The tool slugs shown on a category page (curated override or the category default). */
export function categoryPageToolSlugs(cat: CategoryPage): string[] {
  if (cat.toolSlugs) return cat.toolSlugs;
  return toolCategories.find((c) => c.name === cat.name)?.slugs ?? [];
}

/** URL for the category-landing page a tool belongs to (falls back to the hub). */
export function categoryPathForTool(slug: string): string {
  const cat = getToolCategory(slug);
  const page = cat && categoryPages.find((c) => c.name === cat.name);
  return page ? `/tools/${page.slug}` : "/tools";
}

/** Full page metadata for a category landing page. */
export function categoryMetadata(slug: string): Metadata {
  const cat = getCategoryPage(slug);
  if (!cat) return {};
  const path = `/tools/${slug}`;
  const ogTitle = `${cat.seoTitle} · ${SITE_NAME}`;
  const image = ogImageUrl({
    eyebrow: "Free tools",
    title: cat.h1,
    subtitle: cat.seoDescription,
  });
  const images = [{ url: image, width: 1200, height: 630 }];
  return {
    title: cat.seoTitle,
    description: cat.seoDescription,
    keywords: cat.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      title: ogTitle,
      description: cat.seoDescription,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: cat.seoDescription,
      images,
    },
  };
}
