import type { Metadata } from "next";

// Embed pages mirror the canonical /tools/<slug> pages, so they must never be
// indexed themselves (duplicate content) — but they stay crawlable/framable.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-background">{children}</div>;
}
