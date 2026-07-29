import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "free-online-notepad",
  title: "Online Notepad: Free Notes That Autosave",
  description:
    "A free online notepad that saves as you type — no sign-up, nothing uploaded. How to jot notes in your browser, keep them across visits, and export them.",
  keywords: [
    "online notepad",
    "notepad online",
    "free online notepad",
    "notes online",
    "web notepad",
  ],
  date: "2026-07-29",
  readingMinutes: 3,
  tags: ["Productivity"],
  related: ["online-notepad", "word-counter", "text-to-pdf", "case-converter"],
};

export function Body() {
  return (
    <>
      <p>
        Sometimes you just need somewhere to type — a quick note, a draft, a snippet to hold onto for a
        minute. Opening a heavy document editor is overkill. A browser notepad is instant, distraction-free,
        and always a tab away. Here&apos;s how to use one that <strong>saves automatically</strong> and keeps
        your notes private.
      </p>

      <h2>Take notes online in seconds</h2>
      <p>
        Open the <Link href="/tools/online-notepad">Online Notepad</Link> and start typing — that&apos;s it.
        Your text saves to this browser as you go, so it&apos;s still there when you come back.
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open the <Link href="/tools/online-notepad">notepad</Link> and type.</li>
        <li>Come back any time — your notes are restored automatically.</li>
        <li>Download a <code>.txt</code> copy or copy the text whenever you need it.</li>
      </ol>

      <h2>Where are the notes stored?</h2>
      <p>
        Only in your browser, on your device (in local storage) — nothing is uploaded to a server. That means
        your notes are private, but also that clearing your browser data will remove them. For anything you
        want to keep long-term, download the <code>.txt</code> file.
      </p>

      <h2>Handy things to do next</h2>
      <ul>
        <li><strong>Check the length</strong> with the built-in word and character count — useful for posts, essays, or bios.</li>
        <li><strong>Turn notes into a PDF</strong> with <Link href="/tools/text-to-pdf">Text to PDF</Link> when you need to share or print them.</li>
        <li><strong>Fix the casing</strong> with the <Link href="/tools/case-converter">Case Converter</Link> if you pasted something in ALL CAPS.</li>
      </ul>

      <h2>FAQ</h2>
      <h3>Do my notes save automatically?</h3>
      <p>Yes — the notepad saves as you type, so you won&apos;t lose your work if you close the tab.</p>
      <h3>Is it really free and private?</h3>
      <p>Yes. There&apos;s no sign-up, and your notes never leave your browser.</p>
      <h3>Can I access my notes on another device?</h3>
      <p>Not automatically — notes are stored per-browser. Download the <code>.txt</code> file to move them elsewhere.</p>
    </>
  );
}
