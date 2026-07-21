import "server-only";

import { prisma } from "@/lib/prisma";
import { hashApiKey } from "@/lib/api-key";
import { isPro } from "@/lib/plans";

export type ApiAuthResult =
  | { ok: true; userId: string; plan: string; keyId: string }
  | { ok: false; status: number; error: string };

/**
 * Authenticate a request via `Authorization: Bearer <key>`. Looks the key up by
 * its hash, enforces the Pro plan, and records usage.
 */
export async function authenticateApiKey(
  req: Request,
): Promise<ApiAuthResult> {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: "Missing API key. Send 'Authorization: Bearer <key>'.",
    };
  }

  const key = await prisma.apiKey.findUnique({
    where: { hashedKey: hashApiKey(token) },
    include: { user: true },
  });
  if (!key) {
    return { ok: false, status: 401, error: "Invalid API key." };
  }
  if (!isPro(key.user.plan)) {
    return { ok: false, status: 403, error: "API access requires a Pro plan." };
  }

  await prisma.apiKey.update({
    where: { id: key.id },
    data: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
  });

  return { ok: true, userId: key.userId, plan: key.user.plan, keyId: key.id };
}
