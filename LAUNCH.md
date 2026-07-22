# OhoTool — Launch Kit

Everything you need to get the first wave of users. Copy-paste ready. Live site: **https://ohotool.com**

## Positioning (the one thing to communicate)

**69 fast, private online tools that run entirely in your browser — nothing is uploaded.**
QR codes, a full PDF toolkit, image conversion, plus developer, text, and everyday calculators. Free and no sign-up. Pro adds dynamic QR + analytics, bulk processing, and an API.

The hook that sets you apart from Smallpdf / iLovePDF / random tool sites: **your files never leave your device** (everything runs client-side) + it's an all-in-one hub, not one narrow tool.

---

## 1. Product Hunt

**Name:** OhoTool
**Tagline (≤60 chars — pick one):**
- `69 private online tools that never upload your files`
- `Free browser tools: QR, PDF, image & developer utilities`
- `All-in-one toolkit that runs 100% in your browser`

**Description:**
> OhoTool is a growing collection of 69+ free online tools — QR & barcode generators, a full PDF toolkit (merge, split, PDF↔images, watermark), image converters/resizers, plus developer, text, and everyday calculators. Everything runs in your browser, so your files and data are never uploaded. No sign-up to use the tools. Pro unlocks dynamic QR codes with scan analytics, branding, bulk processing, and an API.

**Topics/tags:** Productivity, Design Tools, Developer Tools, PDF, SaaS

**First comment (from you, the maker):**
> Hi everyone 👋 I built OhoTool because I was tired of tools that upload my PDFs and images to some server just to convert them. Every tool here runs 100% in your browser — your files never leave your device — and most don't even need an account.
>
> It started as a QR/barcode generator and grew into a hub: a full PDF toolkit (merge, split, PDF→JPG, watermark, page numbers), image converter/resizer, bulk image processing, and a bunch of developer + everyday tools (JSON, JWT, hashing, unit/timezone converters, calculators).
>
> It's free with no sign-up. Pro ($9/mo) adds dynamic QR codes + scan analytics, unlimited bulk/ZIP export, and an API. Would love your feedback on what tool to add next!

**Gallery / screenshot shot list (capture these):**
1. The `/tools` hub showing the categories + tool grid.
2. A tool in action — e.g. QR generator with a branded code, or PDF→Images preview grid.
3. The Merge PDF / Bulk Image Converter (shows the "batch + ZIP" value).
4. The dynamic-QR scan-analytics dashboard (the Pro hook).
5. `/pricing` page (free-first framing).

**Timing:** Launch 12:01am PT (Product Hunt resets on PT). Reply to every comment in the first few hours — engagement drives ranking.

---

## 2. Hacker News — "Show HN"

**Title:**
`Show HN: OhoTool – 69 free online tools that run entirely in your browser`

**Body:**
> I got frustrated that converting a PDF or resizing an image online usually means uploading it to someone's server. So I built OhoTool — a hub of 69 tools that all run client-side. Your files never leave the browser.
>
> It covers a PDF toolkit (merge/split/PDF→images/watermark via pdf-lib + pdf.js), image conversion/resizing (canvas), QR/barcodes, and a pile of developer/text/calculator utilities. Static Next.js pages, so they're fast and work without an account.
>
> It's free; a Pro tier adds dynamic QR + scan analytics, bulk/ZIP export, and an API. Happy to answer anything about the client-side approach or what I'd build next.
>
> https://ohotool.com

*(HN dislikes marketing tone — keep it plain, technical, and engage in the comments.)*

---

## 3. Reddit (value-first, follow each sub's self-promo rules)

Good fits: r/webdev, r/SideProject, r/InternetIsBeautiful, r/productivity, r/coolgithubprojects, r/selfhosted (mention client-side/no-upload).

**Sample post (r/SideProject or r/webdev):**
> **I built a hub of 69 online tools that never upload your files (all client-side)**
> After using too many "upload your PDF to convert it" sites, I made OhoTool — QR codes, PDF merge/split/convert, image tools, and dev/text utilities that all run in the browser. Free, no sign-up. Tech: Next.js (static tool pages), pdf-lib + pdf.js + canvas for the file stuff. Feedback + tool requests welcome: https://ohotool.com

Don't blast the same post everywhere; tailor the angle (privacy for r/selfhosted, tech for r/webdev, "neat tool" for r/InternetIsBeautiful).

---

## 4. Directories to submit to (free listings)

- AlternativeTo (list as an alternative to Smallpdf / iLovePDF / CyberChef)
- SaaSHub
- Toolfinder / Tooldirectory / "awesome tools" lists
- Uneed, Fazier, Peerlist Launchpad (Product Hunt alternatives)
- dev.to / Hashnode article ("I built 69 client-side tools")
- GitHub "awesome-*" lists (awesome-privacy, awesome-web-tools) via PR
- llmstxt / AI tool directories where relevant

---

## 5. X / LinkedIn post

> Launched OhoTool 🚀 — 69 free online tools that run 100% in your browser. QR codes, a full PDF toolkit, image converters, and dev/text/calculator utilities. Your files never get uploaded. No sign-up.
> 👉 https://ohotool.com
> What tool should I add next?

---

## 6. Ongoing (compounds over weeks)

- **Answer real questions** on Reddit/StackOverflow/forums with a genuinely helpful reply + a tool link when relevant (e.g. someone asking "how to merge PDFs without uploading" → link Merge PDF).
- **One blog post per week** targeting a specific tool's long-tail (already have 11 posts; keep going).
- **Backlinks**: the directory + dev.to routes above are the fastest way to earn the domain authority a new site needs to rank.

---

## Pre-launch checklist

- [ ] Verify **Vercel Web Analytics + Speed Insights** are enabled (dashboard) so you can measure the launch.
- [ ] Submit the sitemap in **Google Search Console** (`https://ohotool.com/sitemap.xml`).
- [ ] Set `EMAIL_FROM=noreply@ohotool.com` in Vercel once Resend shows Verified (so signup emails send).
- [ ] Capture the 5 screenshots above.
- [ ] Test **PDF → Images** and **Bulk Image Converter** in a real browser once (they rely on client-side workers).
- [ ] Point the Stripe webhook at `https://ohotool.com/api/webhooks/stripe` (optional — old one still works).
