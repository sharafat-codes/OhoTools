"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { generateApiKey } from "@/lib/api-key";

const MAX_KEYS = 10;

export async function createApiKey(name: string) {
  const user = await requireUser();
  const plan = (user as { plan?: string }).plan ?? "FREE";
  if (!isPro(plan)) {
    return { error: "API keys require a Pro plan." };
  }

  const clean = name.trim().slice(0, 60) || "Default";

  const count = await prisma.apiKey.count({ where: { userId: user.id } });
  if (count >= MAX_KEYS) {
    return { error: `You can have at most ${MAX_KEYS} API keys.` };
  }

  const { raw, hashedKey, prefix, last4 } = generateApiKey();
  await prisma.apiKey.create({
    data: { name: clean, hashedKey, prefix, last4, userId: user.id },
  });

  revalidatePath("/dashboard/api-keys");
  // The raw key is returned exactly once and never stored.
  return { success: true, key: raw };
}

export async function revokeApiKey(id: string) {
  const user = await requireUser();
  await prisma.apiKey.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard/api-keys");
  return { success: true };
}
