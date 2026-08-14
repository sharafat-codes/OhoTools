"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { normalizeCard, OCCASIONS, type CardData } from "@/modules/cards/types";

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

function autoTitle(card: CardData): string {
  const label = OCCASIONS[card.occasion].label;
  return card.to ? `${label} — ${card.to}` : label;
}

/** Create a new saved card for the signed-in user. */
export async function saveCard(input: { title?: string; data: CardData }): Promise<SaveResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to save cards." };
  const userId = (user as { id: string }).id;
  const card = normalizeCard(input.data);
  const title = (input.title ?? "").toString().trim().slice(0, 80) || autoTitle(card);
  try {
    const row = await prisma.card.create({
      data: { userId, title, occasion: card.occasion, data: JSON.stringify(card) },
    });
    revalidatePath("/dashboard/cards");
    return { ok: true, id: row.id };
  } catch {
    return { ok: false, error: "Couldn't save the card. Please try again." };
  }
}

/** Update an existing saved card the user owns. */
export async function updateCard(id: string, input: { title?: string; data: CardData }): Promise<SaveResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  const userId = (user as { id: string }).id;
  const card = normalizeCard(input.data);
  try {
    const existing = await prisma.card.findFirst({ where: { id, userId }, select: { id: true } });
    if (!existing) return { ok: false, error: "Card not found." };
    await prisma.card.update({
      where: { id },
      data: {
        occasion: card.occasion,
        data: JSON.stringify(card),
        ...(input.title ? { title: input.title.trim().slice(0, 80) } : {}),
      },
    });
    revalidatePath("/dashboard/cards");
    return { ok: true, id };
  } catch {
    return { ok: false, error: "Couldn't update the card. Please try again." };
  }
}

/** Delete a saved card the user owns. */
export async function deleteCard(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;
  const userId = (user as { id: string }).id;
  try {
    await prisma.card.deleteMany({ where: { id, userId } });
    revalidatePath("/dashboard/cards");
  } catch {
    /* best-effort */
  }
}
