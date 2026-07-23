import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-convert-heic-to-jpg",
  title: "How to Convert HEIC to JPG (iPhone Photos)",
  description:
    "iPhone photos save as HEIC, which many apps can't open. Here's how to convert HEIC to JPG so your photos work everywhere.",
  keywords: [
    "how to convert heic to jpg",
    "heic to jpg",
    "iphone photo to jpg",
    "open heic on windows",
    "heic converter",
  ],
  date: "2026-07-23",
  readingMinutes: 3,
  tags: ["Images", "iPhone"],
  related: ["heic-to-jpg", "heic-to-png", "image-converter"],
};

export function Body() {
  return (
    <>
      <p>
        By default, iPhones save photos as <strong>HEIC</strong> — a modern format that saves space but
        that lots of apps, websites, and Windows programs still can&apos;t open. The fix is to convert it
        to <strong>JPG</strong>, which works everywhere.
      </p>

      <h2>Convert HEIC to JPG</h2>
      <p>
        Use the <Link href="/tools/heic-to-jpg">HEIC to JPG tool</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/heic-to-jpg">HEIC to JPG</Link> and upload your <code>.heic</code> photo.</li>
        <li>Convert it.</li>
        <li>Download the JPG — now it opens on any device or app.</li>
      </ol>

      <h2>Why can&apos;t my browser open HEIC?</h2>
      <p>
        Web browsers can&apos;t decode Apple&apos;s HEIC format, which is exactly why so many online tools
        struggle with it. The conversion is done with a dedicated image engine, then the file is discarded.
      </p>

      <h2>JPG or PNG?</h2>
      <ul>
        <li><strong>JPG</strong> — best for photos; much smaller files. This is what most people want.</li>
        <li><strong>PNG</strong> — lossless, larger files; use <Link href="/tools/heic-to-png">HEIC to PNG</Link> only if you need maximum quality or transparency.</li>
      </ul>

      <h2>Stop the problem at the source (optional)</h2>
      <p>
        On your iPhone you can set the camera to shoot JPG directly: <em>Settings → Camera → Formats →
        Most Compatible</em>. New photos will then be JPG — though you&apos;ll still need to convert the
        HEIC photos you already have.
      </p>

      <h2>FAQ</h2>
      <h3>Will I lose photo quality?</h3>
      <p>JPG is lossy, but at high quality the difference is effectively invisible for normal viewing and sharing.</p>
      <h3>Are my photos uploaded?</h3>
      <p>Your photo is processed to perform the conversion and then deleted — it isn&apos;t stored.</p>
    </>
  );
}
