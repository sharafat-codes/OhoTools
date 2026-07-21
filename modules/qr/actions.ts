"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import { isPro, FREE_SAVE_LIMIT } from "@/lib/plans";
import { qrInputSchema, type QRInput } from "@/modules/qr/validations";

export async function saveQRCode(input: QRInput) {
  const user = await requireUser();

  const parsed = qrInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check your inputs and try again." };
  }

  const plan = (user as { plan?: string }).plan ?? "FREE";
  const proUser = isPro(plan);

  if (!proUser) {
    const count = await prisma.qRCode.count({ where: { userId: user.id } });
    if (count >= FREE_SAVE_LIMIT) {
      return {
        error: `Free plan is limited to ${FREE_SAVE_LIMIT} saved QR codes. Upgrade to Pro for unlimited saves.`,
      };
    }
  }

  const { name, ...rest } = parsed.data;

  // Enforce Pro-only styling server-side regardless of what the client sent.
  const styling = proUser
    ? {
        moduleStyle: rest.moduleStyle,
        gradient: rest.gradient,
        fgColor2: rest.fgColor2 ?? null,
        logo: rest.logo ?? null,
      }
    : {
        moduleStyle: "square",
        gradient: false,
        fgColor2: null,
        logo: null,
      };

  await prisma.qRCode.create({
    data: {
      data: rest.data,
      fgColor: rest.fgColor,
      bgColor: rest.bgColor,
      size: rest.size,
      margin: rest.margin,
      ecLevel: rest.ecLevel,
      ...styling,
      name: name?.trim() || null,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/history");
  return { success: true };
}

export async function deleteQRCode(id: string) {
  const user = await requireUser();
  try {
    // Scope by userId so a user can only delete their own codes.
    await prisma.qRCode.deleteMany({ where: { id, userId: user.id } });
    revalidatePath("/dashboard/history");
    return { success: true };
  } catch {
    return { error: "Could not delete this item." };
  }
}
