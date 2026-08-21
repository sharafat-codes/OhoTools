import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "what-is-a-user-agent",
  title: "What Is a User Agent? (And How to Find Yours)",
  description:
    "A user agent is the ID string your browser sends with every request. Learn what's inside it, how to read one, how to find yours, and why it can't always be trusted.",
  keywords: [
    "what is a user agent",
    "user agent string",
    "what is my user agent",
    "user agent explained",
    "browser user agent",
  ],
  date: "2026-08-21",
  readingMinutes: 4,
  tags: ["Developer"],
  related: ["user-agent-parser", "what-is-my-ip", "http-status-codes"],
};

export function Body() {
  return (
    <>
      <p>
        Every time your browser loads a page, it sends a line of text called a <strong>user agent</strong> that
        identifies itself to the website. Servers use it to know roughly what browser, operating system, and device
        you&apos;re on. Here&apos;s what it is, how to read one, and why you shouldn&apos;t fully trust it.
      </p>

      <h2>Find yours instantly</h2>
      <p>
        The <Link href="/tools/user-agent-parser">user agent parser</Link> shows your browser&apos;s exact
        user-agent string and breaks it down into browser, OS, rendering engine, and device — all in your browser,
        nothing uploaded. You can also paste any UA string to decode it.
      </p>

      <h2>What&apos;s inside a user agent?</h2>
      <p>Take a typical Chrome-on-Windows string:</p>
      <p>
        <code>Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36</code>
      </p>
      <p>Decoded, it tells the server:</p>
      <ul>
        <li><strong>Operating system</strong> — <code>Windows NT 10.0</code> (Windows 10/11), 64-bit.</li>
        <li><strong>Rendering engine</strong> — <code>AppleWebKit</code> / Blink.</li>
        <li><strong>Browser &amp; version</strong> — <code>Chrome/120.0</code>.</li>
        <li>
          The <code>Mozilla/5.0</code> and <code>Safari/537.36</code> bits are legacy tokens almost every browser
          includes for historical compatibility — they don&apos;t mean you&apos;re using Firefox or Safari.
        </li>
      </ul>

      <h2>Why does the user agent matter?</h2>
      <ul>
        <li><strong>Analytics</strong> — sites use it to report which browsers and devices visitors use.</li>
        <li><strong>Serving the right assets</strong> — e.g. a mobile layout for phones.</li>
        <li><strong>Debugging</strong> — reproducing a bug that only happens on a specific browser/OS.</li>
        <li><strong>Bot detection</strong> — crawlers (Googlebot, etc.) identify themselves in the UA.</li>
      </ul>

      <h2>The catch: user agents can&apos;t be fully trusted</h2>
      <p>
        A user-agent string is <strong>easy to change or spoof</strong> — browsers let you override it, and bots
        often impersonate real browsers. So treat it as a hint, not proof. For deciding what a browser supports,
        <strong> feature detection</strong> (checking whether a capability exists) is far more reliable than
        &quot;UA sniffing.&quot;
      </p>

      <h2>FAQ</h2>
      <h3>What is my user agent?</h3>
      <p>
        It&apos;s the exact string your browser sends — see it (and its decoded parts) in the{" "}
        <Link href="/tools/user-agent-parser">user agent parser</Link>.
      </p>
      <h3>Why does Chrome&apos;s user agent say &quot;Mozilla&quot; and &quot;Safari&quot;?</h3>
      <p>
        For historical compatibility. Decades ago sites checked for &quot;Mozilla,&quot; so nearly every browser
        still includes those legacy tokens — they don&apos;t indicate the real browser.
      </p>
      <h3>Can I change my user agent?</h3>
      <p>
        Yes — browser dev tools and extensions can override it. That&apos;s exactly why servers can&apos;t rely on
        it for anything security-sensitive.
      </p>
      <h3>Is reading a user agent a privacy risk?</h3>
      <p>
        On its own it&apos;s a broad identifier (browser/OS/device), but combined with other signals it can
        contribute to fingerprinting. Our parser reads it locally and sends nothing to a server.
      </p>
    </>
  );
}
