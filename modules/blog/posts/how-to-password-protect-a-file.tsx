import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-password-protect-a-file",
  title: "How to Password-Protect a File You Share",
  description:
    "Share a file so only the person with the password can open it. A simple, private way to password-protect files you send online — no software to install.",
  keywords: [
    "password protect a file",
    "share file with password",
    "send file password protected",
    "secure file sharing",
    "protect a file with a password",
  ],
  date: "2026-07-23",
  readingMinutes: 3,
  tags: ["Files", "Security"],
  related: ["sign-pdf", "watermark-pdf", "compress-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Sometimes a share link isn&apos;t enough — you want a second lock so that only the intended
        person can open the file, even if the link ends up in the wrong place. Adding a password is the
        easiest way, and you can do it in seconds without installing anything.
      </p>

      <h2>Send a password-protected file</h2>
      <p>
        Use <Link href="/send">Send a file</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/send">Send</Link> and choose your file.</li>
        <li>Enter a <strong>password</strong> in the optional password field.</li>
        <li>Create the link and share it — the recipient will be asked for the password before they can download.</li>
      </ol>

      <h2>How the protection works</h2>
      <p>
        The file is end-to-end encrypted, and the password is turned into a secure key check
        <em> in your browser</em> — the actual password is never sent to or stored on our servers. To
        open the file, someone needs <strong>both</strong> the link and the password. Get either one
        wrong and the download is refused.
      </p>

      <h2>Best practices</h2>
      <ul>
        <li><strong>Send the password separately.</strong> Text it or say it in person — don&apos;t put it in the same email as the link.</li>
        <li><strong>Use a strong password</strong> that isn&apos;t easy to guess, especially for sensitive documents.</li>
        <li><strong>Set a short expiry.</strong> Files auto-delete after up to 24 hours, so they don&apos;t linger.</li>
      </ul>

      <h2>Related: document handling</h2>
      <p>
        For documents you share often, you might also want to{" "}
        <Link href="/tools/sign-pdf">sign a PDF</Link>,{" "}
        <Link href="/tools/watermark-pdf">add a watermark</Link>, or{" "}
        <Link href="/tools/compress-pdf">compress it</Link> before sending.
      </p>

      <h2>FAQ</h2>
      <h3>Can you (OhoTool) see my password or file?</h3>
      <p>No. The password is checked using a value derived in your browser, and the file is encrypted with a key that only lives in the link — we store neither.</p>
      <h3>What if the recipient forgets the password?</h3>
      <p>There&apos;s no reset — that&apos;s the point of the protection. Just send the file again with a new password.</p>
    </>
  );
}
