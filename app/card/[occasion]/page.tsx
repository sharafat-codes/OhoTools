import type { Metadata } from "next";
import Link from "next/link";

import { decodeCard } from "@/modules/cards/share";
import { DEFAULT_CARD } from "@/modules/cards/types";
import { ogImageUrl } from "@/modules/tools/registry";
import { CardStage } from "@/modules/cards/components/card-stage";
import { SITE_URL } from "@/lib/site";

type SearchParams = Promise<{ d?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { d } = await searchParams;
  const card = decodeCard(d) ?? DEFAULT_CARD;
  const title = `Happy Birthday, ${card.to}! 🎂`;
  const description = card.message.slice(0, 150);
  const image = ogImageUrl({
    eyebrow: "A birthday card for you",
    title: `Happy Birthday, ${card.to}!`,
    subtitle: card.from ? `From ${card.from} — tap to open 🎉` : "Tap to open your card 🎉",
  });
  return {
    title,
    description,
    // Cards are personal and unique per link — keep them out of the index.
    robots: { index: false, follow: false },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/card/birthday${d ? `?d=${d}` : ""}`,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const { d } = await searchParams;
  const card = decodeCard(d);

  if (!card) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-background p-8 text-center">
        <div className="max-w-sm">
          <h1 className="font-heading text-2xl font-semibold">This card link looks incomplete</h1>
          <p className="mt-2 text-muted-foreground">
            Create your own animated birthday card in seconds — free, no sign-up.
          </p>
          <Link
            href="/tools/birthday-card-maker"
            className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Make a birthday card
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden">
      <CardStage data={card} />
    </main>
  );
}
