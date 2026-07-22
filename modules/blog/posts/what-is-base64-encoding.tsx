import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "what-is-base64-encoding",
  title: "What Is Base64 Encoding? A Simple Guide with Examples",
  description:
    "Base64 explained in plain English: what it is, how it works, when to use it, and why it isn't encryption — with hands-on examples.",
  keywords: [
    "what is base64",
    "base64 encoding explained",
    "how does base64 work",
    "base64 example",
    "is base64 encryption",
  ],
  date: "2026-07-22",
  readingMinutes: 4,
  tags: ["Developer", "Encoding"],
  related: ["base64", "image-to-base64", "url-encoder"],
};

export function Body() {
  return (
    <>
      <p>
        Base64 is a way to represent binary data — like an image or a file — using only 64 plain
        text characters (A–Z, a–z, 0–9, <code>+</code>, and <code>/</code>). It lets you move binary
        data safely through systems that only expect text, such as JSON, URLs, or email.
      </p>

      <h2>Why does Base64 exist?</h2>
      <p>
        Many older protocols and text formats can corrupt raw binary data. Base64 sidesteps this by
        converting bytes into a safe, printable subset of characters. The trade-off is size: Base64
        output is about <strong>33% larger</strong> than the original, because it encodes 3 bytes as
        4 characters.
      </p>

      <h2>How it works (briefly)</h2>
      <p>
        Base64 takes 3 bytes (24 bits) at a time and splits them into four 6-bit groups. Each 6-bit
        group (0–63) maps to one character in the Base64 alphabet. When the input isn&apos;t a
        multiple of 3 bytes, <code>=</code> padding is added at the end.
      </p>

      <h2>Try it</h2>
      <p>
        Encode or decode text with our{" "}
        <Link href="/tools/base64">Base64 encoder / decoder</Link> — it has full Unicode (UTF-8)
        support, so emoji and non-English text convert correctly. To embed an image directly in HTML
        or CSS, use the <Link href="/tools/image-to-base64">image to Base64</Link> tool to get a
        data URI.
      </p>

      <h2>Common uses</h2>
      <ul>
        <li>Embedding small images or fonts inline as data URIs.</li>
        <li>Encoding binary attachments in email (MIME).</li>
        <li>Storing binary blobs in JSON or a database text field.</li>
        <li>The header and payload of a <Link href="/tools/jwt-decoder">JWT</Link> are Base64url-encoded.</li>
      </ul>

      <h2>Base64 is not encryption</h2>
      <p>
        This is the most important thing to understand: Base64 is <strong>encoding, not
        encryption</strong>. Anyone can decode it instantly — it provides zero security. Never use
        Base64 to &quot;hide&quot; passwords, tokens, or secrets. If you need secrecy, use real
        encryption; if you need to verify integrity, use a{" "}
        <Link href="/tools/hash-generator">hash</Link>.
      </p>

      <h2>Base64 vs. URL encoding</h2>
      <p>
        They solve different problems. Base64 makes <em>binary</em> data text-safe. URL encoding (see
        our <Link href="/tools/url-encoder">URL encoder</Link>) escapes <em>special characters</em> so
        text is safe inside a URL. There&apos;s also a &quot;Base64url&quot; variant that swaps{" "}
        <code>+</code> and <code>/</code> for URL-safe characters.
      </p>
    </>
  );
}
