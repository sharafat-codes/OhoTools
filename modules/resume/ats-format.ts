// Deterministic, client-side ATS (Applicant Tracking System) format checker.
// It inspects the actual file — not an AI opinion — for the parsing problems
// that make real ATS software mangle or drop a resume: non-selectable text
// (scanned/exported as an image), multi-column layouts, images/graphics,
// tables, missing contact details, and missing standard section headings.
// Everything runs in the browser; the file is never uploaded.

export type CheckStatus = "pass" | "warn" | "fail";

export type AtsCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  fix?: string;
};

export type AtsReport = {
  score: number; // 0–100
  verdict: string;
  fileType: string; // PDF | Word (DOCX) | Image | Text | Unknown
  pages: number; // 0 when N/A
  words: number;
  checks: AtsCheck[];
};

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;

// PDF text extraction frequently injects spaces inside an email address
// (e.g. "name . dev @ gmail . com"), so a naive regex misses a real email.
// Test the raw text first, then re-test a whitespace-stripped window around
// each '@' (localized, to avoid stitching unrelated tokens into a false match).
function hasEmail(text: string): boolean {
  if (EMAIL_RE.test(text)) return true;
  for (let i = text.indexOf("@"); i !== -1; i = text.indexOf("@", i + 1)) {
    const win = text.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, "");
    if (EMAIL_RE.test(win)) return true;
  }
  return false;
}

function hasPhone(text: string): boolean {
  const candidates = text.match(/\+?\d[\d\s().-]{7,}\d/g) || [];
  return candidates.some((c) => {
    const d = c.replace(/\D/g, "").length;
    return d >= 10 && d <= 15;
  });
}

function sectionChecks(text: string): AtsCheck[] {
  const t = text.toLowerCase();
  const sections: { id: string; label: string; re: RegExp }[] = [
    { id: "sec-exp", label: "Work experience section", re: /\b(experience|work history|employment|professional background)\b/ },
    { id: "sec-edu", label: "Education section", re: /\beducation\b/ },
    { id: "sec-skills", label: "Skills section", re: /\b(skills|technical skills|core competencies)\b/ },
  ];
  return sections.map((s) => ({
    id: s.id,
    label: s.label,
    status: (s.re.test(t) ? "pass" : "warn") as CheckStatus,
    detail: s.re.test(t)
      ? "Found — ATS can categorize this section."
      : "Not found. ATS software sorts your resume into sections by their headings.",
    fix: s.re.test(t) ? undefined : `Add a clear "${s.label.replace(/ section$/, "")}" heading.`,
  }));
}

function commonChecks(text: string): AtsCheck[] {
  const words = text.split(/\s+/).filter(Boolean).length;
  const checks: AtsCheck[] = [];

  const emailOk = hasEmail(text);
  checks.push({
    id: "email",
    label: "Email address",
    status: emailOk ? "pass" : "fail",
    detail: emailOk
      ? "An email address was detected."
      : "No email address found. ATS may not be able to contact you.",
    fix: emailOk ? undefined : "Add your email as plain text near the top (not inside an image or header).",
  });

  checks.push({
    id: "phone",
    label: "Phone number",
    status: hasPhone(text) ? "pass" : "warn",
    detail: hasPhone(text) ? "A phone number was detected." : "No phone number found.",
    fix: hasPhone(text) ? undefined : "Add your phone number as plain text.",
  });

  checks.push(...sectionChecks(text));

  if (words < 200) {
    checks.push({
      id: "length-short",
      label: "Content length",
      status: "warn",
      detail: `Only ~${words} words. This may be too thin for ATS keyword matching.`,
      fix: "Expand your experience with concrete, keyword-rich bullet points.",
    });
  } else if (words > 1200) {
    checks.push({
      id: "length-long",
      label: "Content length",
      status: "warn",
      detail: `~${words} words — quite long. Most roles expect a 1–2 page resume.`,
      fix: "Trim to the most relevant experience.",
    });
  } else {
    checks.push({
      id: "length-ok",
      label: "Content length",
      status: "pass",
      detail: `~${words} words — a healthy length.`,
    });
  }

  if (text.includes("�")) {
    checks.push({
      id: "encoding",
      label: "Character encoding",
      status: "warn",
      detail: "Some characters didn't decode cleanly — a fancy font or symbol may not be ATS-readable.",
      fix: "Use standard fonts (Arial, Calibri, Times) and avoid decorative symbols.",
    });
  }

  return checks;
}

function score(checks: AtsCheck[]): number {
  const WEIGHT: Record<string, number> = {
    text: 30,
    email: 14,
    "sec-exp": 6,
    "sec-edu": 5,
    "sec-skills": 5,
    columns: 12,
    images: 8,
    tables: 8,
    "header-footer": 6,
    pages: 6,
    phone: 4,
    fonts: 3,
    "length-short": 4,
    "length-long": 4,
    "length-ok": 4,
    encoding: 3,
  };
  let earned = 0;
  let total = 0;
  for (const c of checks) {
    const w = WEIGHT[c.id] ?? 3;
    total += w;
    earned += w * (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0);
  }
  return total ? Math.round((earned / total) * 100) : 0;
}

function verdictFor(s: number): string {
  if (s >= 85) return "ATS-ready — no major parsing problems.";
  if (s >= 70) return "Mostly ATS-friendly — a few fixes recommended.";
  if (s >= 50) return "Needs work — several issues could confuse ATS.";
  return "Likely to fail ATS parsing — fix the flagged issues.";
}

// ── PDF ──────────────────────────────────────────────────────────────────────
async function analyzePdf(file: File): Promise<AtsReport> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;

  let text = "";
  const fonts = new Set<string>();
  let imageOps = 0;
  let twoColumnPage = false;

  // Reference image ops by string key (names vary across pdfjs versions), so a
  // renamed/removed op can't break the type-check or the detection.
  const OPS = pdfjs.OPS as unknown as Record<string, number>;
  const IMG_OPS = new Set(
    ["paintImageXObject", "paintInlineImageXObject", "paintImageMaskXObject", "paintJpegXObject", "paintImageXObjectRepeat"]
      .map((k) => OPS[k])
      .filter((v): v is number => typeof v === "number"),
  );

  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();

    let leftChars = 0;
    let rightChars = 0;
    for (const it of content.items) {
      if (!("str" in it)) continue;
      const s = it.str;
      text += s + " ";
      if (it.fontName) fonts.add(it.fontName);
      const x = Array.isArray(it.transform) ? Number(it.transform[4]) : 0;
      const frac = viewport.width ? x / viewport.width : 0;
      const len = s.trim().length;
      if (len) {
        if (frac < 0.48) leftChars += len;
        else if (frac > 0.52) rightChars += len;
      }
    }
    text += "\n";

    // Two-column heuristic: in single-column text, runs almost all START near
    // the left margin. A large share of text STARTING in the right half is a
    // strong sign of a second column (or a sidebar).
    const totalChars = leftChars + rightChars;
    if (totalChars > 200 && rightChars / totalChars > 0.3 && leftChars / totalChars > 0.3) {
      twoColumnPage = true;
    }

    try {
      const ops = await page.getOperatorList();
      for (const fn of ops.fnArray) if (IMG_OPS.has(fn)) imageOps++;
    } catch {
      /* operator list unavailable — skip image detection for this page */
    }
  }

  text = text.replace(/[ \t]+/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const checks: AtsCheck[] = [];

  // The single most important check: is the text actually selectable?
  const textReadable = words >= 40;
  checks.push({
    id: "text",
    label: "Selectable (machine-readable) text",
    status: textReadable ? "pass" : "fail",
    detail: textReadable
      ? "Your resume text is selectable, so ATS can read it."
      : "Almost no readable text was found — this PDF is likely a scan or an exported image. ATS cannot read it at all.",
    fix: textReadable ? undefined : "Export a real (text) PDF from Word/Google Docs — not a scan, screenshot, or image export.",
  });

  checks.push({
    id: "columns",
    label: "Single-column layout",
    status: twoColumnPage ? "warn" : "pass",
    detail: twoColumnPage
      ? "Looks like a multi-column layout or sidebar. Many ATS read straight across the page and scramble the columns together."
      : "Reads as a single column — the safest layout for ATS.",
    fix: twoColumnPage ? "Switch to a single-column layout." : undefined,
  });

  checks.push({
    id: "images",
    label: "No images or graphics",
    status: imageOps > 0 ? "warn" : "pass",
    detail:
      imageOps > 0
        ? `Contains ${imageOps} image/graphic${imageOps > 1 ? "s" : ""} (photo, logo, or icons). ATS can't read text inside images, and photos can break parsing.`
        : "No images detected — good, ATS reads plain text best.",
    fix: imageOps > 0 ? "Remove profile photos, icons, and logos; write everything as text." : undefined,
  });

  checks.push({
    id: "pages",
    label: "Page count",
    status: doc.numPages <= 2 ? "pass" : "warn",
    detail: doc.numPages <= 2 ? `${doc.numPages} page${doc.numPages > 1 ? "s" : ""}.` : `${doc.numPages} pages — most roles expect 1–2.`,
    fix: doc.numPages <= 2 ? undefined : "Trim to 1–2 pages.",
  });

  if (fonts.size > 6) {
    checks.push({
      id: "fonts",
      label: "Font count",
      status: "warn",
      detail: `${fonts.size} different fonts detected — too many can look inconsistent and hint at decorative formatting.`,
      fix: "Stick to 1–2 standard fonts.",
    });
  }

  checks.push(...commonChecks(text));

  const s = score(checks);
  return { score: s, verdict: verdictFor(s), fileType: "PDF", pages: doc.numPages, words, checks };
}

// ── DOCX ─────────────────────────────────────────────────────────────────────
async function analyzeDocx(file: File): Promise<AtsReport> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const docXml = (await zip.file("word/document.xml")?.async("string")) ?? "";

  const text = docXml
    .replace(/<w:tab\b[^>]*\/?>/g, " ")
    .replace(/<w:br\b[^>]*\/?>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .trim();

  const words = text.split(/\s+/).filter(Boolean).length;
  const checks: AtsCheck[] = [];

  checks.push({
    id: "text",
    label: "Selectable (machine-readable) text",
    status: words >= 40 ? "pass" : "fail",
    detail: words >= 40 ? "Word documents keep text selectable — good for ATS." : "Very little text found in this document.",
    fix: words >= 40 ? undefined : "Make sure your content is typed text, not an inserted image.",
  });

  const hasTable = /<w:tbl\b/.test(docXml);
  checks.push({
    id: "tables",
    label: "No tables",
    status: hasTable ? "warn" : "pass",
    detail: hasTable
      ? "Uses tables. ATS often can't read content inside tables in the right order."
      : "No tables detected.",
    fix: hasTable ? "Replace tables with simple text and bullet points." : undefined,
  });

  const multiCol = /<w:cols\b[^>]*w:num="(?:[2-9]|\d\d+)"/.test(docXml);
  checks.push({
    id: "columns",
    label: "Single-column layout",
    status: multiCol ? "warn" : "pass",
    detail: multiCol ? "Multiple text columns detected — ATS may scramble the reading order." : "Single-column layout.",
    fix: multiCol ? "Use a single-column layout." : undefined,
  });

  const hasImages = zip.file(/^word\/media\//).length > 0 || /<w:drawing\b|<a:blip\b|<w:pict\b/.test(docXml);
  checks.push({
    id: "images",
    label: "No images or graphics",
    status: hasImages ? "warn" : "pass",
    detail: hasImages
      ? "Contains images/graphics (photo, logo, or icons). ATS can't read text inside images."
      : "No images detected.",
    fix: hasImages ? "Remove photos, icons, and logos; write everything as text." : undefined,
  });

  const headerFiles = zip.file(/^word\/(header|footer)\d*\.xml$/);
  let contactInHeader = false;
  for (const h of headerFiles) {
    const hx = await h.async("string");
    if (hasEmail(hx) || hasPhone(hx)) contactInHeader = true;
  }
  if (contactInHeader) {
    checks.push({
      id: "header-footer",
      label: "Contact details in the body",
      status: "warn",
      detail: "Your contact info appears in a header/footer. Many ATS ignore headers and footers entirely.",
      fix: "Move your name, email, and phone into the main body of the document.",
    });
  }

  checks.push(...commonChecks(text));

  const s = score(checks);
  return { score: s, verdict: verdictFor(s), fileType: "Word (DOCX)", pages: 0, words, checks };
}

// ── Entry point ──────────────────────────────────────────────────────────────
export async function analyzeResumeFormat(file: File): Promise<AtsReport> {
  const name = file.name.toLowerCase();
  const isImage = /\.(png|jpe?g|webp|gif|bmp|heic|tiff?)$/.test(name) || file.type.startsWith("image/");

  if (isImage) {
    return {
      score: 5,
      verdict: "Likely to fail ATS parsing — fix the flagged issues.",
      fileType: "Image",
      pages: 0,
      words: 0,
      checks: [
        {
          id: "text",
          label: "Selectable (machine-readable) text",
          status: "fail",
          detail: "This is an image file. ATS software cannot read any text from an image — your resume would come through blank.",
          fix: "Export your resume as a PDF or Word (.docx) file with real, selectable text.",
        },
      ],
    };
  }

  if (name.endsWith(".pdf") || file.type === "application/pdf") return analyzePdf(file);
  if (name.endsWith(".docx")) return analyzeDocx(file);

  // Plain text / markdown — parseable, but usually not what you submit.
  const text = (await file.text()).trim();
  const checks: AtsCheck[] = [
    {
      id: "text",
      label: "Selectable (machine-readable) text",
      status: "pass",
      detail: "Plain text is fully readable by ATS (though you'll usually submit a PDF or Word file).",
    },
    ...commonChecks(text),
  ];
  const s = score(checks);
  return { score: s, verdict: verdictFor(s), fileType: "Text", pages: 0, words: text.split(/\s+/).filter(Boolean).length, checks };
}
