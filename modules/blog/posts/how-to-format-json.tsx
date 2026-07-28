import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-format-and-validate-json",
  title: "How to Format & Fix JSON (Common Errors)",
  description:
    "Learn how to format and validate JSON, minify it for production, and fix the most common JSON syntax errors — trailing commas, single quotes, and more.",
  keywords: [
    "how to format json",
    "validate json",
    "fix json errors",
    "json syntax error",
    "beautify json",
  ],
  date: "2026-07-22",
  readingMinutes: 5,
  tags: ["Developer", "JSON"],
  related: ["json-formatter", "json-to-typescript", "json-to-csv"],
};

export function Body() {
  return (
    <>
      <p>
        JSON is everywhere — API responses, config files, logs — but a single misplaced comma can
        break it. This guide covers how to format JSON so it&apos;s readable, how to minify it for
        production, and how to fix the errors you&apos;ll actually run into.
      </p>

      <h2>Format (beautify) vs. minify</h2>
      <p>
        <strong>Formatting</strong> (or beautifying) adds consistent indentation and line breaks so
        JSON is easy to read and diff. <strong>Minifying</strong> strips all whitespace to produce
        the smallest valid payload — ideal for sending over the wire. You want formatted JSON while
        developing and minified JSON in production.
      </p>
      <p>
        The fastest way to do either is our{" "}
        <Link href="/tools/json-formatter">JSON formatter</Link> — paste your JSON, click Format or
        Minify, and it validates as it goes. Everything runs in your browser, so even sensitive
        payloads stay on your device.
      </p>

      <h2>The most common JSON errors</h2>
      <h3>1. Trailing commas</h3>
      <p>
        JSON does not allow a comma after the last item. <code>{"{\"a\": 1,}"}</code> is invalid —
        remove the trailing comma to get <code>{"{\"a\": 1}"}</code>.
      </p>
      <h3>2. Single quotes</h3>
      <p>
        JSON strings and keys must use double quotes. <code>{"{'a': 1}"}</code> is invalid; it must
        be <code>{"{\"a\": 1}"}</code>.
      </p>
      <h3>3. Unquoted keys</h3>
      <p>
        Unlike JavaScript objects, JSON keys are always quoted. <code>{"{a: 1}"}</code> is invalid —
        write <code>{"{\"a\": 1}"}</code>.
      </p>
      <h3>4. Missing or extra commas</h3>
      <p>
        Every item except the last needs a comma between them. A validator points to the exact
        position of the problem, which is far faster than hunting by eye.
      </p>
      <h3>5. Comments</h3>
      <p>
        Standard JSON does not support <code>{"//"}</code> or <code>{"/* */"}</code> comments. Remove them,
        or use a format like JSON5 if your tooling supports it.
      </p>

      <h2>Validate before you ship</h2>
      <p>
        A quick validation step catches these before they cause a runtime error. Paste your JSON into
        the <Link href="/tools/json-formatter">formatter</Link>; if it&apos;s invalid, you&apos;ll get
        the exact error and location.
      </p>

      <h2>Turn JSON into something else</h2>
      <p>
        Once your JSON is valid, you can convert it:{" "}
        <Link href="/tools/json-to-typescript">generate TypeScript types</Link> from a sample
        response, or <Link href="/tools/json-to-csv">export it to CSV</Link> for a spreadsheet.
      </p>

      <h2>FAQ</h2>
      <h3>Why is my JSON invalid when it looks fine?</h3>
      <p>
        The usual culprits are a trailing comma, single quotes, or an unquoted key. A validator will
        point to the exact character.
      </p>
      <h3>Does formatting change my data?</h3>
      <p>No — formatting and minifying only change whitespace, never the values themselves.</p>
    </>
  );
}
