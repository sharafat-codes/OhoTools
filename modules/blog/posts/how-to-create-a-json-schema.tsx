import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-create-a-json-schema",
  title: "How to Create a JSON Schema (From an Example)",
  description:
    "What JSON Schema is, how to generate one from example data, what the types and 'required' fields mean, and a free generator that does it instantly.",
  keywords: [
    "how to create a json schema",
    "json schema generator",
    "json schema from json",
    "generate json schema",
    "json schema example",
    "json schema tutorial",
  ],
  date: "2026-09-10",
  readingMinutes: 4,
  tags: ["Developer"],
  related: ["json-to-schema", "json-formatter", "json-to-typescript"],
};

export function Body() {
  return (
    <>
      <p>
        A JSON Schema describes the shape of your JSON — what fields exist, their types, and which are
        required — so you can validate data automatically in an API or config. The fastest way to write one
        is to start from a real example and let a generator infer it.
      </p>

      <h2>Generate one from your data</h2>
      <p>
        Paste an example object into the <Link href="/tools/json-to-schema">JSON to JSON Schema generator</Link>{" "}
        and get a draft-07 schema with inferred types and required fields — then tweak it to taste. It runs in
        your browser, so nothing is uploaded.
      </p>

      <h2>Example</h2>
      <p>This JSON:</p>
      <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-xs"><code>{`{ "id": 1, "name": "Alex", "active": true }`}</code></pre>
      <p>produces this schema:</p>
      <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-xs"><code>{`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "active": { "type": "boolean" }
  },
  "required": ["id", "name", "active"]
}`}</code></pre>

      <h2>What the parts mean</h2>
      <ul>
        <li><strong>type</strong> — the value&apos;s type: string, integer, number, boolean, object, array, or null.</li>
        <li><strong>properties</strong> — the fields of an object and their sub-schemas.</li>
        <li><strong>required</strong> — the fields that must be present. Remove a field from this list to make it optional.</li>
        <li><strong>items</strong> — the schema each element of an array must match.</li>
      </ul>

      <h2>After generating — refine it</h2>
      <p>
        From a single example, every field is marked required. Edit the <code>required</code> array to drop
        optional fields, and add constraints like <code>minLength</code>, <code>format</code>, or{" "}
        <code>enum</code> where you need stricter validation. Validate the JSON itself first with our{" "}
        <Link href="/tools/json-formatter">JSON Formatter</Link>, and if you also need types, try{" "}
        <Link href="/tools/json-to-typescript">JSON to TypeScript</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Which draft version is generated?</h3>
      <p>Draft-07 — the most widely supported version across validation libraries like Ajv.</p>
      <h3>Are all fields required by default?</h3>
      <p>Yes, since they all appear in your example. Edit the generated <code>required</code> list to make fields optional.</p>
      <h3>Is my data uploaded?</h3>
      <p>No — the schema is generated entirely in your browser.</p>
    </>
  );
}
