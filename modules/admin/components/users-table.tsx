import { BadgeCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { UserRowActions, type AdminUserRow } from "@/modules/admin/components/user-row-actions";

/**
 * One row of the admin users table, already shaped for display. Kept separate
 * from the query so the table can be rendered against fixtures — the page
 * itself is behind an admin session and cannot easily be looked at otherwise.
 */
export type AdminUserView = AdminUserRow & {
  emailVerified: boolean;
  createdAt: Date;
  proUntil: Date | null;
  subStatus: string | null;
  activity: { n: number; label: string }[];
  paidTotal: number;
  paidCount: number;
  currency: string;
  lastSeen: Date | null;
};

function fmtDate(d: Date | null | undefined) {
  return d ? new Date(d).toISOString().slice(0, 10) : "—";
}

/** "3 days ago" is the question being asked here, not the exact timestamp. */
function ago(d: Date | null | undefined) {
  if (!d) return null;
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function money(amount: number, currency: string) {
  // Payment.amount is stored in the unit each provider settles in — whole
  // rupees for Safepay and JazzCash — so it is shown as-is, not divided.
  return `${currency} ${amount.toLocaleString()}`.trim();
}

export function UsersTable({ rows }: { rows: AdminUserView[] }) {
  const now = new Date();

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">User</th>
            <th className="px-4 py-2.5 font-medium">Plan</th>
            <th className="px-4 py-2.5 font-medium">Activity</th>
            <th className="px-4 py-2.5 font-medium">Paid</th>
            <th className="px-4 py-2.5 font-medium">Joined</th>
            <th className="px-4 py-2.5 font-medium">Last seen</th>
            <th className="px-4 py-2.5 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => {
            const passLive = !!u.proUntil && u.proUntil > now;
            return (
              <tr key={u.id} className="border-b border-border/50 align-top last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="truncate">{u.name || "—"}</span>
                    {u.emailVerified && (
                      <BadgeCheckIcon className="size-3.5 shrink-0 text-primary" aria-label="Email verified" />
                    )}
                    {u.role === "ADMIN" && <Badge variant="secondary" className="ml-0.5">admin</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge variant={u.plan === "PRO" ? "default" : "secondary"}>{u.plan}</Badge>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {u.subStatus
                      ? `sub · ${u.subStatus}`
                      : passLive
                        ? `pass to ${fmtDate(u.proUntil)}`
                        : u.proUntil
                          ? `pass ended ${fmtDate(u.proUntil)}`
                          : u.plan === "PRO"
                            ? "no expiry"
                            : ""}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {u.activity.length === 0 ? (
                    <span className="text-xs text-muted-foreground">nothing yet</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {u.activity.map((a) => (
                        <span
                          key={a.label}
                          className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] whitespace-nowrap text-muted-foreground"
                        >
                          {a.n} {a.label}
                        </span>
                      ))}
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {u.paidTotal > 0 ? (
                    <>
                      <div className="font-medium">{money(u.paidTotal, u.currency)}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {u.paidCount} payment{u.paidCount === 1 ? "" : "s"}
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{fmtDate(u.createdAt)}</td>

                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {ago(u.lastSeen) ?? <span className="text-xs">never</span>}
                </td>

                <td className="px-4 py-3 text-right">
                  <UserRowActions user={u} />
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
