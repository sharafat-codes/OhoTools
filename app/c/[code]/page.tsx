import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { normalizeCard, OCCASIONS } from "@/modules/cards/types";
import { ogImageUrl } from "@/modules/tools/registry";
import { CardStage } from "@/modules/cards/components/card-stage";
import { CardOpenPing } from "@/modules/cards/components/card-open-ping";
import { SITE_URL } from "@/lib/site";

// Per-visitor render — never cache. The open is counted client-side (see
// CardOpenPing) so link-preview crawlers don't inflate the count.
export const dynamic = "force-dynamic";

type Params = Promise<{ code: string }>;

async function load(code: string) {
  const row = await prisma.card.findUnique({ where: { shortCode: code } });
  if (!row) return null;
  try {
    return { card: normalizeCard(JSON.parse(row.data)) };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { code } = await params;
  const found = await load(code);
  if (!found) return { title: "Card", robots: { index: false } };
  const { card } = found;
  const occ = OCCASIONS[card.occasion];
  const title = occ.title(card.to);
  const description = card.message.slice(0, 150);
  const image = ogImageUrl({
    eyebrow: occ.eyebrow,
    title: occ.title(card.to),
    subtitle: card.from ? `From ${card.from} — tap to open 🎉` : "Tap to open 🎉",
  });
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/c/${code}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function Page({ params }: { params: Params }) {
  const { code } = await params;
  const found = await load(code);

  if (!found) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-background p-8 text-center">
        <div className="max-w-sm">
          <h1 className="font-heading text-2xl font-semibold">Card not found</h1>
          <p className="mt-2 text-muted-foreground">This card link may have expired or been removed.</p>
          <Link
            href="/tools/cards"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Make your own
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden">
      <CardStage data={found.card} />
      <CardOpenPing code={code} />
    </main>
  );
}
