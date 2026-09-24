import type { Metadata } from "next";
import Link from "next/link";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UsersTable, type AdminUserView } from "@/modules/admin/components/users-table";

export const metadata: Metadata = { title: "Admin — Users" };

const PER_PAGE = 25;

type Search = { q?: string; page?: string; plan?: string; role?: string };

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q, page: pageParam, plan: planFilter, role: roleFilter } = await searchParams;
  // The layout already gates the area; asserting here too keeps a page that
  // renders destructive controls from ever depending on that alone.
  const me = await requireAdmin();

  const where = {
    ...(q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" as const } },
            { name: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(planFilter === "pro" || planFilter === "free"
      ? { plan: planFilter.toUpperCase() as "PRO" | "FREE" }
      : {}),
    ...(roleFilter === "admin" ? { role: "ADMIN" as const } : {}),
  };

  const total = await prisma.user.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PER_PAGE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), pageCount);

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PER_PAGE,
    take: PER_PAGE,
    select: {
      id: true, name: true, email: true, emailVerified: true,
      plan: true, role: true, createdAt: true, proUntil: true,
      _count: {
        select: {
          cards: true, qrCodes: true, barcodes: true,
          dynamicLinks: true, apiKeys: true, interviewSessions: true,
        },
      },
      // AiUsage is one row per day carrying a count, so the counts are summed
      // rather than the rows counted — otherwise a heavy user looks the same
      // as someone who tried it twice on two different days.
      aiUsage: { select: { count: true } },
      payments: { where: { status: "paid" }, select: { amount: true, currency: true } },
      subscription: { select: { status: true } },
      sessions: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
    },
  });

  const rows: AdminUserView[] = users.map((u) => {
    const aiRuns = u.aiUsage.reduce((n, r) => n + r.count, 0);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      emailVerified: u.emailVerified,
      plan: u.plan as "FREE" | "PRO",
      role: u.role as "USER" | "ADMIN",
      hasPass: !!u.proUntil,
      isSelf: me.id === u.id,
      createdAt: u.createdAt,
      proUntil: u.proUntil,
      subStatus: u.subscription?.status ?? null,
      activity: [
        { n: u._count.cards, label: "cards" },
        { n: u._count.qrCodes + u._count.barcodes, label: "codes" },
        { n: u._count.dynamicLinks, label: "links" },
        { n: aiRuns, label: "AI runs" },
        { n: u._count.interviewSessions, label: "interviews" },
        { n: u._count.apiKeys, label: "API keys" },
      ].filter((a) => a.n > 0),
      paidTotal: u.payments.reduce((n, p) => n + p.amount, 0),
      paidCount: u.payments.length,
      currency: u.payments[0]?.currency ?? "",
      lastSeen: u.sessions[0]?.createdAt ?? null,
    };
  });

  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const to = Math.min(page * PER_PAGE, total);

  /** Builds a link that keeps the current search and filter. */
  const linkTo = (params: Partial<Search>) => {
    const p = new URLSearchParams();
    if (params.q ?? q) p.set("q", (params.q ?? q) as string);
    if (params.plan ?? planFilter) p.set("plan", (params.plan ?? planFilter) as string);
    if (params.role ?? roleFilter) p.set("role", (params.role ?? roleFilter) as string);
    if (params.page && params.page !== "1") p.set("page", params.page);
    const s = p.toString();
    return `/admin/users${s ? `?${s}` : ""}`;
  };

  // Changing the filter returns to page one — page 4 of "all" is rarely page 4
  // of "Pro", and landing on an empty page looks like a bug.
  const filterLink = (params: Partial<Search>) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (params.plan) p.set("plan", params.plan);
    if (params.role) p.set("role", params.role);
    const s = p.toString();
    return `/admin/users${s ? `?${s}` : ""}`;
  };

  const filters = [
    { label: "All", params: {} as Partial<Search> },
    { label: "Pro", params: { plan: "pro" } },
    { label: "Free", params: { plan: "free" } },
    { label: "Admins", params: { role: "admin" } },
  ];
  const active =
    roleFilter === "admin" ? "Admins" : planFilter === "pro" ? "Pro" : planFilter === "free" ? "Free" : "All";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total === 0
            ? "No users match."
            : `Showing ${from}–${to} of ${total}${q ? ` for “${q}”` : ""}, newest first.`}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <form className="flex gap-2" action="/admin/users">
          {planFilter && <input type="hidden" name="plan" value={planFilter} />}
          {roleFilter && <input type="hidden" name="role" value={roleFilter} />}
          <Input name="q" defaultValue={q ?? ""} placeholder="Search by name or email…" className="w-64" />
          <Button type="submit" variant="outline">
            <SearchIcon />
            Search
          </Button>
        </form>

        <div className="flex gap-1.5">
          {filters.map((f) => (
            <Button
              key={f.label}
              size="sm"
              variant={active === f.label ? "default" : "outline"}
              render={<Link href={filterLink(f.params)} />}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <UsersTable rows={rows} />

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Page {page} of {pageCount}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              render={page <= 1 ? <span /> : <Link href={linkTo({ page: String(page - 1) })} />}
            >
              <ChevronLeftIcon />
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= pageCount}
              render={page >= pageCount ? <span /> : <Link href={linkTo({ page: String(page + 1) })} />}
            >
              Next
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
