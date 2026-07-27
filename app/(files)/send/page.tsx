import type { Metadata } from "next";
import { LockIcon, ZapIcon, TimerIcon } from "lucide-react";

import { SendTool } from "@/modules/transfer/components/send-tool";
import { ogImageUrl } from "@/modules/tools/registry";
import { SITE_URL } from "@/lib/site";

const title = "Send a File — Free Encrypted File Sharing";
const description =
  "Share files with a link — no sign-up. Files are encrypted in your browser before upload and auto-delete within 24 hours. A private, secure way to send a file to any device.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "send a file",
    "share files online",
    "send large files free",
    "encrypted file sharing",
    "transfer files between devices",
    "share file by link",
  ],
  alternates: { canonical: "/send" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/send`,
    siteName: "OhoTool",
    title,
    description,
    images: [{ url: ogImageUrl({ eyebrow: "Send", title: "Send a file, securely", subtitle: description }), width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  {
    q: "Is it really private?",
    a: "Yes. Your file is encrypted in your browser with a key that lives only in the share link. We store just the encrypted blob — we can't read your file, and neither can anyone without the link.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can send a file and get a share link without signing up.",
  },
  {
    q: "How long do files last?",
    a: "You choose an expiry up to 24 hours. After that the file is automatically and permanently deleted.",
  },
  {
    q: "How big can the file be?",
    a: "Up to 100 MB per file right now. That covers photos, documents, audio, and most everyday transfers.",
  },
  {
    q: "How does the person download it?",
    a: "Send them the link (or let them scan the QR code). It opens a page that decrypts the file in their browser and downloads it.",
  },
];

export default function SendPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Send a File — OhoTool",
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Send a file, securely
        </h1>
        <p className="mt-4 text-pretty text-muted-foreground">
          Drop a file, get a link. It&apos;s encrypted in your browser before it ever leaves your
          device, and it auto-deletes within 24 hours. No sign-up.
        </p>
      </div>

      <div className="mt-10">
        <SendTool />
      </div>

      {/* Trust points */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <Point icon={LockIcon} title="End-to-end encrypted" body="The key stays in the link — we can't read your file." />
        <Point icon={TimerIcon} title="Auto-deletes" body="Choose an expiry up to 24 hours; then it's gone for good." />
        <Point icon={ZapIcon} title="No sign-up" body="Send instantly. Scan the QR to open it on any device." />
      </div>

      {/* How it works */}
      <section className="mt-14">
        <h2 className="font-heading text-xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-4 flex flex-col gap-3">
          {[
            "Choose a file and an expiry time.",
            "Your browser encrypts it and uploads the encrypted data.",
            "Share the link (or QR code) — the recipient's browser decrypts and downloads it.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium tabular-nums">
                {i + 1}
              </span>
              <span className="pt-0.5 text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="mt-4 flex flex-col gap-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-border bg-card p-4 [&_summary]:cursor-pointer">
              <summary className="font-medium marker:content-none">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Point({ icon: Icon, title, body }: { icon: typeof LockIcon; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className="mx-auto mb-2 grid size-9 place-items-center rounded-lg bg-muted text-foreground">
        <Icon className="size-4.5" />
      </div>
      <div className="text-sm font-medium">{title}</div>
      <p className="mt-1 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}
