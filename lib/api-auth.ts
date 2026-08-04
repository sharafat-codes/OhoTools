import "server-only";

import { prisma } from "@/lib/prisma";
import { hashApiKey } from "@/lib/api-key";
import { isPro } from "@/lib/plans";

export type ApiAuthResult =
  | { ok: true; userId: string; plan: string; keyId: string }
  | { ok: false; status: number; error: string };

// Monthly call allowance per plan. FREE never reaches here (Pro is required).
const PLAN_LIMITS: Record<string, number> = { PRO: 1000, BUSINESS: 20000 };

function currentPeriod(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

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

  // Enforce the monthly per-user limit. Wrapped in try/catch so the API keeps
  // working (fails open) if the api_usage table hasn't been migrated yet.
  const limit = PLAN_LIMITS[key.user.plan] ?? PLAN_LIMITS.PRO;
  const period = currentPeriod();
  try {
    const usage = await prisma.apiUsage.findUnique({
      where: { userId_period: { userId: key.userId, period } },
    });
    if (usage && usage.count >= limit) {
      return {
        ok: false,
        status: 429,
        error: `Monthly API limit reached (${limit} calls). It resets on the 1st of next month, or upgrade for a higher limit.`,
      };
    }
    await prisma.apiUsage.upsert({
      where: { userId_period: { userId: key.userId, period } },
      create: { userId: key.userId, period, count: 1 },
      update: { count: { increment: 1 } },
    });
  } catch {
    /* api_usage not migrated yet — allow the call */
  }

  await prisma.apiKey.update({
    where: { id: key.id },
    data: { usageCount: { increment: 1 }, lastUsedAt: new Date() },
  });

  return { ok: true, userId: key.userId, plan: key.user.plan, keyId: key.id };
}
