"use server";

import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getUserFavorites } from "@/lib/favorites";

/** Slugs the current user has favorited (newest first). Empty if signed out. */
export async function getFavorites(): Promise<string[]> {
  return getUserFavorites();
}

/** Toggle a favorite for the current user. Returns the new state. */
export async function toggleFavorite(slug: string): Promise<{ favorited: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { favorited: false };
  const userId = (user as { id: string }).id;
  const clean = slug.trim().slice(0, 100);
  if (!clean) return { favorited: false };
  try {
    const existing = await prisma.favoriteTool.findUnique({
      where: { userId_slug: { userId, slug: clean } },
    });
    if (existing) {
      await prisma.favoriteTool.delete({ where: { id: existing.id } });
      return { favorited: false };
    }
    await prisma.favoriteTool.create({ data: { userId, slug: clean } });
    return { favorited: true };
  } catch {
    return { favorited: false };
  }
}

/** Merge localStorage favorites into the account on sign-in (idempotent). */
export async function mergeFavorites(slugs: string[]): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !Array.isArray(slugs) || slugs.length === 0) return;
  const userId = (user as { id: string }).id;
  const data = slugs
    .filter((s) => typeof s === "string" && s.trim())
    .slice(0, 200)
    .map((slug) => ({ userId, slug: slug.trim().slice(0, 100) }));
  if (!data.length) return;
  try {
    await prisma.favoriteTool.createMany({ data, skipDuplicates: true });
  } catch {
    /* best-effort */
  }
}
