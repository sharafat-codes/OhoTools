import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-write-excel-formulas",
  title: "How to Write Excel Formulas (Common Examples)",
  description:
    "How Excel formulas work, the essential functions to know (SUM, IF, VLOOKUP, XLOOKUP, SUMIF), worked examples, and a free AI tool that writes any formula from a description.",
  keywords: [
    "how to write excel formulas",
    "excel formulas",
    "common excel formulas",
    "excel formula examples",
    "excel formula generator",
    "vlookup",
  ],
  date: "2026-09-04",
  readingMinutes: 5,
  tags: ["Productivity"],
  related: ["excel-formula-generator", "sql-generator", "csv-to-xlsx", "xlsx-to-csv"],
};

export function Body() {
  return (
    <>
      <p>
        Every Excel formula starts with <code>=</code>, then a function and its arguments in brackets.
        Master a handful of functions and you can handle most spreadsheet tasks. Here are the essentials with
        examples — and a tool that writes any formula for you from plain English.
      </p>

      <h2>Skip the syntax — describe it instead</h2>
      <p>
        Not sure which function to use? Describe what you want in the{" "}
        <Link href="/tools/excel-formula-generator">AI Excel Formula Generator</Link> — e.g. &ldquo;sum column
        B where column A is &lsquo;Paid&rsquo;&rdquo; — and get the correct Excel or Google Sheets formula
        with a short explanation.
      </p>

      <h2>The essential functions</h2>
      <ul>
        <li><strong>SUM</strong> — add a range: <code>=SUM(B2:B10)</code></li>
        <li><strong>AVERAGE</strong> — the mean of a range: <code>=AVERAGE(B2:B10)</code></li>
        <li><strong>IF</strong> — a condition: <code>=IF(B2&gt;100,&quot;High&quot;,&quot;Low&quot;)</code></li>
        <li><strong>SUMIF / COUNTIF</strong> — conditional totals: <code>=SUMIF(A2:A10,&quot;Paid&quot;,B2:B10)</code></li>
        <li><strong>VLOOKUP / XLOOKUP</strong> — find a value in a table: <code>=XLOOKUP(&quot;Alex&quot;,A2:A10,B2:B10)</code></li>
        <li><strong>CONCAT / TEXTJOIN</strong> — combine text: <code>=TEXTJOIN(&quot; &quot;,TRUE,A2,B2)</code></li>
      </ul>

      <h2>A worked example</h2>
      <p>
        Say column A is a status and column B is an amount. To total only the &ldquo;Paid&rdquo; rows:
      </p>
      <p><code>=SUMIF(A2:A100,&quot;Paid&quot;,B2:B100)</code></p>
      <p>
        SUMIF checks each cell in A2:A100; wherever it equals &ldquo;Paid&rdquo;, it adds the matching cell
        from B2:B100.
      </p>

      <h2>Tips for fewer errors</h2>
      <ul>
        <li><strong>Lock references</strong> with <code>$</code> (e.g. <code>$B$2</code>) so they don&apos;t shift when you copy the formula.</li>
        <li><strong>Wrap in IFERROR</strong> to hide errors: <code>=IFERROR(formula,&quot;&quot;)</code>.</li>
        <li><strong>Prefer XLOOKUP over VLOOKUP</strong> where available — it&apos;s simpler and safer.</li>
        <li><strong>Check your ranges</strong> — mismatched range sizes are the most common cause of wrong results.</li>
      </ul>

      <h2>Related tools</h2>
      <p>
        Working with data files too? Convert{" "}
        <Link href="/tools/csv-to-xlsx">CSV to Excel</Link> or{" "}
        <Link href="/tools/xlsx-to-csv">Excel to CSV</Link>, and for databases try the{" "}
        <Link href="/tools/sql-generator">AI SQL Generator</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Do these formulas work in Google Sheets?</h3>
      <p>Most do — the core functions are shared. In the generator, choose Google Sheets to get Sheets-specific syntax.</p>
      <h3>How do I write a formula if I don&apos;t know the function?</h3>
      <p>Describe the result you want in the AI Excel Formula Generator and it picks the right function for you.</p>
      <h3>Is the tool free?</h3>
      <p>You get a set number of free AI runs each day; go Pro for unlimited use.</p>
    </>
  );
}
