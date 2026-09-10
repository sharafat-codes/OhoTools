import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-curl-to-fetch",
  title: "How to Convert a cURL Command to fetch (or Python)",
  description:
    "Turn any cURL command into JavaScript fetch or Python requests — how the flags map, a worked example, and a free converter that does it instantly.",
  keywords: [
    "curl to fetch",
    "curl to code",
    "curl to javascript",
    "curl to python",
    "convert curl command",
    "curl to requests",
  ],
  date: "2026-09-10",
  readingMinutes: 4,
  tags: ["Developer"],
  related: ["curl-to-code", "json-formatter", "jwt-decoder"],
};

export function Body() {
  return (
    <>
      <p>
        You copied a cURL command from an API doc or your browser&apos;s network tab, and now you need it as
        real code. The mapping is straightforward once you know which flag becomes what — or you can paste it
        into a converter and skip the busywork.
      </p>

      <h2>Convert it instantly</h2>
      <p>
        Paste your command into the <Link href="/tools/curl-to-code">cURL to Code converter</Link> and get
        JavaScript (fetch) or Python (requests) output you can copy straight into your app. It runs in your
        browser, so your URLs and tokens never leave your device.
      </p>

      <h2>How the flags map</h2>
      <ul>
        <li><strong>URL</strong> (the bare argument) → the first argument to <code>fetch()</code> / the <code>url</code>.</li>
        <li><strong>-X / --request</strong> → the HTTP <code>method</code> (defaults to GET, or POST if there&apos;s a body).</li>
        <li><strong>-H / --header</strong> → an entry in the <code>headers</code> object.</li>
        <li><strong>-d / --data</strong> → the request <code>body</code> (and implies POST).</li>
      </ul>

      <h2>A worked example</h2>
      <p>This cURL command:</p>
      <p><code>{`curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"Alex"}'`}</code></p>
      <p>becomes, in JavaScript:</p>
      <pre className="overflow-x-auto rounded-lg bg-muted/40 p-3 text-xs"><code>{`fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: '{"name":"Alex"}',
})
  .then((res) => res.json())
  .then(console.log);`}</code></pre>

      <h2>Tips</h2>
      <ul>
        <li>If the body is JSON, remember to <code>JSON.stringify()</code> an object, or send the raw string as shown.</li>
        <li>Copy commands from Chrome DevTools → Network → right-click a request → <strong>Copy as cURL</strong>.</li>
        <li>Format the response body with our <Link href="/tools/json-formatter">JSON Formatter</Link>, and decode any bearer token with the <Link href="/tools/jwt-decoder">JWT Decoder</Link>.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Does the converter support Python?</h3>
      <p>Yes — switch to the Python tab for a <code>requests</code> version of the same call.</p>
      <h3>Is my command sent to a server?</h3>
      <p>No — it&apos;s parsed entirely in your browser, so your API URLs and tokens stay private.</p>
    </>
  );
}
