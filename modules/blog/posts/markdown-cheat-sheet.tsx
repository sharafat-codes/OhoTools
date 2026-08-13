import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "markdown-cheat-sheet",
  title: "Markdown Cheat Sheet: Syntax with Examples",
  description:
    "A quick Markdown cheat sheet — headings, bold, italic, lists, links, images, code blocks, blockquotes, and tables, each with a copy-ready example.",
  keywords: [
    "markdown cheat sheet",
    "markdown syntax",
    "how to write markdown",
    "markdown guide",
    "markdown examples",
  ],
  date: "2026-08-13",
  readingMinutes: 5,
  tags: ["Developer", "Writing"],
  related: ["markdown-editor", "markdown-to-html", "markdown-to-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Markdown is a lightweight way to format text with plain characters — it powers README files, GitHub,
        Reddit, chat apps, and countless note tools. Here&apos;s the syntax you&apos;ll actually use, with an
        example for each.
      </p>
      <p>
        Want to try any of these live? Paste them into our{" "}
        <Link href="/tools/markdown-editor">Markdown editor</Link> and watch them render as you type.
      </p>

      <h2>Headings</h2>
      <p>
        Use <code>#</code> for each level: <code># H1</code>, <code>## H2</code>, <code>### H3</code> (up to six).
      </p>

      <h2>Bold, italic, and strikethrough</h2>
      <ul>
        <li><code>**bold**</code> → <strong>bold</strong></li>
        <li><code>*italic*</code> → <em>italic</em></li>
        <li><code>~~strikethrough~~</code> → <s>strikethrough</s></li>
      </ul>

      <h2>Lists</h2>
      <p>
        Bullets: start lines with <code>-</code> or <code>*</code>. Numbered: start with <code>1.</code>,
        <code>2.</code>, and so on. Indent two spaces to nest a sub-item.
      </p>

      <h2>Links and images</h2>
      <ul>
        <li>Link: <code>[OhoTool](https://ohotool.com)</code></li>
        <li>Image: <code>![alt text](image.png)</code> — same as a link, with a leading <code>!</code></li>
      </ul>

      <h2>Code</h2>
      <p>
        Inline code uses backticks: <code>`code`</code>. For a block, wrap it in triple backticks and optionally
        name the language for highlighting (for example, <code>```js</code> … <code>```</code>).
      </p>

      <h2>Blockquotes and rules</h2>
      <p>
        Start a line with <code>&gt;</code> for a blockquote. Use three or more dashes (<code>---</code>) on their
        own line for a horizontal rule.
      </p>

      <h2>Tables</h2>
      <p>Separate columns with pipes and add a divider row of dashes:</p>
      <pre>{`| Tool | Free |
| ---- | ---- |
| OhoTool | Yes |`}</pre>

      <h2>FAQ</h2>
      <h3>What&apos;s the difference between Markdown and HTML?</h3>
      <p>
        Markdown is a simple shorthand that converts to HTML. You write less, and it stays readable as plain
        text. You can even mix in raw HTML when you need something Markdown doesn&apos;t cover.
      </p>
      <h3>What is GitHub-flavored Markdown?</h3>
      <p>
        A popular Markdown extension that adds tables, task lists, strikethrough, and automatic links — supported
        by our <Link href="/tools/markdown-editor">editor</Link>.
      </p>
      <h3>How do I turn Markdown into a file?</h3>
      <p>
        Use the editor&apos;s copy/download buttons, or convert to other formats with{" "}
        <Link href="/tools/markdown-to-html">Markdown to HTML</Link> and{" "}
        <Link href="/tools/markdown-to-pdf">Markdown to PDF</Link>.
      </p>
    </>
  );
}
