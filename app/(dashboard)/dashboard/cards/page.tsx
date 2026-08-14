import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { normalizeCard, resolveTheme, OCCASIONS, type CardData } from "@/modules/cards/types";
import { cardShareUrl } from "@/modules/cards/share";
import { SITE_URL } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { DeleteCardButton } from "@/modules/cards/components/delete-card-button";

export const metadata: Metadata = { title: "My Cards" };

function parse(json: string): CardData {
  try {
    return normalizeCard(JSON.parse(json));
  } catch {
    return normalizeCard(null);
  }
}

export default async function CardsPage() {
  const user = await requireUser();
  const rows = await prisma.card.findMany({
    where: { userId: (user as { id: string }).id },
    orderBy: { updatedAt: "desc" },
  });

  const cards = rows.map((r) => {
    const data = parse(r.data);
    return {
      id: r.id,
      title: r.title || `${OCCASIONS[data.occasion].label} card`,
      occasion: data.occasion,
      updatedAt: r.updatedAt,
      theme: resolveTheme(data),
      url: cardShareUrl(SITE_URL, data),
    };
  });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">My Cards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your saved cards &amp; invitations. Re-open one to edit, or share its link again.
          </p>
        </div>
        <Button render={<Link href="/tools/cards" />} className="shrink-0">
          <PlusIcon className="size-4" /> New card
        </Button>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">You haven&apos;t saved any cards yet.</p>
          <Button render={<Link href="/tools/cards" />}>
            Create your first card <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div
                className="relative flex h-28 items-center justify-center text-center"
                style={{ background: `linear-gradient(135deg, ${c.theme.bg1}, ${c.theme.bg2})` }}
              >
                <span className="px-3 text-sm font-semibold text-white drop-shadow" style={{ color: "#fff" }}>
                  {OCCASIONS[c.occasion].eyebrow}
                </span>
              </div>
              <div className="p-3">
                <div className="truncate font-medium">{c.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {OCCASIONS[c.occasion].label} · {c.updatedAt.toLocaleDateString()}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/cards/${c.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
                  >
                    Edit
                  </Link>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:border-primary/40"
                  >
                    Open
                  </a>
                  <DeleteCardButton id={c.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
