import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-json-to-xml",
  title: "How to Convert JSON to XML (and XML to JSON)",
  description:
    "Convert JSON to XML or XML to JSON in one click — free, in your browser, with attributes and nested structures preserved. Nothing uploaded.",
  keywords: [
    "json to xml",
    "xml to json",
    "convert json to xml",
    "json xml converter",
    "xml to json online",
  ],
  date: "2026-07-31",
  readingMinutes: 3,
  tags: ["Developer"],
  related: ["json-xml", "json-yaml", "json-to-csv", "json-formatter"],
};

export function Body() {
  return (
    <>
      <p>
        Plenty of APIs and legacy systems still speak XML, while most modern code works in JSON. Converting
        between the two by hand is tedious and error-prone. Here&apos;s how to convert JSON to XML — or XML to
        JSON — in one click, free and entirely in your browser.
      </p>

      <h2>Convert in three steps</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open the <Link href="/tools/json-xml">JSON to XML converter</Link>.</li>
        <li>Pick a direction — <strong>JSON → XML</strong> or <strong>XML → JSON</strong>.</li>
        <li>Paste your data; the converted output appears instantly, ready to copy.</li>
      </ol>
      <p>There&apos;s a <strong>Swap</strong> button too, so you can round-trip data and flip direction in one click.</p>

      <h2>How attributes are handled</h2>
      <p>
        XML has both elements and attributes; JSON doesn&apos;t distinguish them. To convert losslessly, XML
        attributes map to JSON keys prefixed with <code>@_</code> (and back again). So{" "}
        <code>&lt;item id=&quot;3&quot;&gt;</code> becomes <code>{`{ "item": { "@_id": 3 } }`}</code>,
        preserving the attribute when you convert either way.
      </p>

      <h2>Is my data safe?</h2>
      <p>
        Yes — the conversion runs entirely in your browser, so whatever you paste never leaves your device.
        That makes it safe for real payloads and config, not just test data.
      </p>

      <h2>Other conversions</h2>
      <p>
        Working with other formats? There&apos;s <Link href="/tools/json-yaml">JSON ↔ YAML</Link>,{" "}
        <Link href="/tools/json-to-csv">JSON to CSV</Link>, and a{" "}
        <Link href="/tools/json-formatter">JSON formatter/validator</Link> for tidying and checking JSON. See
        all the <Link href="/tools/developer">developer tools</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Is my data uploaded anywhere?</h3>
      <p>No — conversion happens locally in your browser.</p>
      <h3>Are nested structures kept?</h3>
      <p>Yes — nested objects/elements and arrays are preserved in both directions, along with attributes.</p>
      <h3>What if my input is invalid?</h3>
      <p>You&apos;ll get an error message so you can fix the JSON or XML and try again.</p>
    </>
  );
}
