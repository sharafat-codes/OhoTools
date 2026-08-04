import type { Metadata } from "next";
import Link from "next/link";
import {
  UsersIcon,
  SparklesIcon,
  UserPlusIcon,
  QrCodeIcon,
  ScanBarcodeIcon,
  ZapIcon,
  BarChart3Icon,
  KeyIcon,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin — Overview" };

export default async function AdminOverviewPage() {
  const nowMs = new Date().getTime();
  const d7 = new Date(nowMs - 7 * 86400000);
  const d30 = new Date(nowMs - 30 * 86400000);

  const [
    totalUsers,
    proUsers,
    new7,
    new30,
    qrCodes,
    barcodes,
    dynamicLinks,
    scanAgg,
    apiKeys,
    apiCallsAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: "PRO" } }),
    prisma.user.count({ where: { createdAt: { gte: d7 } } }),
    prisma.user.count({ where: { createdAt: { gte: d30 } } }),
    prisma.qRCode.count(),
    prisma.barcode.count(),
    prisma.dynamicLink.count(),
    prisma.dynamicLink.aggregate({ _sum: { scanCount: true } }),
    prisma.apiKey.count(),
    prisma.apiKey.aggregate({ _sum: { usageCount: true } }),
  ]);

  const totalScans = scanAgg._sum.scanCount ?? 0;
  const apiCalls = apiCallsAgg._sum.usageCount ?? 0;
  const conversion = totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0";

  // Tool-usage analytics (fails open if the tool_view / ai_usage tables aren't
  // migrated yet — the rest of the dashboard still renders).
  const d7s = new Date(nowMs - 7 * 86400000).toISOString().slice(0, 10);
  const d30s = new Date(nowMs - 30 * 86400000).toISOString().slice(0, 10);
  let views7 = 0;
  let views30 = 0;
  let aiRuns30 = 0;
  let topTools: { slug: string; count: number }[] = [];
  try {
    const [v7, v30, top, ai30] = await Promise.all([
      prisma.toolView.aggregate({ _sum: { count: true }, where: { day: { gte: d7s } } }),
      prisma.toolView.aggregate({ _sum: { count: true }, where: { day: { gte: d30s } } }),
      prisma.toolView.groupBy({
        by: ["slug"],
        _sum: { count: true },
        where: { day: { gte: d30s } },
        orderBy: { _sum: { count: "desc" } },
        take: 12,
      }),
      prisma.aiUsage.aggregate({ _sum: { count: true }, where: { day: { gte: d30s } } }),
    ]);
    views7 = v7._sum.count ?? 0;
    views30 = v30._sum.count ?? 0;
    topTools = top.map((t) => ({ slug: t.slug, count: t._sum.count ?? 0 }));
    aiRuns30 = ai30._sum.count ?? 0;
  } catch {
    /* analytics tables not migrated yet */
  }

  const stats = [
    { label: "Total users", value: totalUsers, icon: UsersIcon },
    { label: "Pro users", value: proUsers, icon: SparklesIcon, hint: `${conversion}% of users` },
    { label: "New (7 days)", value: new7, icon: UserPlusIcon },
    { label: "New (30 days)", value: new30, icon: UserPlusIcon },
    { label: "QR codes", value: qrCodes, icon: QrCodeIcon },
    { label: "Barcodes", value: barcodes, icon: ScanBarcodeIcon },
    { label: "Dynamic links", value: dynamicLinks, icon: ZapIcon },
    { label: "Total scans", value: totalScans, icon: BarChart3Icon },
    { label: "API keys", value: apiKeys, icon: KeyIcon },
    { label: "Tool views (7d)", value: views7, icon: BarChart3Icon },
    { label: "Tool views (30d)", value: views30, icon: BarChart3Icon },
    { label: "AI runs (30d)", value: aiRuns30, icon: SparklesIcon },
    { label: "API calls (total)", value: apiCalls, icon: ZapIcon },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your OhoTool business at a glance.</p>
        </div>
        <Link href="/admin/users" className="text-sm font-medium text-primary hover:underline">
          Manage users →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-2 font-heading text-3xl font-semibold tabular-nums">
                  {s.value.toLocaleString()}
                </div>
                {s.hint && <div className="mt-0.5 text-xs text-muted-foreground">{s.hint}</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {topTools.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-heading text-lg font-semibold tracking-tight">Top tools (30 days)</h2>
          <Card>
            <CardContent className="py-1">
              <ol className="divide-y divide-border">
                {topTools.map((t, i) => (
                  <li key={t.slug} className="flex items-center justify-between py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-right tabular-nums text-muted-foreground">{i + 1}</span>
                      <Link href={`/tools/${t.slug}`} className="hover:underline">
                        /tools/{t.slug}
                      </Link>
                    </span>
                    <span className="font-medium tabular-nums">{t.count.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Tool views are counted anonymously on this site (no personal data). Billing, refunds, and revenue live in your
        Stripe dashboard; raw data is in Supabase.
      </p>
    </div>
  );
}
