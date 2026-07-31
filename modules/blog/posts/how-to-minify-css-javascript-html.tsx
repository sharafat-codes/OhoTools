import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-minify-css-javascript-html",
  title: "How to Minify CSS, JavaScript, and HTML (Free)",
  description:
    "Shrink your CSS, JS, and HTML to load faster — free, in your browser, with industry-standard engines (csso and Terser). See exactly how many bytes you save.",
  keywords: [
    "minify css",
    "minify javascript",
    "minify html",
    "css minifier",
    "js minifier online",
  ],
  date: "2026-07-31",
  readingMinutes: 4,
  tags: ["Developer"],
  related: ["css-minifier", "js-minifier", "html-minifier", "svg-optimizer"],
};

export function Body() {
  return (
    <>
      <p>
        Minifying means stripping everything a browser doesn&apos;t need — comments, whitespace, line breaks,
        and (for JavaScript) long variable names — so files download and parse faster. Smaller assets mean
        quicker page loads and better Core Web Vitals. Here&apos;s how to minify CSS, JavaScript, and HTML for
        free, right in your browser.
      </p>

      <h2>Minify each type</h2>
      <ul className="[&_a]:text-primary [&_a]:underline">
        <li>
          <strong><Link href="/tools/css-minifier">CSS Minifier</Link></strong> — powered by{" "}
          <code>csso</code>, which also compacts and merges rules for extra savings.
        </li>
        <li>
          <strong><Link href="/tools/js-minifier">JavaScript Minifier</Link></strong> — powered by{" "}
          <code>Terser</code>, the industry-standard JS minifier; it even shortens names where it&apos;s safe.
        </li>
        <li>
          <strong><Link href="/tools/html-minifier">HTML Minifier</Link></strong> — removes comments and
          collapses whitespace while keeping <code>&lt;pre&gt;</code>, <code>&lt;script&gt;</code>, and{" "}
          <code>&lt;style&gt;</code> contents intact.
        </li>
      </ul>
      <p>Each one is the same flow: paste your code, and the minified output plus the size saved appears instantly. Copy it or download the file.</p>

      <h2>How much smaller?</h2>
      <p>
        It depends on how much whitespace and how many comments your source has, but 30–70% reductions are
        typical for hand-written CSS and JS. Each tool shows the before/after byte size and the percentage
        saved so you can see the win.
      </p>

      <h2>Minify vs. beautify</h2>
      <p>
        Minifying is the opposite of formatting. When you need to <em>read</em> or debug messy code, use the{" "}
        <Link href="/tools/code-beautifier">Code Beautifier</Link> to expand and indent it. Minify for
        production; beautify for development.
      </p>

      <h2>Is it safe to paste my code?</h2>
      <p>
        Yes — every minifier runs entirely in your browser. Your code is never uploaded to a server, so
        it&apos;s safe to paste proprietary CSS or JavaScript.
      </p>

      <h2>Don&apos;t forget your SVGs</h2>
      <p>
        SVG files exported from design tools are often full of editor metadata and can be shrunk a lot too.
        The <Link href="/tools/svg-optimizer">SVG Optimizer</Link> cleans them up without changing how they
        look.
      </p>

      <h2>FAQ</h2>
      <h3>Is my code uploaded anywhere?</h3>
      <p>No — minification runs entirely in your browser; your code never leaves your device.</p>
      <h3>Will minified JavaScript still work?</h3>
      <p>Yes — Terser preserves behavior while removing whitespace and shortening names safely. If there&apos;s a syntax error, it&apos;s reported so you can fix it.</p>
      <h3>Can I reverse minification?</h3>
      <p>You can re-format (beautify) it for readability, but original comments and variable names can&apos;t be recovered. Keep your source files.</p>
    </>
  );
}
