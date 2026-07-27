import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-send-large-files-for-free",
  title: "How to Send Large Files for Free (Securely)",
  description:
    "The easiest way to send a large file to someone — free, no account, and end-to-end encrypted. Plus what to do when a file is too big to email.",
  keywords: [
    "send large files free",
    "how to send large files",
    "free file transfer",
    "send big files online",
    "share large files",
  ],
  date: "2026-07-23",
  readingMinutes: 4,
  tags: ["Files", "Productivity"],
  related: ["compress-pdf", "compress-image", "merge-pdf"],
};

export function Body() {
  return (
    <>
      <p>
        Email won&apos;t send it. The USB drive is nowhere to be found. You just want to get one
        largish file to someone else — quickly, and without signing up for anything. Here&apos;s the
        simplest way, and it keeps the file private end to end.
      </p>

      <h2>Send a file with a link</h2>
      <p>
        Use <Link href="/send">Send a file</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/send">Send</Link> and choose your file.</li>
        <li>Optionally set a password and pick when it should auto-delete (up to 24 hours).</li>
        <li>Click <strong>Create secure link</strong> and share the link — or let the other person scan the QR code.</li>
      </ol>
      <p>
        The file is <strong>encrypted in your browser before it uploads</strong>, and the decryption
        key stays inside the link itself — so it&apos;s never stored on our servers and we can&apos;t
        read your file. It&apos;s free, needs no account, and works phone-to-computer or anywhere in between.
      </p>

      <h2>Why not just email it?</h2>
      <p>
        Most email providers cap attachments at around 25 MB, and even then a big attachment can bounce
        or clog the recipient&apos;s inbox. A share link sidesteps all of that — the recipient downloads
        only when they&apos;re ready.
      </p>

      <h2>If your file is still too big</h2>
      <p>
        Send handles files up to 50 MB. If you&apos;re over that (or just want a faster transfer), shrink
        the file first — it&apos;s often easy:
      </p>
      <ul>
        <li><strong>PDFs:</strong> <Link href="/tools/compress-pdf">Compress PDF</Link> can cut the size dramatically.</li>
        <li><strong>Images:</strong> <Link href="/tools/compress-image">Compress Image</Link> or resize before sending.</li>
        <li><strong>Multiple PDFs:</strong> <Link href="/tools/merge-pdf">Merge</Link> them into one clean file to share.</li>
      </ul>

      <h2>Keep it private</h2>
      <p>
        For anything sensitive, add a password when you send it — then the recipient needs both the link
        and the password. Share the password through a different channel (a text, say) rather than in the
        same message as the link.
      </p>

      <h2>FAQ</h2>
      <h3>Is it really free?</h3>
      <p>Yes — no account, no payment, no watermark. Just send and share the link.</p>
      <h3>How long does the file stay available?</h3>
      <p>You choose, up to 24 hours, after which it&apos;s permanently deleted.</p>
      <h3>Can the recipient download it on their phone?</h3>
      <p>Yes — the link opens on any device, and they can scan the QR code to grab it on a phone.</p>
    </>
  );
}
