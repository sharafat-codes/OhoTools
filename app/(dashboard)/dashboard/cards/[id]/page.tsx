import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { normalizeCard } from "@/modules/cards/types";
import { CardEditor } from "@/modules/cards/components/card-editor";

export const metadata: Metadata = { title: "Edit Card" };

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const row = await prisma.card.findFirst({ where: { id, userId: (user as { id: string }).id } });
  if (!row) notFound();

  let data;
  try {
    data = normalizeCard(JSON.parse(row.data));
  } catch {
    data = normalizeCard({ occasion: row.occasion as never });
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link href="/dashboard/cards" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" /> My Cards
      </Link>
      <h1 className="mb-6 font-heading text-2xl font-semibold tracking-tight">Edit card</h1>
      <CardEditor occasion={data.occasion} initialCard={data} cardId={row.id} initialShortCode={row.shortCode ?? undefined} advanced />
    </div>
  );
}
