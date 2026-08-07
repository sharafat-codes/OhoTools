"use server";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

/** Toggle the current user's engagement-email opt-in. */
export async function setMarketingEmails(enabled: boolean) {
  const user = await requireUser();
  await prisma.user.update({
    where: { id: (user as { id: string }).id },
    data: { marketingEmails: enabled },
  });
  return { ok: true };
}
