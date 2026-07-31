import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-password-protect-a-pdf",
  title: "How to Password-Protect a PDF (Free, AES-256)",
  description:
    "Add a password and AES-256 encryption to a PDF so only people with the password can open it — free, in your browser, with nothing uploaded.",
  keywords: [
    "how to password protect a pdf",
    "encrypt pdf",
    "add password to pdf",
    "lock pdf",
    "protect pdf free",
  ],
  date: "2026-07-31",
  readingMinutes: 4,
  tags: ["PDF"],
  related: ["protect-pdf", "unlock-pdf", "merge-pdf", "compress-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        If you&apos;re emailing a contract, an invoice, or anything with personal details, a password on the
        PDF is a simple, effective safeguard: only someone with the password can open it. Here&apos;s how to
        password-protect a PDF for free — with strong AES-256 encryption, applied entirely in your browser so
        the file is never uploaded.
      </p>

      <h2>Protect a PDF in three steps</h2>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open the <Link href="/tools/protect-pdf">Protect PDF tool</Link> and drop in your PDF.</li>
        <li>Choose a password (share it with the recipient separately — not in the same email).</li>
        <li>Click <strong>Protect PDF</strong> and download the encrypted copy.</li>
      </ol>

      <h2>Pick a good password — and share it safely</h2>
      <ul>
        <li><strong>Make it strong</strong> but memorable, or generate one with a <Link href="/tools/password-generator">password generator</Link>.</li>
        <li><strong>Send it through a different channel</strong> than the file itself — e.g. the PDF by email, the password by text.</li>
        <li><strong>Don&apos;t lose it.</strong> There&apos;s no back door; without the password the file can&apos;t be opened.</li>
      </ul>

      <h2>How strong is the protection?</h2>
      <p>
        The PDF is encrypted with <strong>AES-256</strong>, the same standard used to protect sensitive data
        across the industry. It can&apos;t be opened without the password. Because the encryption happens in
        your browser (via qpdf compiled to WebAssembly), your document never touches a server.
      </p>

      <h2>Need to remove a password later?</h2>
      <p>
        If you have the password and want an unprotected copy, the{" "}
        <Link href="/tools/unlock-pdf">Unlock PDF tool</Link> removes it — the exact reverse of this tool, also
        in your browser.
      </p>

      <h2>Prepare the PDF first</h2>
      <p>
        You might want to <Link href="/tools/merge-pdf">merge several files</Link> into one before protecting
        it, <Link href="/tools/compress-pdf">compress it</Link> for email, or{" "}
        <Link href="/tools/watermark-pdf">add a watermark</Link>. See all the{" "}
        <Link href="/tools/pdf">PDF tools</Link> here.
      </p>

      <h2>FAQ</h2>
      <h3>Is my PDF uploaded anywhere?</h3>
      <p>No — encryption runs entirely in your browser, so the file never leaves your device.</p>
      <h3>What encryption is used?</h3>
      <p>AES-256, a strong industry-standard encryption. The PDF can&apos;t be opened without the password.</p>
      <h3>What if I forget the password?</h3>
      <p>There&apos;s no recovery — keep the password safe. Anyone with it (including you) can remove it later using the Unlock PDF tool.</p>
    </>
  );
}
