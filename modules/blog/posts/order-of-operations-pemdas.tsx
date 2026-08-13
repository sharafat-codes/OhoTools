import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "order-of-operations-pemdas",
  title: "Order of Operations (PEMDAS) Explained",
  description:
    "PEMDAS / BODMAS explained with examples — the order to solve math expressions, the most common mistakes, and how a calculator handles it for you.",
  keywords: [
    "order of operations",
    "pemdas",
    "bodmas",
    "pemdas explained",
    "math order of operations",
  ],
  date: "2026-08-13",
  readingMinutes: 4,
  tags: ["Math", "Calculators"],
  related: ["scientific-calculator", "percentage-calculator", "fraction-calculator"],
};

export function Body() {
  return (
    <>
      <p>
        When an expression mixes addition, multiplication, and brackets, the answer depends on the order you
        work in. Math uses one agreed order so everyone gets the same result. In the US it&apos;s taught as{" "}
        <strong>PEMDAS</strong>; elsewhere as <strong>BODMAS</strong> — they mean the same thing.
      </p>

      <h2>The order</h2>
      <ol>
        <li><strong>P</strong>arentheses / <strong>B</strong>rackets — <code>( )</code> first.</li>
        <li><strong>E</strong>xponents / <strong>O</strong>rders — powers and roots.</li>
        <li><strong>M</strong>ultiplication and <strong>D</strong>ivision — left to right (equal priority).</li>
        <li><strong>A</strong>ddition and <strong>S</strong>ubtraction — left to right (equal priority).</li>
      </ol>

      <h2>A worked example</h2>
      <p>
        Solve <code>3 + 6 × (5 + 4) ÷ 3 − 7</code>:
      </p>
      <ol>
        <li>Parentheses: <code>5 + 4 = 9</code> → <code>3 + 6 × 9 ÷ 3 − 7</code></li>
        <li>Multiply/divide left to right: <code>6 × 9 = 54</code>, then <code>54 ÷ 3 = 18</code> → <code>3 + 18 − 7</code></li>
        <li>Add/subtract left to right: <code>3 + 18 = 21</code>, then <code>21 − 7 = 14</code></li>
      </ol>
      <p>The answer is <strong>14</strong>.</p>

      <h2>The most common mistakes</h2>
      <ul>
        <li><strong>Doing addition before multiplication</strong> — the classic <code>3 + 6 × 2</code> is 15, not 18.</li>
        <li><strong>Assuming M comes before D</strong> — multiplication and division are equal; work left to right.</li>
        <li><strong>Forgetting left-to-right</strong> — <code>8 ÷ 2 × 4</code> is 16 (not 1), because you divide first, then multiply.</li>
      </ul>

      <h2>Let a calculator handle it</h2>
      <p>
        A good calculator applies these rules automatically. Our{" "}
        <Link href="/tools/scientific-calculator">scientific calculator</Link> respects the order of operations,
        supports parentheses, exponents, and roots, and evaluates the whole expression at once — so you can type
        it as you&apos;d write it. For percentage-specific problems, try the{" "}
        <Link href="/tools/percentage-calculator">percentage calculator</Link>.
      </p>

      <h2>FAQ</h2>
      <h3>Are PEMDAS and BODMAS different?</h3>
      <p>
        No — same rules, different names. BODMAS uses &quot;Orders&quot; for exponents and &quot;Brackets&quot;
        for parentheses.
      </p>
      <h3>Do multiplication and division really have the same priority?</h3>
      <p>Yes — you work through them left to right in the order they appear. The same goes for addition and subtraction.</p>
      <h3>What about a minus sign in front of a number?</h3>
      <p>That&apos;s a negative (unary minus). A scientific calculator handles it as part of the number it&apos;s attached to.</p>
    </>
  );
}
