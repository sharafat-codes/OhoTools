import type { Metadata } from "next";
import { SearchIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setUserPlan, setUserRole } from "@/modules/admin/actions";

export const metadata: Metadata = { title: "Admin — Users" };

function fmtDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" as const } },
          { name: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, name: true, email: true, plan: true, role: true, createdAt: true },
  });

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {users.length} shown{q ? ` for “${q}”` : ", most recent first"}.
        </p>
      </div>

      <form className="mb-4 flex gap-2" action="/admin/users">
        <Input name="q" defaultValue={q ?? ""} placeholder="Search by name or email…" className="max-w-xs" />
        <Button type="submit" variant="outline">
          <SearchIcon />
          Search
        </Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Plan</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Joined</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-2.5">
                  <div className="font-medium">{u.name || "—"}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant={u.plan === "PRO" ? "default" : "secondary"}>{u.plan}</Badge>
                </td>
                <td className="px-4 py-2.5">
                  <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">{fmtDate(u.createdAt)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-2">
                    <form action={setUserPlan.bind(null, u.id, u.plan === "PRO" ? "FREE" : "PRO")}>
                      <Button type="submit" size="sm" variant="outline">
                        {u.plan === "PRO" ? "Make Free" : "Make Pro"}
                      </Button>
                    </form>
                    <form action={setUserRole.bind(null, u.id, u.role === "ADMIN" ? "USER" : "ADMIN")}>
                      <Button type="submit" size="sm" variant="ghost">
                        {u.role === "ADMIN" ? "Revoke admin" : "Make admin"}
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
