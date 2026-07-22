import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "free-browser-developer-tools",
  title: "15 Free Developer Tools That Run Entirely in Your Browser",
  description:
    "A roundup of fast, private developer tools that work 100% in your browser — no uploads, no sign-up. JSON, Base64, JWT, regex, hashing, and more.",
  keywords: [
    "free developer tools",
    "online developer tools",
    "browser developer tools",
    "free online dev tools",
    "privacy developer tools",
  ],
  date: "2026-07-22",
  readingMinutes: 4,
  tags: ["Developer", "Productivity"],
  related: ["json-formatter", "jwt-decoder", "base64", "regex-tester"],
};

export function Body() {
  return (
    <>
      <p>
        The best small developer tools have three things in common: they&apos;re fast, they don&apos;t
        require a login, and — crucially — they process your data <strong>in the browser</strong> so
        nothing sensitive is uploaded to a server. Here are 15 we reach for constantly, all free and
        all client-side.
      </p>

      <h2>Formatting &amp; data</h2>
      <ul>
        <li>
          <Link href="/tools/json-formatter">JSON Formatter</Link> — beautify, minify, and validate
          JSON with exact error messages.
        </li>
        <li>
          <Link href="/tools/json-to-typescript">JSON to TypeScript</Link> — generate types from a
          sample API response.
        </li>
        <li>
          <Link href="/tools/json-to-csv">JSON ↔ CSV</Link> — convert an array of objects to a
          spreadsheet and back.
        </li>
        <li>
          <Link href="/tools/text-diff">Text Diff Checker</Link> — compare two blocks line by line.
        </li>
      </ul>

      <h2>Encoding &amp; security</h2>
      <ul>
        <li>
          <Link href="/tools/base64">Base64 Encode / Decode</Link> — with full Unicode support.
        </li>
        <li>
          <Link href="/tools/jwt-decoder">JWT Decoder</Link> — inspect a token&apos;s header and
          payload without sending it anywhere.
        </li>
        <li>
          <Link href="/tools/hash-generator">Hash Generator</Link> — SHA-256/384/512 via the Web
          Crypto API.
        </li>
        <li>
          <Link href="/tools/url-encoder">URL Encoder / Decoder</Link> — percent-encode query
          values safely.
        </li>
        <li>
          <Link href="/tools/password-generator">Password Generator</Link> — strong, secure random
          passwords.
        </li>
      </ul>

      <h2>Text &amp; conversion</h2>
      <ul>
        <li>
          <Link href="/tools/regex-tester">Regex Tester</Link> — test patterns with live matches and
          capture groups.
        </li>
        <li>
          <Link href="/tools/case-converter">Case Converter</Link> — camelCase, snake_case,
          kebab-case, and more.
        </li>
        <li>
          <Link href="/tools/find-replace">Find &amp; Replace</Link> — bulk replace with regex
          support.
        </li>
        <li>
          <Link href="/tools/number-base-converter">Number Base Converter</Link> — binary, octal,
          decimal, hex.
        </li>
      </ul>

      <h2>Handy utilities</h2>
      <ul>
        <li>
          <Link href="/tools/uuid-generator">UUID Generator</Link> — cryptographically random v4
          IDs.
        </li>
        <li>
          <Link href="/tools/cidr-calculator">CIDR / Subnet Calculator</Link> — network, broadcast,
          host range, and mask from a prefix.
        </li>
      </ul>

      <h2>Why &quot;in the browser&quot; matters</h2>
      <p>
        Many online tools quietly upload whatever you paste to their servers. For a JWT, an API
        response, or an internal config, that&apos;s a real risk. Every tool above runs entirely on
        your device — the data never leaves your machine, so they&apos;re safe even for sensitive
        input. It&apos;s also faster: no round-trip to a server.
      </p>

      <p>
        Browse the full set on the <Link href="/tools">tools hub</Link> — there are more than 45,
        spanning developer, converter, text, calculator, and generator categories.
      </p>
    </>
  );
}
