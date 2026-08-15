"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { normalizeCard, OCCASIONS, type CardData } from "@/modules/cards/types";

export type SaveResult = { ok: true; id: string; shortCode: string } | { ok: false; error: string };

function autoTitle(card: CardData): string {
  const label = OCCASIONS[card.occasion].label;
  return card.to ? `${label} — ${card.to}` : label;
}

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no ambiguous chars
function makeCode(): string {
  let s = "";
  for (let i = 0; i < 7; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return s;
}

/** Create a new saved card for the signed-in user. */
export async function saveCard(input: { title?: string; data: CardData }): Promise<SaveResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in to save cards." };
  const userId = (user as { id: string }).id;
  const card = normalizeCard(input.data);
  const title = (input.title ?? "").toString().trim().slice(0, 80) || autoTitle(card);
  const json = JSON.stringify(card);
  // Retry a few times on the (rare) short-code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const shortCode = makeCode();
    try {
      const row = await prisma.card.create({
        data: { userId, title, occasion: card.occasion, data: json, shortCode },
      });
      revalidatePath("/dashboard/cards");
      return { ok: true, id: row.id, shortCode };
    } catch (e) {
      // Prisma unique-constraint violation → try a new code; otherwise fail.
      if (attempt < 4 && (e as { code?: string })?.code === "P2002") continue;
      return { ok: false, error: "Couldn't save the card. Please try again." };
    }
  }
  return { ok: false, error: "Couldn't save the card. Please try again." };
}

/** Update an existing saved card the user owns. */
export async function updateCard(id: string, input: { title?: string; data: CardData }): Promise<SaveResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in." };
  const userId = (user as { id: string }).id;
  const card = normalizeCard(input.data);
  try {
    const existing = await prisma.card.findFirst({ where: { id, userId }, select: { id: true, shortCode: true } });
    if (!existing) return { ok: false, error: "Card not found." };
    const shortCode = existing.shortCode ?? makeCode();
    await prisma.card.update({
      where: { id },
      data: {
        occasion: card.occasion,
        data: JSON.stringify(card),
        shortCode,
        ...(input.title ? { title: input.title.trim().slice(0, 80) } : {}),
      },
    });
    revalidatePath("/dashboard/cards");
    return { ok: true, id, shortCode };
  } catch {
    return { ok: false, error: "Couldn't update the card. Please try again." };
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WatchResult = { ok: true; shortCode: string; cardId: string } | { ok: false; error: string };

/**
 * Register an email to be notified when a card is opened, and (with consent)
 * add it to the marketing list. Works for anyone: if there is no saved card yet
 * (anonymous), it mints a tracked card so the open can be counted + notified.
 */
export async function watchCardOpens(input: {
  cardId?: string;
  data: CardData;
  email: string;
  marketing?: boolean;
}): Promise<WatchResult> {
  const email = (input.email ?? "").toString().trim().toLowerCase().slice(0, 160);
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." };
  const card = normalizeCard(input.data);

  try {
    let cardId = input.cardId;
    let shortCode: string | undefined;

    if (cardId) {
      const existing = await prisma.card.findUnique({ where: { id: cardId }, select: { id: true, shortCode: true } });
      if (!existing) {
        cardId = undefined;
      } else {
        shortCode = existing.shortCode ?? undefined;
        if (!shortCode) {
          for (let a = 0; a < 5; a++) {
            const code = makeCode();
            try {
              await prisma.card.update({ where: { id: cardId }, data: { shortCode: code } });
              shortCode = code;
              break;
            } catch (e) {
              if (a < 4 && (e as { code?: string })?.code === "P2002") continue;
              throw e;
            }
          }
        }
      }
    }

    if (!cardId) {
      // Anonymous: create a tracked card from the current data.
      for (let a = 0; a < 5; a++) {
        const code = makeCode();
        try {
          const row = await prisma.card.create({
            data: { userId: null, title: autoTitle(card), occasion: card.occasion, data: JSON.stringify(card), shortCode: code },
          });
          cardId = row.id;
          shortCode = code;
          break;
        } catch (e) {
          if (a < 4 && (e as { code?: string })?.code === "P2002") continue;
          throw e;
        }
      }
    }

    if (!cardId || !shortCode) return { ok: false, error: "Couldn't set up notifications. Please try again." };

    // Register the watcher (idempotent per card+email).
    await prisma.cardWatch.upsert({
      where: { cardId_email: { cardId, email } },
      create: { cardId, email },
      update: {},
    });

    // Add to the marketing list only with consent; never downgrade an existing yes.
    await prisma.subscriber.upsert({
      where: { email },
      create: { email, source: "card-notify", consentMarketing: Boolean(input.marketing) },
      update: input.marketing ? { consentMarketing: true } : {},
    });

    return { ok: true, shortCode, cardId };
  } catch {
    return { ok: false, error: "Couldn't set up notifications. Please try again." };
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
