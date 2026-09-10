import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-numbers-in-words",
  title: "How to Write Numbers and Amounts in Words",
  description:
    "The rules for writing numbers in words — including cheque/currency amounts — with examples, plus a free converter that spells any number for you.",
  keywords: [
    "how to write numbers in words",
    "amount in words",
    "number to words",
    "spell numbers",
    "write a check amount in words",
    "figures to words",
  ],
  date: "2026-09-10",
  readingMinutes: 3,
  tags: ["Writing"],
  related: ["number-to-words", "percentage-calculator", "roman-numeral"],
};

export function Body() {
  return (
    <>
      <p>
        Writing numbers in words comes up on cheques, invoices, and legal documents. The rules are simple once
        you know how the groups and hyphens work — or you can spell any number instantly with a converter.
      </p>

      <h2>Spell any number instantly</h2>
      <p>
        Type a number into the <Link href="/tools/number-to-words">Number to Words converter</Link> to get it
        in words, plus a dollars-and-cents version for cheques. It runs in your browser.
      </p>

      <h2>The basic rules</h2>
      <ul>
        <li><strong>Group in threes</strong> from the right: hundreds, then thousand, million, billion.</li>
        <li><strong>Hyphenate</strong> compound numbers from twenty-one to ninety-nine (e.g. <em>forty-two</em>).</li>
        <li><strong>&ldquo;and&rdquo;</strong> is used before the tens/units in British style (<em>one hundred and five</em>); American style often drops it.</li>
      </ul>
      <p>Examples:</p>
      <ul>
        <li>42 → <strong>forty-two</strong></li>
        <li>1,234 → <strong>one thousand two hundred thirty-four</strong></li>
        <li>1,000,000 → <strong>one million</strong></li>
      </ul>

      <h2>Writing amounts on a cheque</h2>
      <p>
        Write the whole-dollar amount in words, then the cents — commonly as a fraction or the word
        &ldquo;cents.&rdquo; For example, <strong>$1,234.56</strong> becomes:
      </p>
      <p><em>One thousand two hundred thirty-four dollars and fifty-six cents.</em></p>
      <p>The converter&apos;s <strong>Currency</strong> tab formats this for you automatically.</p>

      <h2>FAQ</h2>
      <h3>When should I write numbers as words vs. figures?</h3>
      <p>In prose, small numbers (often under 10 or under 100) are usually spelled out; larger numbers use figures. On cheques and contracts, the words version is written alongside the figures to prevent tampering.</p>
      <h3>How do I write the cents?</h3>
      <p>Either as &ldquo;and fifty-six cents&rdquo; or as a fraction like 56/100. Both are accepted on cheques.</p>
    </>
  );
}
