import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  BarChart3Icon,
  PlusIcon,
  QrCodeIcon,
  ScanBarcodeIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPro, FREE_SAVE_LIMIT } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] || "there";
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");

  const [qrCount, barcodeCount, linkCount, scanAgg, recentLinks] =
    await Promise.all([
      prisma.qRCode.count({ where: { userId: user.id } }),
      prisma.barcode.count({ where: { userId: user.id } }),
      prisma.dynamicLink.count({ where: { userId: user.id } }),
      prisma.dynamicLink.aggregate({
        where: { userId: user.id },
        _sum: { scanCount: true },
      }),
      prisma.dynamicLink.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);

  const totalScans = scanAgg._sum.scanCount ?? 0;

  const stats = [
    { label: "QR codes", value: qrCount, icon: QrCodeIcon, href: "/dashboard/qr" },
    { label: "Barcodes", value: barcodeCount, icon: ScanBarcodeIcon, href: "/dashboard/barcodes" },
    { label: "Dynamic links", value: linkCount, icon: ZapIcon, href: "/dashboard/links" },
    { label: "Total scans", value: totalScans, icon: BarChart3Icon, href: "/dashboard/links" },
  ];

  const quickActions: { icon: LucideIcon; title: string; desc: string; href: string }[] = [
    { icon: QrCodeIcon, title: "New QR code", desc: "Static or dynamic, with branding", href: "/dashboard/qr" },
    { icon: ScanBarcodeIcon, title: "New barcode", desc: "Every major format", href: "/dashboard/barcodes" },
    { icon: ZapIcon, title: "New dynamic link", desc: "Editable + scan analytics", href: "/dashboard/qr" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening with your account.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="transition-colors hover:border-foreground/20">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2 font-heading text-3xl font-semibold tabular-nums">
                    {s.value.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.title}
                    href={a.href}
                    className="group flex flex-col gap-2 rounded-lg border border-border p-3 transition-colors hover:border-foreground/20 hover:bg-muted/40"
                  >
                    <div className="grid size-9 place-items-center rounded-lg bg-muted text-foreground">
                      <Icon className="size-4.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        {a.title}
                        <PlusIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Plan / usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Plan
              <Badge variant="secondary">{pro ? "PRO" : "FREE"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {pro ? (
              <p className="text-sm text-muted-foreground">
                Unlimited saves, branding, analytics, and API access. Thanks for
                being Pro! 🎉
              </p>
            ) : (
              <>
                <UsageBar label="QR codes" used={qrCount} limit={FREE_SAVE_LIMIT} />
                <UsageBar label="Barcodes" used={barcodeCount} limit={FREE_SAVE_LIMIT} />
                <Button size="sm" className="mt-1" render={<Link href="/dashboard/billing" />}>
                  Upgrade to Pro
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent dynamic links */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent dynamic links
            {linkCount > 0 && (
              <Link href="/dashboard/links" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLinks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No dynamic links yet — create one to track scans.
              </p>
              <Button variant="outline" size="sm" render={<Link href="/dashboard/qr" />}>
                Create dynamic QR
                <ArrowRightIcon />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {recentLinks.map((l) => (
                <Link
                  key={l.id}
                  href={`/dashboard/links/${l.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{l.name || l.shortCode}</div>
                    <div className="truncate text-xs text-muted-foreground">→ {l.targetUrl}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-sm">
                    <BarChart3Icon className="size-3.5 text-muted-foreground" />
                    <span className="tabular-nums">{l.scanCount}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = Math.min(100, (used / limit) * 100);
  const atLimit = used >= limit;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("tabular-nums", atLimit && "font-medium text-destructive")}>
          {used} / {limit}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", atLimit ? "bg-destructive" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
