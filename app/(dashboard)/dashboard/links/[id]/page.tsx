import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon, SettingsIcon } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/app-url";
import {
  Breakdown,
  DailyBars,
  StatTile,
} from "@/modules/links/components/scan-charts";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Link analytics" };

const DAY = 86_400_000;

export default async function LinkAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const link = await prisma.dynamicLink.findFirst({
    where: { id, userId: user.id },
  });
  if (!link) notFound();

  const now = new Date().getTime();
  const since30 = new Date(now - 29 * DAY);
  const since7 = new Date(now - 6 * DAY);

  const [recent, last7, devicesG, referrersG] = await Promise.all([
    prisma.scanLog.findMany({
      where: { linkId: link.id, createdAt: { gte: since30 } },
      select: { createdAt: true },
    }),
    prisma.scanLog.count({
      where: { linkId: link.id, createdAt: { gte: since7 } },
    }),
    prisma.scanLog.groupBy({
      by: ["device"],
      where: { linkId: link.id },
      _count: { _all: true },
    }),
    prisma.scanLog.groupBy({
      by: ["referrer"],
      where: { linkId: link.id },
      _count: { _all: true },
    }),
  ]);

  const perDay = new Map<string, number>();
  for (const s of recent) {
    const key = s.createdAt.toISOString().slice(0, 10);
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }
  const days: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const key = new Date(now - i * DAY).toISOString().slice(0, 10);
    days.push({ date: key.slice(5), count: perDay.get(key) ?? 0 });
  }

  const deviceRows = devicesG
    .map((d) => ({ label: d.device ?? "Unknown", value: d._count._all }))
    .sort((a, b) => b.value - a.value);
  const referrerRows = referrersG
    .map((r) => ({ label: r.referrer ?? "Direct", value: r._count._all }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const url = `${getAppUrl()}/r/${link.shortCode}`;
  const expired = link.expiresAt ? link.expiresAt.getTime() < now : false;
  const status = !link.active ? "Off" : expired ? "Expired" : "Active";

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href="/dashboard/links"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Dynamic links
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {link.name || link.shortCode}
            </h1>
            <Badge variant={status === "Active" ? "secondary" : "outline"}>
              {status}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <code className="text-xs">{url}</code>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              test scan <ExternalLinkIcon className="size-3" />
            </a>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            → {link.targetUrl}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton value={url} label="Copy link" />
          <Button variant="outline" render={<Link href="/dashboard/links" />}>
            <SettingsIcon />
            Manage
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Total scans" value={link.scanCount} />
        <StatTile label="Last 7 days" value={last7} />
        <StatTile label="Active days (30d)" value={perDay.size} />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Scans — last 30 days</CardTitle>
        </CardHeader>
        <CardContent>
          {link.scanCount === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No scans yet. Share your QR or open the test link to see data here.
            </p>
          ) : (
            <DailyBars data={days} />
          )}
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Breakdown title="Devices" rows={deviceRows} empty="No scans yet." />
        <Breakdown title="Top referrers" rows={referrerRows} empty="No scans yet." />
      </div>
    </div>
  );
}
