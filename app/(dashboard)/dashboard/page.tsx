import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3Icon,
  QrCodeIcon,
  ScanBarcodeIcon,
  ZapIcon,
  SparklesIcon,
  WandSparklesIcon,
  GemIcon,
  BookmarkIcon,
  ChevronRightIcon,
  type LucideIcon,
} from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { devTools, getTool, toolCategories, categorySlugForName } from "@/modules/tools/registry";
import { categoryIcon } from "@/modules/tools/category-icons";
import { RecentTools } from "@/modules/tools/components/recent-tools";
import { isPro, FREE_SAVE_LIMIT } from "@/lib/plans";
import { getAiUsageToday, FREE_DAILY_AI_LIMIT } from "@/lib/ai-usage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

// A cross-category set of high-use tools to surface on the dashboard.
const POPULAR = [
  "word-to-pdf",
  "ai-summarizer",
  "merge-pdf",
  "compress-image",
  "image-to-text",
  "ai-humanizer",
  "qr-code",
  "invoice-generator",
  "json-formatter",
];

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] || "there";
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");

  const [qrCount, barcodeCount, linkCount, scanAgg, recentLinks, aiUsedToday] = await Promise.all([
    prisma.qRCode.count({ where: { userId: user.id } }),
    prisma.barcode.count({ where: { userId: user.id } }),
    prisma.dynamicLink.count({ where: { userId: user.id } }),
    prisma.dynamicLink.aggregate({ where: { userId: user.id }, _sum: { scanCount: true } }),
    prisma.dynamicLink.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 4 }),
    getAiUsageToday(user.id).catch(() => 0),
  ]);

  const totalScans = scanAgg._sum.scanCount ?? 0;
  const aiRemaining = Math.max(0, FREE_DAILY_AI_LIMIT - aiUsedToday);
  const popularTools = POPULAR.map((s) => getTool(s)).filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {devTools.length}+ tools at your fingertips. Here&apos;s your account at a glance.
        </p>
      </div>

      {/* Plan · AI usage · Saved */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GemIcon className="size-4 text-primary" /> Plan
              </span>
              <Badge
                variant="secondary"
                className={cn(pro && "border-primary/30 bg-primary/10 text-primary")}
              >
                {pro ? "PRO" : "FREE"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pro ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Unlimited AI, advanced conversions, analytics, and API access. Thanks for being Pro! 🎉
                </p>
                <Button variant="outline" size="sm" className="w-fit" render={<Link href="/dashboard/billing" />}>
                  Manage subscription
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Go Pro for unlimited AI, advanced conversions, and more.
                </p>
                <Button size="sm" className="w-fit" render={<Link href="/dashboard/billing" />}>
                  <SparklesIcon className="size-4" />
                  Upgrade to Pro
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* AI usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <WandSparklesIcon className="size-4 text-primary" /> AI usage
              </span>
              <Link href="/tools/ai" className="text-xs font-medium text-primary hover:underline">
                AI tools →
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pro ? (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Unlimited</span> AI runs on Pro — go wild.
              </p>
            ) : (
              <>
                <UsageBar label="AI runs today" used={aiUsedToday} limit={FREE_DAILY_AI_LIMIT} />
                <p className="text-xs text-muted-foreground">
                  {aiRemaining > 0
                    ? `${aiRemaining} free run${aiRemaining === 1 ? "" : "s"} left today.`
                    : "Daily free limit reached — resets tomorrow."}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Saved items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              <BookmarkIcon className="size-4 text-primary" /> Saved items
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <SavedRow icon={QrCodeIcon} label="QR codes" value={qrCount} href="/dashboard/qr" limit={pro ? undefined : FREE_SAVE_LIMIT} />
            <SavedRow icon={ScanBarcodeIcon} label="Barcodes" value={barcodeCount} href="/dashboard/barcodes" limit={pro ? undefined : FREE_SAVE_LIMIT} />
            <SavedRow icon={ZapIcon} label="Dynamic links" value={linkCount} href="/dashboard/links" />
            <SavedRow icon={BarChart3Icon} label="Total scans" value={totalScans} href="/dashboard/links" />
          </CardContent>
        </Card>
      </div>

      {/* Recently used (client-side, this browser) */}
      <RecentTools />

      {/* Jump back in — popular tools */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Jump back in
            <Link href="/tools" className="text-xs font-medium text-primary hover:underline">
              Browse all {devTools.length} tools →
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate text-sm font-medium">
                      {t.name}
                      {t.pro && <Badge variant="secondary" className="border-primary/30 bg-primary/10 text-primary px-1.5 py-0 text-[10px]">Pro</Badge>}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{t.tagline}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Browse by category */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Browse by category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {toolCategories.map((cat) => {
              const slug = categorySlugForName(cat.name);
              const CIcon = categoryIcon(cat.name);
              return (
                <Link
                  key={cat.name}
                  href={slug ? `/tools/${slug}` : "/tools"}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <CIcon className="size-3.5 shrink-0 text-primary" />
                  {cat.name}
                  <span className="text-xs text-muted-foreground">{cat.slugs.length}</span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent dynamic links */}
      {linkCount > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent dynamic links
              <Link href="/dashboard/links" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                    <BarChart3Icon className="size-3.5 text-primary" />
                    <span className="tabular-nums">{l.scanCount}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SavedRow({
  icon: Icon,
  label,
  value,
  href,
  limit,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  href: string;
  limit?: number;
}) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-2 hover:opacity-80">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 text-primary" />
        {label}
      </span>
      <span className="flex items-center gap-1">
        <span className="tabular-nums font-medium">
          {value.toLocaleString()}
          {limit !== undefined && <span className="text-xs font-normal text-muted-foreground"> / {limit}</span>}
        </span>
        <ChevronRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number }) {
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
