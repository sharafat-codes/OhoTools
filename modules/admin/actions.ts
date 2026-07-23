"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function setUserPlan(userId: string, plan: "FREE" | "PRO") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { plan } });
  revalidatePath("/admin/users");
}

export async function setUserRole(userId: string, role: "USER" | "ADMIN") {
  const admin = await requireAdmin();
  // Guard: don't let an admin strip their own admin access and lock themselves out.
  if (admin.id === userId && role !== "ADMIN") {
    return;
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}
