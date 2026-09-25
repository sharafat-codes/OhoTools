"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  MoreHorizontalIcon, CrownIcon, UserIcon, ShieldIcon, ShieldOffIcon,
  TicketIcon, TicketXIcon, CopyIcon, MailIcon, Trash2Icon, LoaderCircleIcon,
  LogInIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  setUserPlan, setUserRole, grantProPass, endProPass, deleteUser, type AdminResult,
} from "@/modules/admin/actions";
import { impersonateUser } from "@/modules/admin/impersonation";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  plan: "FREE" | "PRO";
  role: "USER" | "ADMIN";
  hasPass: boolean;
  isSelf: boolean;
};

const PASS_LENGTHS = [7, 10, 30, 90];

export function UserRowActions({ user }: { user: AdminUserRow }) {
  const [busy, setBusy] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  /** Runs an action, reports the outcome, and lets revalidation refresh the row. */
  async function run(label: string, fn: () => Promise<AdminResult | void>) {
    if (busy) return;
    setBusy(true);
    try {
      const res = (await fn()) ?? { ok: true };
      // `error` on a successful result is a caveat worth surfacing, not a failure.
      if (!res.ok) toast.error(res.error ?? "That didn't work. Please try again.");
      else if (res.error) toast.info(res.error);
      else toast.success(label);
    } catch {
      toast.error("That didn't work. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /**
   * Swaps this browser onto a short-lived session for the user and reloads —
   * a router push would leave server components rendered for the admin. `busy`
   * deliberately stays on: the page is on its way out.
   */
  async function logInAs() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await impersonateUser(user.id);
      if (!res.ok) {
        toast.error(res.error ?? "That didn't work. Please try again.");
        setBusy(false);
        return;
      }
      window.location.assign("/dashboard");
    } catch {
      toast.error("That didn't work. Please try again.");
      setBusy(false);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(user.email);
      toast.success("Email copied.");
    } catch {
      toast.error("Couldn't copy — your browser blocked clipboard access.");
    }
  }

  const who = user.name?.trim() || user.email;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label={`Actions for ${who}`} disabled={busy} />
          }
        >
          {busy ? <LoaderCircleIcon className="animate-spin" /> : <MoreHorizontalIcon />}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="truncate">{who}</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          {/* Hidden on your own row (pointless) and on other admins (refused
             server-side — one admin must not be able to step into another). */}
          {!user.isSelf && user.role !== "ADMIN" && (
            <>
              <DropdownMenuItem onClick={logInAs}>
                <LogInIcon />
                Log in as this user
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {user.plan === "PRO" ? (
            <DropdownMenuItem onClick={() => run("Moved to Free.", () => setUserPlan(user.id, "FREE"))}>
              <UserIcon />
              Move to Free
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => run("Upgraded to Pro.", () => setUserPlan(user.id, "PRO"))}>
              <CrownIcon />
              Make Pro (no expiry)
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              {user.hasPass ? "Extend pass by" : "Grant a pass for"}
            </DropdownMenuLabel>
            {PASS_LENGTHS.map((days) => (
              <DropdownMenuItem
                key={days}
                onClick={() => run(`${days}-day pass granted.`, () => grantProPass(user.id, days))}
              >
                <TicketIcon />
                {days} days
              </DropdownMenuItem>
            ))}
            {user.hasPass && (
              <DropdownMenuItem onClick={() => run("Pass ended.", () => endProPass(user.id))}>
                <TicketXIcon />
                End pass now
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          {user.role === "ADMIN" ? (
            <DropdownMenuItem
              disabled={user.isSelf}
              onClick={() => run("Admin access revoked.", () => setUserRole(user.id, "USER"))}
            >
              <ShieldOffIcon />
              {user.isSelf ? "Revoke admin (that's you)" : "Revoke admin"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => run("Made an admin.", () => setUserRole(user.id, "ADMIN"))}>
              <ShieldIcon />
              Make admin
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyEmail}>
            <CopyIcon />
            Copy email
          </DropdownMenuItem>
          <DropdownMenuItem render={<a href={`mailto:${user.email}`} />}>
            <MailIcon />
            Send an email
          </DropdownMenuItem>

          {!user.isSelf && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setConfirming(true)}>
                <Trash2Icon />
                Delete account…
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {who}?</DialogTitle>
            <DialogDescription>
              This removes the account and everything attached to it — saved cards and their share
              links, QR codes and barcodes, dynamic links and their scan history, API keys and
              payment records. It cannot be undone, and any link they have already sent out will
              stop working.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirming(false)} disabled={busy}>
              Keep account
            </Button>
            <Button
              variant="destructive"
              disabled={busy}
              onClick={async () => {
                await run(`${who} deleted.`, () => deleteUser(user.id));
                setConfirming(false);
              }}
            >
              {busy && <LoaderCircleIcon className="animate-spin" />}
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
