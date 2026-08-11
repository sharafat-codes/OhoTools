import type { Metadata } from "next";

import { TOOL_COUNT_LABEL } from "@/modules/tools/registry";

export const metadata: Metadata = {
  title: "About",
  description: `About OhoTool — a free platform of ${TOOL_COUNT_LABEL} private, browser-based tools. Our mission, what we offer, and how to reach us.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">About OhoTool</h1>
      <p className="mt-2 text-sm text-muted-foreground">Free, private, browser-based tools.</p>

      <p className="mt-6">
        OhoTool is a free platform of {TOOL_COUNT_LABEL} online tools that run right in your browser.
        It started as a simple QR generator and grew into an all-in-one toolkit — because too many
        &quot;free&quot; tool sites bury you in ads and quietly upload your files to a server just to
        convert them. We wanted the opposite: fast, genuinely useful tools that respect your privacy.
      </p>

      <h2>Our mission</h2>
      <p>
        Make everyday digital tasks effortless and private. Wherever it&apos;s technically possible, our
        tools do their work <strong>on your device, in your browser</strong> — so your files, text, and
        data are never uploaded to us. No sign-up is required to use them, and there&apos;s nothing to
        install.
      </p>

      <h2>What we offer</h2>
      <ul>
        <li><strong>Document &amp; file tools</strong> — convert and compress PDFs, images, audio, and video; merge, split, and edit PDFs.</li>
        <li><strong>Image tools</strong> — convert formats, resize, compress, crop, remove backgrounds, and extract text with OCR.</li>
        <li><strong>Developer utilities</strong> — JSON, JWT, hashing, regex, and dozens more.</li>
        <li><strong>AI tools &amp; agents</strong> — Chat with PDF, writing assistants, and an AI Mock Interview and Resume Reviewer.</li>
        <li><strong>Everyday tools</strong> — QR codes, calculators, unit converters, and text utilities.</li>
      </ul>

      <h2>Free &amp; Pro</h2>
      <p>
        The vast majority of tools are free to use. The free tier is supported by ads; an optional{" "}
        <a href="/pricing">Pro plan</a> removes ads and unlocks unlimited AI, advanced document
        conversions, dynamic QR analytics, bulk processing, and a developer API. There are no ads on
        Pro, and you can cancel anytime.
      </p>

      <h2>Who&apos;s behind OhoTool</h2>
      <p>
        OhoTool is an independent project, built and maintained by a small, self-funded team of
        developers. We ship improvements continuously and take feature requests directly from users —
        if there&apos;s a tool you wish existed, <a href="/request-tool">tell us</a> and we&apos;ll
        consider building it.
      </p>

      <h2>Contact</h2>
      <p>
        We&apos;d love to hear your feedback, questions, or ideas. Reach us at{" "}
        <a href="mailto:sharafat.codes@gmail.com">sharafat.codes@gmail.com</a> or through our{" "}
        <a href="/contact">contact page</a>.
      </p>
    </article>
  );
}
