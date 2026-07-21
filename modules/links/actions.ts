"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { getAppUrl } from "@/lib/app-url";
import { newShortCode } from "@/modules/links/short";
import {
  createLinkSchema,
  updateLinkSchema,
  type CreateLinkInput,
  type UpdateLinkInput,
} from "@/modules/links/validations";

function isUniqueViolation(e: unknown) {
  return (e as { code?: string })?.code === "P2002";
}

export async function createDynamicLink(input: CreateLinkInput) {
  const user = await requireUser();
  const plan = (user as { plan?: string }).plan ?? "FREE";
  if (!isPro(plan)) {
    return { error: "Dynamic QR codes are a Pro feature." };
  }

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { name, ...rest } = parsed.data;

  // Retry a few times in the (very unlikely) event of a short-code collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const link = await prisma.dynamicLink.create({
        data: {
          ...rest,
          name: name?.trim() || null,
          shortCode: newShortCode(),
          userId: user.id,
        },
      });
      revalidatePath("/dashboard/links");
      return {
        success: true,
        id: link.id,
        shortCode: link.shortCode,
        url: `${getAppUrl()}/r/${link.shortCode}`,
      };
    } catch (e) {
      if (isUniqueViolation(e) && attempt < 4) continue;
      return { error: "Could not create the link. Try again." };
    }
  }
  return { error: "Could not create the link. Try again." };
}

export async function updateDynamicLink(input: UpdateLinkInput) {
  const user = await requireUser();

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { id, name, targetUrl, active, expiresAt } = parsed.data;
  const res = await prisma.dynamicLink.updateMany({
    where: { id, userId: user.id },
    data: {
      name: name?.trim() || null,
      targetUrl,
      active,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  if (res.count === 0) return { error: "Link not found." };
  revalidatePath("/dashboard/links");
  revalidatePath(`/dashboard/links/${id}`);
  return { success: true };
}

export async function setLinkActive(id: string, active: boolean) {
  const user = await requireUser();
  await prisma.dynamicLink.updateMany({
    where: { id, userId: user.id },
    data: { active },
  });
  revalidatePath("/dashboard/links");
  return { success: true };
}

export async function deleteDynamicLink(id: string) {
  const user = await requireUser();
  await prisma.dynamicLink.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard/links");
  return { success: true };
}
