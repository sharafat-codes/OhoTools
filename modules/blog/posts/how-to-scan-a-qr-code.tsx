import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-scan-a-qr-code",
  title: "How to Scan a QR Code on a Computer (or from an Image)",
  description:
    "No phone needed — scan a QR code on your laptop with the webcam, or read one from a screenshot or saved image. Free, in your browser, nothing uploaded.",
  keywords: [
    "how to scan a qr code",
    "scan qr code on computer",
    "qr code scanner",
    "read qr code from image",
    "qr code reader online",
  ],
  date: "2026-07-31",
  readingMinutes: 4,
  tags: ["QR Codes"],
  related: ["qr-scanner", "qr-code", "wifi-qr", "bulk-qr-generator"],
};

export function Body() {
  return (
    <>
      <p>
        QR codes are everywhere, but they assume you have a phone in hand. What if the QR code is already{" "}
        <em>on</em> your screen — in an email, a PDF, or a screenshot — or you just want to scan one at your
        desk? Here&apos;s how to scan a QR code on a computer, either with your webcam or straight from an
        image, for free and without uploading anything.
      </p>

      <h2>Two ways to scan</h2>
      <p>Open the <Link href="/tools/qr-scanner">QR Code Scanner</Link>, then either:</p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li><strong>Upload an image</strong> — drop in a screenshot or photo that contains the QR code, and it&apos;s decoded instantly.</li>
        <li><strong>Use your camera</strong> — click <em>Scan with camera</em> and hold the code up to your webcam.</li>
      </ol>
      <p>
        As soon as it reads the code you&apos;ll see the content — text, a link, Wi-Fi details, and so on —
        with a one-click copy button, plus an <em>Open link</em> button when it&apos;s a URL.
      </p>

      <h2>When the image scan is the better choice</h2>
      <ul>
        <li><strong>The QR is already a screenshot</strong> — no need to point a phone at your own screen.</li>
        <li><strong>It&apos;s inside a PDF or email</strong> — screenshot it and upload.</li>
        <li><strong>Blurry camera scans</strong> — a clean saved image reads more reliably.</li>
      </ul>

      <h2>Is it safe?</h2>
      <p>
        Decoding happens entirely in your browser — your image and camera frames never leave your device.
        One tip that applies to any scanner: a QR code is just a link or text, so check where a link goes
        before you open it, the same way you would with any URL.
      </p>

      <h2>Need to create QR codes too?</h2>
      <p>
        The scanner&apos;s counterpart is the <Link href="/tools/qr-code">QR Code Generator</Link> — make a
        code for any link or text. There&apos;s also a <Link href="/tools/wifi-qr">Wi-Fi QR generator</Link>{" "}
        (guests scan to join your network) and a{" "}
        <Link href="/tools/bulk-qr-generator">bulk QR generator</Link> for making many at once.
      </p>

      <h2>FAQ</h2>
      <h3>Do I need to install an app?</h3>
      <p>No — it runs in your browser on desktop or mobile. Nothing to install.</p>
      <h3>Is my image or camera uploaded?</h3>
      <p>No — decoding is done locally in your browser; images and camera frames never leave your device.</p>
      <h3>Does camera scanning work on my phone?</h3>
      <p>Yes, on a secure (https) connection. If the camera isn&apos;t available, upload a photo of the code instead.</p>
      <h3>What can it read?</h3>
      <p>Any standard QR code — links, plain text, Wi-Fi credentials, contact cards, and more.</p>
    </>
  );
}
