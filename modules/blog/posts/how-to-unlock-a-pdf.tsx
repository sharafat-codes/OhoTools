import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-unlock-a-pdf",
  title: "How to Unlock a Password-Protected PDF (Free, No Upload)",
  description:
    "Remove the password from a PDF you can open and save an unlocked copy — free, in your browser, with nothing uploaded. Works on any standard password-protected PDF.",
  keywords: [
    "how to unlock a pdf",
    "remove password from pdf",
    "unlock pdf free",
    "decrypt pdf",
    "pdf password remover",
  ],
  date: "2026-07-31",
  readingMinutes: 4,
  tags: ["PDF"],
  related: ["unlock-pdf", "protect-pdf", "merge-pdf", "compress-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Bank statements, payslips, and invoices often arrive as password-protected PDFs. Typing the password
        every single time you open the file gets old fast. If you know the password, you can remove it once
        and keep an unlocked copy. Here&apos;s how to unlock a PDF for free — entirely in your browser, with
        the file never uploaded anywhere.
      </p>

      <h2>Unlock a PDF in three steps</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open the <Link href="/tools/unlock-pdf">Unlock PDF tool</Link> and drop in your protected PDF.</li>
        <li>Enter the PDF&apos;s current password.</li>
        <li>Click <strong>Unlock PDF</strong> and download the unlocked copy.</li>
      </ol>

      <h2>Important: you need the password</h2>
      <p>
        This tool <strong>removes a password you already know</strong> — it does not and cannot crack an
        unknown one. If you can open the PDF (even if it prompts you for a password each time), you can unlock
        it here. If you don&apos;t have the password, no legitimate tool can bypass it. Only unlock documents
        you own or have permission to modify.
      </p>

      <h2>Why do it in your browser?</h2>
      <p>
        Password-protected PDFs are usually sensitive — financial statements, contracts, IDs. Uploading them
        to a random website is exactly what you don&apos;t want to do. This tool uses{" "}
        <strong>qpdf compiled to WebAssembly</strong>, which runs the decryption right on your device. Your
        file and password never leave your browser, and it handles all standard PDF encryption (RC4 and
        AES-128/256).
      </p>

      <h2>The opposite: add a password</h2>
      <p>
        Need to protect a PDF instead of unlock one? The <Link href="/tools/protect-pdf">Protect PDF tool</Link>{" "}
        adds a password and AES-256 encryption, also entirely in your browser. It&apos;s the exact reverse of
        this tool.
      </p>

      <h2>Do more with your PDF</h2>
      <p>
        Once it&apos;s unlocked you can <Link href="/tools/merge-pdf">merge it with other PDFs</Link>,{" "}
        <Link href="/tools/compress-pdf">compress it</Link>, or{" "}
        <Link href="/tools/split-pdf">split out the pages you need</Link>. See all the{" "}
        <Link href="/tools/pdf">PDF tools</Link> in one place.
      </p>

      <h2>FAQ</h2>
      <h3>Is my PDF uploaded anywhere?</h3>
      <p>No — decryption runs entirely in your browser, so your file and password never leave your device.</p>
      <h3>Do I need the password?</h3>
      <p>Yes. This removes a password you know; it can&apos;t recover or crack an unknown one.</p>
      <h3>Will it work on a bank statement?</h3>
      <p>Yes — it handles standard PDF encryption, so real-world protected PDFs (like statements) unlock fine once you enter the correct password.</p>
      <h3>Is the unlocked text still selectable?</h3>
      <p>Yes — it removes only the encryption, so the PDF&apos;s text, formatting, and pages are preserved.</p>
    </>
  );
}
