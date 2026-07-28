import Link from "next/link";

import type { PostMeta } from "@/modules/blog";

export const meta: PostMeta = {
  slug: "how-to-crop-an-image-online",
  title: "How to Crop an Image Online (Free, No Upload)",
  description:
    "Crop a photo to the exact size or shape you need — a square for Instagram, 16:9 for a thumbnail, or a circle for an avatar. Free and entirely in your browser.",
  keywords: [
    "how to crop an image",
    "crop image online",
    "crop photo",
    "crop image to square",
    "crop picture free",
  ],
  date: "2026-07-28",
  readingMinutes: 4,
  tags: ["Images", "Productivity"],
  related: ["crop-image", "circle-crop", "image-resizer", "image-converter"],
};

export function Body() {
  return (
    <>
      <p>
        Cropping is the quickest way to fix a photo — cut out the distracting edges, straighten a
        composition, or fit an image into a specific space like a profile picture or a video thumbnail.
        Here&apos;s how to crop an image online for free, without installing anything and without your
        photo ever being uploaded to a server.
      </p>

      <h2>Crop an image in three steps</h2>
      <p>
        Use the <Link href="/tools/crop-image">Crop Image tool</Link>:
      </p>
      <ol className="mb-4 list-decimal pl-5 text-muted-foreground [&_a]:text-primary [&_a]:underline">
        <li>Open <Link href="/tools/crop-image">Crop Image</Link> and drop in your JPG, PNG, or WebP.</li>
        <li>Drag the crop box to move it, or drag a corner to resize. The live readout shows the exact pixel size.</li>
        <li>Click <strong>Crop &amp; download</strong> to save just the selected area.</li>
      </ol>

      <h2>Crop to a specific aspect ratio</h2>
      <p>
        Different places want different shapes. Instead of eyeballing it, pick a ratio and the crop box
        snaps to it:
      </p>
      <ul>
        <li><strong>1:1 (square)</strong> — profile pictures, Instagram posts, product thumbnails.</li>
        <li><strong>4:3</strong> — classic photo prints and many presentations.</li>
        <li><strong>16:9</strong> — YouTube thumbnails, slides, and video covers.</li>
        <li><strong>Free</strong> — any shape you like, for banners or awkward spaces.</li>
      </ul>

      <h2>Crop vs. resize — what&apos;s the difference?</h2>
      <p>
        They&apos;re often confused. <strong>Cropping</strong> throws away the parts of the image outside
        your selection, changing what is shown. <strong>Resizing</strong> keeps the whole image but changes
        its dimensions. If your goal is a smaller file or exact pixel dimensions, reach for the{" "}
        <Link href="/tools/image-resizer">Image Resizer</Link> instead — and you can do both: crop to the
        right shape, then resize to the right size.
      </p>

      <h2>Want a round crop?</h2>
      <p>
        For avatars and profile pictures, a circle looks cleaner than a square. The{" "}
        <Link href="/tools/circle-crop">Circle Crop tool</Link> crops from the centre to a perfect circle and
        saves a PNG with a transparent background, so it drops neatly onto any color.
      </p>

      <h2>Tips for a clean crop</h2>
      <ul>
        <li><strong>Leave a little breathing room</strong> around the subject rather than cropping too tight.</li>
        <li><strong>Match the destination.</strong> Check the aspect ratio the platform expects before you crop.</li>
        <li><strong>Keep the original.</strong> Cropping is destructive — save a copy so you can re-crop later.</li>
      </ul>

      <h2>Go further</h2>
      <p>
        After cropping you might want to <Link href="/tools/rotate-image">rotate or flip</Link> the image,{" "}
        <Link href="/tools/add-text-to-image">add a caption</Link>, or{" "}
        <Link href="/tools/image-converter">convert it to another format</Link>. Browse all our{" "}
        <Link href="/tools/image-editing">image editing tools</Link> in one place.
      </p>

      <h2>FAQ</h2>
      <h3>Is my image uploaded anywhere?</h3>
      <p>No — cropping happens entirely in your browser, so your photo never leaves your device.</p>
      <h3>Does cropping reduce the quality?</h3>
      <p>No. It keeps the original pixels inside your selection at full quality; JPEGs are re-saved at a high quality setting.</p>
      <h3>Can I crop to an exact pixel size?</h3>
      <p>The crop box shows the live pixel dimensions as you drag, so you can match a target size closely. For exact dimensions, crop first and then use the Image Resizer.</p>
    </>
  );
}
