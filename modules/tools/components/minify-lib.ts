// Custom, dependency-free HTML minifier. CSS/JS use dedicated libraries
// (csso / terser); HTML is safe to minify with careful string work.

// Collapse comments and whitespace in a normal HTML chunk (never called on the
// contents of <pre>/<textarea>/<script>/<style>).
function minifyChunk(s: string): string {
  return s
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, "") // drop comments, keep IE conditionals
    .replace(/>\s+</g, "><") // whitespace between tags
    .replace(/\s{2,}/g, " "); // runs of whitespace in text
}

/**
 * Minify HTML: strip comments and collapse whitespace, while preserving the
 * contents of <pre>, <textarea>, <script>, and <style> (whitespace-significant).
 * Works by splitting the document into "protected blocks" and the gaps between
 * them, and only minifying the gaps.
 */
export function minifyHtml(html: string): string {
  const re = /<(pre|textarea|script|style)[\s\S]*?<\/\1>/gi;
  let result = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    result += minifyChunk(html.slice(last, m.index));
    result += m[0]; // keep the protected block verbatim
    last = m.index + m[0].length;
  }
  result += minifyChunk(html.slice(last));
  return result.trim();
}
