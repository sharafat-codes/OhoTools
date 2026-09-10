import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "what-is-toml",
  title: "What Is TOML? (And How It Compares to JSON & YAML)",
  description:
    "TOML explained — what it is, where it's used (Cargo, pyproject.toml), how it compares to JSON and YAML, and a free converter between them.",
  keywords: [
    "what is toml",
    "toml file",
    "toml vs yaml",
    "toml vs json",
    "json to toml",
    "toml config",
  ],
  date: "2026-09-10",
  readingMinutes: 4,
  tags: ["Developer"],
  related: ["json-toml", "json-yaml", "json-formatter"],
};

export function Body() {
  return (
    <>
      <p>
        TOML (Tom&apos;s Obvious, Minimal Language) is a configuration file format designed to be easy for
        humans to read and unambiguous for machines to parse. If you&apos;ve seen a <code>Cargo.toml</code> or{" "}
        <code>pyproject.toml</code>, you&apos;ve used TOML.
      </p>

      <h2>Convert between TOML and JSON</h2>
      <p>
        Need to move config between formats? The <Link href="/tools/json-toml">JSON ↔ TOML converter</Link>{" "}
        turns JSON into TOML and back, right in your browser.
      </p>

      <h2>What TOML looks like</h2>
      <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-xs"><code>{`title = "OhoTool"

[owner]
name = "Alex"
active = true

[database]
server = "192.168.1.1"
ports = [8000, 8001]`}</code></pre>
      <p>
        Values are <code>key = value</code> pairs; <code>[section]</code> headers create nested tables. It
        reads almost like an old-school INI file, but with real types (strings, numbers, booleans, dates,
        arrays).
      </p>

      <h2>Where it&apos;s used</h2>
      <ul>
        <li><strong>Rust</strong> — <code>Cargo.toml</code> for package config.</li>
        <li><strong>Python</strong> — <code>pyproject.toml</code>, the modern standard for project metadata.</li>
        <li>Many CLI tools and static-site generators use it for settings.</li>
      </ul>

      <h2>TOML vs. JSON vs. YAML</h2>
      <ul>
        <li><strong>JSON</strong> — great for data and APIs, but noisy for humans (quotes, braces, no comments).</li>
        <li><strong>YAML</strong> — very readable, but whitespace-sensitive and easy to get subtly wrong.</li>
        <li><strong>TOML</strong> — readable like YAML, but explicit and unambiguous like JSON, with comments and clear typing. Ideal for <em>config</em>, less suited to deeply nested data.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Is TOML better than YAML?</h3>
      <p>For flat-to-moderately-nested configuration, many find TOML clearer and less error-prone (no significant whitespace). YAML can be nicer for deeply nested structures.</p>
      <h3>Can I convert TOML to JSON?</h3>
      <p>Yes — paste it into the <Link href="/tools/json-toml">converter</Link> and switch to the TOML → JSON tab.</p>
      <h3>Does TOML support comments?</h3>
      <p>Yes — anything after a <code>#</code> on a line is a comment, which JSON doesn&apos;t allow.</p>
    </>
  );
}
