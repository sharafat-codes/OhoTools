"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/dal";
import { isPro, FREE_SAVE_LIMIT } from "@/lib/plans";
import { barcodeInputSchema, type BarcodeInput } from "@/modules/barcode/validations";

export async function saveBarcode(input: BarcodeInput) {
  const user = await requireUser();

  const parsed = barcodeInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check your inputs and try again." };
  }

  const plan = (user as { plan?: string }).plan ?? "FREE";
  if (!isPro(plan)) {
    const count = await prisma.barcode.count({ where: { userId: user.id } });
    if (count >= FREE_SAVE_LIMIT) {
      return {
        error: `Free plan is limited to ${FREE_SAVE_LIMIT} saved barcodes. Upgrade to Pro for unlimited saves.`,
      };
    }
  }

  const { name, ...rest } = parsed.data;
  await prisma.barcode.create({
    data: { ...rest, name: name?.trim() || null, userId: user.id },
  });

  revalidatePath("/dashboard/history");
  return { success: true };
}

export async function deleteBarcode(id: string) {
  const user = await requireUser();
  try {
    await prisma.barcode.deleteMany({ where: { id, userId: user.id } });
    revalidatePath("/dashboard/history");
    return { success: true };
  } catch {
    return { error: "Could not delete this item." };
  }
}
