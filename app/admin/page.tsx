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
  CreditCardIcon,
  InboxIcon,
  type LucideIcon,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { getTool, getToolCategory } from "@/modules/tools/registry";
import { Card, CardContent } from "@/components/ui/card";
import { MiniBarChart } from "@/modules/admin/components/mini-bar-chart";

export const metadata: Metadata = { title: "Admin — Overview" };

function Stat({
  label,
  value,
  hint,
  icon: Icon,
  big,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: LucideIcon;
  big?: boolean;
}) {
  return (
    <Card>
      <CardContent className={big ? "py-5" : "py-3.5"}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className={cn("mt-2 font-heading font-semibold tabular-nums", big ? "text-4xl" : "text-2xl")}>
          {value.toLocaleString()}
        </div>
        {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>;
}

export default async function AdminOverviewPage() {
  const nowMs = new Date().getTime();
  const d7 = new Date(nowMs - 7 * 86400000);
  const d14 = new Date(nowMs - 14 * 86400000);
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
    activeSubs,
    recentUsers,
    signupRows,
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
    prisma.subscription.count({ where: { status: { in: ["active", "trialing"] } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, email: true, plan: true, createdAt: true },
    }),
    prisma.user.findMany({ where: { createdAt: { gte: d14 } }, select: { createdAt: true }, take: 5000 }),
  ]);

  const totalScans = scanAgg._sum.scanCount ?? 0;
  const apiCalls = apiCallsAgg._sum.usageCount ?? 0;
  const conversion = totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : "0";
  const mrr = activeSubs * 9;

  // Tool-usage analytics (fails open if the tool_view / ai_usage tables aren't
  // migrated yet — the rest of the dashboard still renders).
  const d7s = new Date(nowMs - 7 * 86400000).toISOString().slice(0, 10);
  const d14s = new Date(nowMs - 13 * 86400000).toISOString().slice(0, 10);
  const d30s = new Date(nowMs - 30 * 86400000).toISOString().slice(0, 10);
  let views7 = 0;
  let views30 = 0;
  let allTimeViews = 0;
  let aiRuns30 = 0;
  let topTools: { slug: string; name: string; count: number }[] = [];
  let categoryViews: { name: string; count: number }[] = [];
  const viewsByDay = new Map<string, number>();
  try {
    const [v7, v30, all, slugRows, ai30, byDay] = await Promise.all([
      prisma.toolView.aggregate({ _sum: { count: true }, where: { day: { gte: d7s } } }),
      prisma.toolView.aggregate({ _sum: { count: true }, where: { day: { gte: d30s } } }),
      prisma.toolView.aggregate({ _sum: { count: true } }),
      prisma.toolView.groupBy({
        by: ["slug"],
        _sum: { count: true },
        where: { day: { gte: d30s } },
        orderBy: { _sum: { count: "desc" } },
      }),
      prisma.aiUsage.aggregate({ _sum: { count: true }, where: { day: { gte: d30s } } }),
      prisma.toolView.groupBy({ by: ["day"], _sum: { count: true }, where: { day: { gte: d14s } } }),
    ]);
    views7 = v7._sum.count ?? 0;
    views30 = v30._sum.count ?? 0;
    allTimeViews = all._sum.count ?? 0;
    aiRuns30 = ai30._sum.count ?? 0;
    for (const r of byDay) viewsByDay.set(r.day, r._sum.count ?? 0);

    const rows = slugRows.map((t) => ({ slug: t.slug, count: t._sum.count ?? 0 }));
    topTools = rows.slice(0, 15).map((r) => ({ slug: r.slug, name: getTool(r.slug)?.name ?? r.slug, count: r.count }));
    const catMap = new Map<string, number>();
    for (const r of rows) {
      const cat = getToolCategory(r.slug)?.name ?? "Other";
      catMap.set(cat, (catMap.get(cat) ?? 0) + r.count);
    }
    categoryViews = [...catMap.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  } catch {
    /* analytics tables not migrated yet */
  }
  const maxCat = Math.max(1, ...categoryViews.map((c) => c.count));

  let newRequests = 0;
  try {
    newRequests = await prisma.toolRequest.count({ where: { status: "new" } });
  } catch {
    /* tool_request table not migrated yet */
  }

  // Build 14-day series for the charts.
  const shortLabel = (s: string) => {
    const p = s.split("-");
    return `${+p[1]}/${+p[2]}`;
  };
  const days14: string[] = [];
  for (let i = 13; i >= 0; i--) days14.push(new Date(nowMs - i * 86400000).toISOString().slice(0, 10));
  const signupByDay = new Map<string, number>();
  for (const u of signupRows) {
    const key = u.createdAt.toISOString().slice(0, 10);
    signupByDay.set(key, (signupByDay.get(key) ?? 0) + 1);
  }
  const signupsSeries = days14.map((d) => ({ label: shortLabel(d), value: signupByDay.get(d) ?? 0 }));
  const viewsSeries = days14.map((d) => ({ label: shortLabel(d), value: viewsByDay.get(d) ?? 0 }));
  const signupsTotal = signupsSeries.reduce((a, b) => a + b.value, 0);
  const viewsTotal = viewsSeries.reduce((a, b) => a + b.value, 0);

  const traffic = [
    { label: "New (7 days)", value: new7, icon: UserPlusIcon },
    { label: "New (30 days)", value: new30, icon: UserPlusIcon },
    { label: "Tool views (7d)", value: views7, icon: BarChart3Icon },
    { label: "Tool views (30d)", value: views30, icon: BarChart3Icon },
  ];
  const contentApi = [
    { label: "AI runs (30d)", value: aiRuns30, icon: SparklesIcon },
    { label: "API calls (total)", value: apiCalls, icon: ZapIcon },
    { label: "API keys", value: apiKeys, icon: KeyIcon },
  ];
  const qr = [
    { label: "QR codes", value: qrCodes, icon: QrCodeIcon },
    { label: "Barcodes", value: barcodes, icon: ScanBarcodeIcon },
    { label: "Dynamic links", value: dynamicLinks, icon: ZapIcon },
    { label: "Total scans", value: totalScans, icon: BarChart3Icon },
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

      {newRequests > 0 && (
        <Link
          href="/admin/requests?status=new"
          className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm transition-colors hover:bg-primary/10"
        >
          <span className="flex items-center gap-2">
            <InboxIcon className="size-4 text-primary" />
            <span className="font-medium">
              {newRequests} new tool request{newRequests === 1 ? "" : "s"}
            </span>
            to review
          </span>
          <span className="font-medium text-primary">Review →</span>
        </Link>
      )}

      {/* Headline KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat big label="Total users" value={totalUsers} icon={UsersIcon} />
        <Stat big label="Pro users" value={proUsers} icon={SparklesIcon} hint={`${conversion}% of users`} />
        <Stat big label="Active subscriptions" value={activeSubs} icon={CreditCardIcon} hint={`~$${mrr}/mo`} />
      </div>

      {/* Trends */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MiniBarChart title="New signups · 14 days" total={signupsTotal} data={signupsSeries} />
        <MiniBarChart title="Tool views · 14 days" total={viewsTotal} data={viewsSeries} />
      </div>

      <SectionLabel>Traffic</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {traffic.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      <SectionLabel>Content &amp; API</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-3">
        {contentApi.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      <SectionLabel>QR &amp; barcodes</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {qr.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      {recentUsers.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-heading text-lg font-semibold tracking-tight">Recent signups</h2>
          <Card>
            <CardContent className="py-1">
              <ul className="divide-y divide-border">
                {recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="font-medium">{u.name || "—"}</span>
                      <span className="truncate text-muted-foreground">{u.email}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      {u.plan === "PRO" && <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">Pro</span>}
                      {u.createdAt.toISOString().slice(0, 10)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {topTools.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 flex items-baseline gap-2 font-heading text-lg font-semibold tracking-tight">
              Top tools
              <span className="text-xs font-normal text-muted-foreground">
                30 days · {allTimeViews.toLocaleString()} all-time
              </span>
            </h2>
            <Card>
              <CardContent className="py-1">
                <ol className="divide-y divide-border">
                  {topTools.map((t, i) => (
                    <li key={t.slug} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span className="w-4 shrink-0 text-right tabular-nums text-muted-foreground">{i + 1}</span>
                        <Link href={`/tools/${t.slug}`} className="min-w-0 truncate font-medium hover:underline">
                          {t.name}
                        </Link>
                      </span>
                      <span className="shrink-0 font-medium tabular-nums">{t.count.toLocaleString()}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-3 flex items-baseline gap-2 font-heading text-lg font-semibold tracking-tight">
              Views by category
              <span className="text-xs font-normal text-muted-foreground">30 days</span>
            </h2>
            <Card>
              <CardContent className="flex flex-col gap-2.5 py-4">
                {categoryViews.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 text-sm">
                    <span className="w-28 shrink-0 truncate text-muted-foreground">{c.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/80" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                    </div>
                    <span className="w-8 shrink-0 text-right tabular-nums text-muted-foreground">{c.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Tool views are counted anonymously on this site (no personal data). Billing, refunds, and revenue live in your
        Stripe dashboard; raw data is in Supabase.
      </p>
    </div>
  );
}
