import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-add-a-logo-to-a-qr-code",
  title: "How to Add a Logo to a QR Code (Without Breaking It)",
  description:
    "Add your logo and brand colors to a QR code so it still scans reliably. Learn about error correction, contrast, sizing, and testing.",
  keywords: [
    "qr code with logo",
    "add logo to qr code",
    "branded qr code",
    "custom qr code",
    "qr code logo",
  ],
  date: "2026-07-22",
  readingMinutes: 4,
  tags: ["QR codes", "Branding"],
  related: ["qr-code", "wifi-qr", "color-converter"],
};

export function Body() {
  return (
    <>
      <p>
        A QR code with your logo in the middle looks far more trustworthy and on-brand than a plain
        black-and-white square — and people are more likely to scan it. The trick is doing it without
        making the code unreadable. Here&apos;s how.
      </p>

      <h2>Why you can put a logo in the middle at all</h2>
      <p>
        QR codes have built-in <strong>error correction</strong> — they can still be read even when
        part of the code is covered or damaged. At the highest level (H), roughly 30% of the code can
        be obscured and it will still scan. That&apos;s the headroom your logo uses.
      </p>

      <h2>The rules for a logo that still scans</h2>
      <ul>
        <li><strong>Use high error correction</strong> (level H) when adding a logo.</li>
        <li><strong>Keep the logo small</strong> — cover no more than about 20–30% of the center.</li>
        <li><strong>Don&apos;t cover the corners</strong> — the three large squares are position markers; they must stay clear.</li>
        <li><strong>Keep strong contrast</strong> — a dark code on a light background scans best. Avoid light-on-light.</li>
        <li><strong>Leave the quiet zone</strong> — keep clear margin around the whole code.</li>
      </ul>

      <h2>Pick colors that scan</h2>
      <p>
        You can brand a code with your colors, but the foreground must stay clearly darker than the
        background. If you&apos;re matching brand colors, our{" "}
        <Link href="/tools/color-converter">color converter</Link> helps you get exact HEX/RGB values.
        Avoid inverting the code (light modules on a dark background) unless you test it thoroughly.
      </p>

      <h2>Make one</h2>
      <p>
        Start with our free <Link href="/tools/qr-code">QR code generator</Link> for a quick code. To
        add a center logo, custom colors, and styled modules — and to make it a{" "}
        <em>dynamic</em> code you can edit and track — <Link href="/signup">create a free OhoTool
        account</Link>.
      </p>

      <h2>Always test before printing</h2>
      <p>
        A logo that&apos;s slightly too big can quietly break scanning on some phones. Before you print
        anything, scan the final code with two or three different devices from a normal distance. If
        it hesitates, shrink the logo or raise the error correction.
      </p>

      <h2>Bonus: a WiFi code to match</h2>
      <p>
        Branding a code for a café or office? Print a matching{" "}
        <Link href="/tools/wifi-qr">WiFi QR code</Link> so guests can connect by scanning — no
        password typing required.
      </p>
    </>
  );
}
