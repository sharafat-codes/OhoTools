import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/plans";
import { getAppUrl } from "@/lib/app-url";
import {
  ApiKeysView,
  type KeyRow,
} from "@/modules/api-keys/components/api-keys-view";

export const metadata: Metadata = { title: "API Keys" };

export default async function ApiKeysPage() {
  const user = await requireUser();
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      prefix: true,
      last4: true,
      usageCount: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  const rows: KeyRow[] = keys.map((k) => ({
    id: k.id,
    name: k.name,
    prefix: k.prefix,
    last4: k.last4,
    usageCount: k.usageCount,
    lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
    createdAt: k.createdAt.toISOString(),
  }));

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          API keys
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate QR codes programmatically from your own apps.
        </p>
      </div>

      <ApiKeysView keys={rows} isPro={pro} appUrl={getAppUrl()} />
    </div>
  );
}
