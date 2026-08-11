import "server-only";

import { getCurrentUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

/**
 * The current user's favorite tool slugs — read during server render so the UI
 * can paint the correct star state immediately (no flash). Empty when signed
 * out (anonymous favorites live in localStorage on the client).
 */
export async function getUserFavorites(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  try {
    const rows = await prisma.favoriteTool.findMany({
      where: { userId: (user as { id: string }).id },
      select: { slug: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
