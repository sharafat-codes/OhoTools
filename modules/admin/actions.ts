"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function setUserPlan(userId: string, plan: "FREE" | "PRO") {
  await requireAdmin();
  // Dropping to Free clears any pass date too, or the expiry cron would find a
  // Free user with a future proUntil and the two would disagree about why.
  await prisma.user.update({
    where: { id: userId },
    data: { plan, ...(plan === "FREE" ? { proUntil: null } : {}) },
  });
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

/** Result shape for the actions the admin UI reports on. */
export type AdminResult = { ok: boolean; error?: string };

const DAY_MS = 24 * 60 * 60 * 1000;
const LIVE_SUB = ["active", "trialing", "past_due"];

/**
 * Grants or extends a one-time Pro pass.
 *
 * Extends an unexpired pass rather than replacing it, matching the paid grants
 * in lib/safepay.ts and lib/paddle.ts — a manual top-up must never take time
 * away from someone who already paid.
 */
export async function grantProPass(userId: string, days: number): Promise<AdminResult> {
  await requireAdmin();
  if (!Number.isFinite(days) || days <= 0 || days > 3650) {
    return { ok: false, error: "That is not a sensible number of days." };
  }
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { proUntil: true } });
  if (!user) return { ok: false, error: "That user no longer exists." };

  const now = new Date();
  const base = user.proUntil && user.proUntil > now ? user.proUntil : now;
  const proUntil = new Date(base.getTime() + days * DAY_MS);

  await prisma.user.update({ where: { id: userId }, data: { plan: "PRO", proUntil } });
  revalidatePath("/admin/users");
  return { ok: true };
}

/**
 * Ends a one-time pass. A live subscription keeps its Pro plan — only the pass
 * is being revoked, and the subscription webhook remains the authority there.
 */
export async function endProPass(userId: string): Promise<AdminResult> {
  await requireAdmin();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscription: { select: { status: true } } },
  });
  if (!user) return { ok: false, error: "That user no longer exists." };

  const subscribed = !!user.subscription && LIVE_SUB.includes(user.subscription.status);
  await prisma.user.update({
    where: { id: userId },
    data: { proUntil: null, ...(subscribed ? {} : { plan: "FREE" as const }) },
  });
  revalidatePath("/admin/users");
  return { ok: true, error: subscribed ? "Pass cleared. Their subscription still grants Pro." : undefined };
}

/**
 * Deletes an account and everything hanging off it — cards, codes, links, keys
 * and payment records all cascade. There is no undo, so the UI confirms first.
 */
export async function deleteUser(userId: string): Promise<AdminResult> {
  const admin = await requireAdmin();
  if (admin.id === userId) return { ok: false, error: "You cannot delete your own account here." };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return { ok: false, error: "That user no longer exists." };

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setToolRequestStatus(id: string, status: "new" | "done" | "dismissed") {
  await requireAdmin();
  await prisma.toolRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/requests");
}

export async function deleteToolRequest(id: string) {
  await requireAdmin();
  await prisma.toolRequest.delete({ where: { id } });
  revalidatePath("/admin/requests");
}
