import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { HistoryList } from "@/modules/history/components/history-list";
import type { HistoryItem } from "@/modules/history/types";
import type { QRErrorLevel, QRModuleStyle } from "@/modules/qr/validations";

export const metadata: Metadata = { title: "History" };

export default async function HistoryPage() {
  const user = await requireUser();

  const [qrs, barcodes] = await Promise.all([
    prisma.qRCode.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.barcode.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const items: HistoryItem[] = [
    ...qrs.map((q) => ({
      kind: "qr" as const,
      id: q.id,
      name: q.name,
      data: q.data,
      fgColor: q.fgColor,
      bgColor: q.bgColor,
      size: q.size,
      margin: q.margin,
      ecLevel: q.ecLevel as QRErrorLevel,
      moduleStyle: q.moduleStyle as QRModuleStyle,
      gradient: q.gradient,
      fgColor2: q.fgColor2,
      logo: q.logo,
      createdAt: q.createdAt.toISOString(),
    })),
    ...barcodes.map((b) => ({
      kind: "barcode" as const,
      id: b.id,
      name: b.name,
      data: b.data,
      format: b.format,
      scale: b.scale,
      height: b.height,
      includeText: b.includeText,
      createdAt: b.createdAt.toISOString(),
    })),
  ].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          History
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you&apos;ve saved. Search, download, or remove items.
        </p>
      </div>
      <HistoryList items={items} />
    </div>
  );
}
