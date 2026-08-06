import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { setToolRequestStatus, deleteToolRequest } from "@/modules/admin/actions";

export const metadata: Metadata = { title: "Admin — Tool requests" };

const TABS = [
  { key: "new", label: "New" },
  { key: "done", label: "Done" },
  { key: "dismissed", label: "Dismissed" },
  { key: "all", label: "All" },
];

type Req = { id: string; tool: string; details: string | null; email: string | null; status: string; createdAt: Date };

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = TABS.some((t) => t.key === status) ? status! : "new";

  let requests: Req[] = [];
  try {
    requests = await prisma.toolRequest.findMany({
      where: filter === "all" ? {} : { status: filter },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  } catch {
    /* tool_request table not migrated yet */
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Tool requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">What people are asking us to build — your demand-driven roadmap.</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/requests?status=${t.key}`}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-sm transition-colors",
              filter === t.key ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/40",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No {filter === "all" ? "" : filter} requests.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardContent className="flex flex-col gap-2 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading font-medium">{r.tool}</span>
                      {r.status !== "new" && <Badge variant="secondary">{r.status}</Badge>}
                    </div>
                    {r.details && <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{r.details}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{r.createdAt.toISOString().slice(0, 10)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {r.email ? (
                    <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                      {r.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">anonymous</span>
                  )}
                  <span className="flex-1" />
                  {r.status !== "done" && (
                    <form action={setToolRequestStatus.bind(null, r.id, "done")}>
                      <button className="rounded-md border border-border px-2 py-1 transition-colors hover:bg-muted/50">Mark done</button>
                    </form>
                  )}
                  {r.status !== "dismissed" && (
                    <form action={setToolRequestStatus.bind(null, r.id, "dismissed")}>
                      <button className="rounded-md border border-border px-2 py-1 transition-colors hover:bg-muted/50">Dismiss</button>
                    </form>
                  )}
                  {r.status !== "new" && (
                    <form action={setToolRequestStatus.bind(null, r.id, "new")}>
                      <button className="rounded-md border border-border px-2 py-1 transition-colors hover:bg-muted/50">Reopen</button>
                    </form>
                  )}
                  <form action={deleteToolRequest.bind(null, r.id)}>
                    <button className="rounded-md border border-destructive/30 px-2 py-1 text-destructive transition-colors hover:bg-destructive/10">
                      Delete
                    </button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
