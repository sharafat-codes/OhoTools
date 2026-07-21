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
  type LucideIcon,
} from "lucide-react";

export type DevTool = {
  slug: string;
  name: string;
  tagline: string;
  description: string; // used for <meta description>
  keywords: string[];
  icon: LucideIcon;
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
  },
  {
    slug: "base64",
    name: "Base64 Encode / Decode",
    tagline: "Convert text to and from Base64 with full Unicode support.",
    description:
      "Free online Base64 encoder and decoder. Convert text to Base64 and back instantly, with full Unicode support — right in your browser.",
    keywords: ["base64 encode", "base64 decode", "base64 converter"],
    icon: BinaryIcon,
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    tagline: "Generate random UUID v4 identifiers, one or many at a time.",
    description:
      "Free online UUID generator. Instantly create cryptographically random version 4 UUIDs, one or many at once.",
    keywords: ["uuid generator", "guid generator", "uuid v4", "random uuid"],
    icon: FingerprintIcon,
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Create strong, random passwords with custom rules.",
    description:
      "Free online password generator. Create strong, random, secure passwords with custom length and character sets — instantly and privately in your browser.",
    keywords: ["password generator", "strong password", "random password", "secure password"],
    icon: KeyRoundIcon,
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Count words, characters, sentences, and reading time.",
    description:
      "Free online word counter. Count words, characters, sentences, and paragraphs with reading time — live as you type.",
    keywords: ["word counter", "character counter", "count words", "character count"],
    icon: TypeIcon,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    tagline: "Convert text between UPPER, lower, Title, camelCase, and more.",
    description:
      "Free online case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case.",
    keywords: ["case converter", "uppercase", "lowercase", "title case", "text case converter"],
    icon: CaseSensitiveIcon,
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    tagline: "Decode and inspect JSON Web Token header and payload.",
    description:
      "Free online JWT decoder. Decode and inspect a JSON Web Token's header and payload instantly and privately in your browser.",
    keywords: ["jwt decoder", "decode jwt", "json web token", "jwt parser"],
    icon: FileKey2Icon,
  },
  {
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    tagline: "Convert Unix epoch time to dates and back.",
    description:
      "Free online Unix timestamp converter. Convert epoch time to human-readable dates and back, in seconds or milliseconds.",
    keywords: ["unix timestamp converter", "epoch converter", "timestamp to date", "epoch time"],
    icon: ClockIcon,
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    tagline: "Percent-encode and decode URLs and query parameters.",
    description:
      "Free online URL encoder and decoder. Percent-encode and decode URLs and query parameters instantly in your browser.",
    keywords: ["url encoder", "url decoder", "percent encoding", "encodeuricomponent"],
    icon: LinkIcon,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    tagline: "Compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes.",
    description:
      "Free online hash generator. Compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes of any text, right in your browser.",
    keywords: ["hash generator", "sha256 generator", "sha-256", "sha512", "checksum"],
    icon: HashIcon,
  },
];

export function getTool(slug: string) {
  return devTools.find((t) => t.slug === slug);
}
