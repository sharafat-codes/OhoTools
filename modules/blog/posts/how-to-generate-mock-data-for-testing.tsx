import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-generate-mock-data-for-testing",
  title: "How to Generate Mock Data for Testing (Free)",
  description:
    "Need fake data to test an app or seed a database? Learn what mock data is, when to use JSON vs CSV, which fields to include, and how to generate realistic test data for free in seconds.",
  keywords: [
    "mock data",
    "generate test data",
    "fake data for testing",
    "sample json data",
    "dummy data",
    "test data generator",
  ],
  date: "2026-08-21",
  readingMinutes: 5,
  tags: ["Developer"],
  related: ["mock-data-generator", "json-formatter", "json-to-csv"],
};

export function Body() {
  return (
    <>
      <p>
        Building or testing an app almost always means you need data before you have real users. Instead of typing
        rows by hand, you can generate <strong>mock data</strong> — realistic-looking fake records — in seconds.
        Here&apos;s what mock data is, when to use it, and how to create it for free.
      </p>

      <h2>Generate it in seconds</h2>
      <p>
        Open the <Link href="/tools/mock-data-generator">mock data generator</Link>, pick the fields you need
        (names, emails, dates, IDs, and more), choose how many rows, and export as <strong>JSON or CSV</strong>.
        Everything is generated in your browser — nothing is uploaded.
      </p>

      <h2>What is mock data (and when you need it)</h2>
      <p>Mock data — also called test data, dummy data, or sample data — is realistic fake data used in place of real records. You reach for it when you need to:</p>
      <ul>
        <li><strong>Test an API</strong> — send sample payloads without touching production data.</li>
        <li><strong>Seed a database</strong> — fill tables so a new app isn&apos;t empty.</li>
        <li><strong>Prototype a UI</strong> — see how a list, table, or card looks with real-ish content.</li>
        <li><strong>Demo a product</strong> — show a populated app to clients or stakeholders.</li>
        <li><strong>Reproduce bugs</strong> — generate edge-case values that break your code.</li>
      </ul>

      <h2>JSON or CSV — which should you use?</h2>
      <ul>
        <li>
          <strong>JSON</strong> — best for APIs, JavaScript, and most code. Import it directly, or validate and
          pretty-print it with a <Link href="/tools/json-formatter">JSON formatter</Link>.
        </li>
        <li>
          <strong>CSV</strong> — best for spreadsheets and database imports. Already have JSON? Convert it with the{" "}
          <Link href="/tools/json-to-csv">JSON to CSV tool</Link>.
        </li>
      </ul>

      <h2>Which fields should you include?</h2>
      <p>Match your fields to what you&apos;re testing. A good default set:</p>
      <ul>
        <li><strong>A unique ID</strong> (UUID) — so records are distinguishable, like a real primary key.</li>
        <li><strong>Names and emails</strong> — for user tables and profile UIs.</li>
        <li><strong>Dates</strong> — to test sorting, filtering, and date formatting.</li>
        <li><strong>Numbers and booleans</strong> — for prices, counts, and flags.</li>
        <li><strong>City / country / company</strong> — for address and organization fields.</li>
      </ul>

      <h2>Tips for genuinely useful test data</h2>
      <ul>
        <li><strong>Generate enough volume.</strong> Ten rows won&apos;t reveal pagination or performance issues — try a few hundred.</li>
        <li><strong>Include edge cases.</strong> Empty strings, very long names, and unusual characters catch bugs that clean data hides.</li>
        <li><strong>Never use real customer data.</strong> Using real personal data for testing is a privacy and legal risk — that&apos;s exactly why mock data exists.</li>
        <li><strong>Keep IDs unique.</strong> UUIDs avoid collisions when you re-run tests or merge datasets.</li>
      </ul>

      <h2>Related tools</h2>
      <p>
        After generating data, you might <Link href="/tools/json-formatter">format and validate the JSON</Link>,{" "}
        <Link href="/tools/json-to-csv">convert JSON to CSV</Link>, or grab a few{" "}
        <Link href="/tools/uuid-generator">UUIDs</Link> for keys.
      </p>

      <h2>FAQ</h2>
      <h3>Is mock data real?</h3>
      <p>No — it&apos;s randomly generated fake data for testing and prototyping. Any resemblance to real people is coincidental.</p>
      <h3>Is it safe to use for testing?</h3>
      <p>Yes — and it&apos;s the recommended approach. Using mock data avoids the privacy and legal risks of testing with real customer records.</p>
      <h3>How much test data should I generate?</h3>
      <p>Enough to exercise your feature — a few hundred rows to test lists, pagination, and sorting; more for performance testing.</p>
      <h3>Can I get the data as CSV?</h3>
      <p>Yes — the <Link href="/tools/mock-data-generator">mock data generator</Link> exports both JSON and CSV, so it works for code and spreadsheets alike.</p>
    </>
  );
}
