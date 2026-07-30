---
title: I built 130+ free browser tools that never upload your files
published: false
tags: webdev, javascript, nextjs, showdev
canonical_url:
cover_image:
---

> Ready-to-paste dev.to / Hashnode article. `published: false` = it imports as a
> draft so you can add a cover image and hit publish yourself. Leave
> `canonical_url` blank (the article lives on dev.to; that's the backlink).

I kept hitting the same annoyance: I'd need to merge two PDFs, or shrink an image for an email, and I'd end up on some random single-tool site plastered with ads, forced to **upload my file to a stranger's server**, dismiss a cookie wall, and sometimes make an account — just to do 10 seconds of work.

So I built [OhoTool](https://ohotool.com): 130+ everyday tools in one place. The rule I set for myself: **whenever it's technically possible, the tool runs entirely in the browser, and your file never leaves your device.** Here's how that actually plays out, tool category by category — and where I was forced to break the rule.

## The core idea: client-side first

Most "online tool" sites upload your file, process it on a server, and send it back. That's a privacy cost for the user and a compute cost for the owner. The browser is far more capable than that model assumes — modern Web APIs and WebAssembly can do a huge amount locally.

Going client-side gave me three wins at once: **privacy** (files never leave the device), **speed** (no upload/download round-trip), and **near-zero server cost** (which is what makes "free and unlimited" sustainable).

## PDFs — pdf-lib + pdf.js

- **Editing/creating** (merge, split, rotate, watermark, page numbers, images→PDF, sign): [`pdf-lib`](https://pdf-lib.js.org/). It reads and writes PDF structure directly in JS.
- **Rendering/extracting** (PDF→images, PDF→text): `pdfjs-dist` (Mozilla's pdf.js) — render each page to a `<canvas>`, or pull the text layer.

Both are dynamically imported so they stay out of the main bundle:

```js
const { PDFDocument } = await import("pdf-lib");
```

One TypeScript gotcha worth knowing: `doc.save()` returns a `Uint8Array<ArrayBufferLike>`, which recent TS lib types refuse to accept as a `BlobPart`. Wrap it:

```js
new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
```

## Images — the Canvas API

Convert (PNG/JPG/WebP), resize, compress, crop, rotate, circle-crop for avatars, add text — all just `<canvas>` + `drawImage` + `toBlob`. A couple of details that matter:

- **Keep JPEGs as JPEG.** If you re-encode a photo to PNG "to be safe," the file balloons. Detect the source type and preserve it.
- **A real `.ico` encoder in ~30 lines.** Modern ICO files can embed PNGs directly, so "image → ICO" is: render the image to N canvas sizes, `toBlob` each as PNG, then hand-assemble the `ICONDIR` + `ICONDIRENTRY` headers with a `DataView`. No library needed.

## Audio & video — ffmpeg.wasm

This is the fun one. [`ffmpeg.wasm`](https://ffmpegwasm.netlify.app/) runs a real FFmpeg build in the browser, so converting, trimming, merging, compressing, and extracting audio all happen locally.

Two things I learned:

1. **Use the single-thread core from a CDN.** The multi-thread build needs `SharedArrayBuffer`, which requires COOP/COEP response headers — and those headers *break* cross-origin embeds (I load Dropbox/Google pickers and a payments script). The single-thread core sidesteps all of that. It's slower, but fine for the short clips this is meant for.
2. **Trimming video needs a re-encode, not `-c copy`.** With stream-copy, the cut lands on the nearest keyframe, so the clip opens with a few seconds of *audio-only, black video* until the next keyframe. Re-encoding the trimmed span puts a keyframe at frame 0 and the cut becomes frame-accurate. (Audio trim is fine with `-c copy`.)

The engine is ~30 MB, so it's lazy-loaded once on first use and cached.

## Everything else — plain JS

Text utilities, JSON/SQL/XML formatters, calculators, converters, QR codes, timers, an autosaving notepad, an invoice generator (form → PDF via pdf-lib) — no server, no dependencies beyond the odd small library.

## Where I *had* to use a server

Three cases genuinely can't run in the browser, and I label them clearly:

- **High-fidelity Office↔PDF** (Word/Excel/PowerPoint) — needs a real document engine.
- **HEIC decoding** — browsers can't decode Apple's HEIC.
- **AI writing tools** (summarize, paraphrase, humanize, translate, grammar, etc.) — these call an LLM, which has a per-request cost, so they're freemium: a small free daily quota, unlimited on a paid plan.

Being honest about this in the UI matters — "processed on our server, then deleted" vs. "runs in your browser" is a real trust signal.

## Bonus: a registry-driven architecture

Every tool is one entry in a central registry (slug, name, description, keywords, how-to steps, FAQs, related tools). From that single source I generate the page, the SEO metadata, the sitemap, the JSON-LD structured data, the category hubs, and the internal links. **Adding a tool = one registry entry + one component + a two-line page.** New tools inherit all the SEO for free.

## Try a few

- [Merge PDF](https://ohotool.com/tools/merge-pdf)
- [Crop Image](https://ohotool.com/tools/crop-image)
- [Audio Converter](https://ohotool.com/tools/audio-converter)
- [AI Humanizer](https://ohotool.com/tools/ai-humanizer)
- [Invoice Generator](https://ohotool.com/tools/invoice-generator)
- …or [browse all of them](https://ohotool.com/tools).

It's free and there's no sign-up for the browser-based tools. If you build something similar or want a tool that isn't there yet, I'd genuinely like to hear it — what would you add?
