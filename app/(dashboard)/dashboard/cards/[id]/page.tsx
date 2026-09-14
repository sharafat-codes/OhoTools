import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, UsersIcon, CheckIcon, XIcon, SparklesIcon } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/plans";
import { normalizeCard } from "@/modules/cards/types";
import { CardEditor } from "@/modules/cards/components/card-editor";
import { RsvpExport } from "@/modules/cards/components/rsvp-export";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit Card" };

function Stat({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("font-heading text-2xl font-semibold tabular-nums", className)}>{value}</div>
    </div>
  );
}

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");
  const row = await prisma.card.findFirst({ where: { id, userId: (user as { id: string }).id } });
  if (!row) notFound();

  let data;
  try {
    data = normalizeCard(JSON.parse(row.data));
  } catch {
    data = normalizeCard({ occasion: row.occasion as never });
  }

  const rsvps = await prisma.rsvp.findMany({ where: { cardId: row.id }, orderBy: { createdAt: "desc" } });
  const attending = rsvps.filter((r) => r.attending);
  const declined = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((n, r) => n + r.guests, 0);
  const hasRsvps = rsvps.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Link href="/dashboard/cards" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" /> My Cards
      </Link>
      <h1 className="mb-6 font-heading text-2xl font-semibold tracking-tight">Edit card</h1>

      {(data.rsvp || hasRsvps) && (
        <section className="mb-8 rounded-2xl border border-border bg-card/50 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
              <UsersIcon className="size-5 text-primary" /> RSVPs
            </h2>
            {pro && hasRsvps && (
              <RsvpExport
                rows={rsvps.map((r) => ({ name: r.name, attending: r.attending, guests: r.guests, message: r.message, createdAt: r.createdAt.toISOString() }))}
                filename={`rsvps-${row.shortCode ?? row.id}.csv`}
              />
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Attending" value={attending.length} className="text-emerald-600 dark:text-emerald-500" />
            <Stat label="Total guests" value={totalGuests} className="text-primary" />
            <Stat label="Can't make it" value={declined.length} className="text-muted-foreground" />
          </div>

          {!hasRsvps ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No RSVPs yet. Make sure &quot;Collect RSVPs&quot; is on, then share your card&apos;s link — replies will appear here.
            </p>
          ) : pro ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Going</th>
                    <th className="py-2 pr-3 font-medium">Guests</th>
                    <th className="py-2 pr-3 font-medium">Message</th>
                    <th className="py-2 font-medium">When</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((r) => (
                    <tr key={r.id} className="border-b border-border/60">
                      <td className="py-2 pr-3 font-medium">{r.name}</td>
                      <td className="py-2 pr-3">
                        {r.attending ? <CheckIcon className="size-4 text-emerald-600" /> : <XIcon className="size-4 text-muted-foreground" />}
                      </td>
                      <td className="py-2 pr-3 tabular-nums">{r.attending ? r.guests : "—"}</td>
                      <td className="max-w-[16rem] truncate py-2 pr-3 text-muted-foreground">{r.message || "—"}</td>
                      <td className="whitespace-nowrap py-2 text-xs text-muted-foreground">{r.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
              <p className="text-sm font-medium">
                You have {rsvps.length} RSVP{rsvps.length === 1 ? "" : "s"} ({totalGuests} guests) 🎉
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade to Pro to see the full guest list — names, messages, and a CSV export.
              </p>
              <Button className="mt-3" render={<Link href="/dashboard/billing" />}>
                <SparklesIcon className="size-4" /> Unlock the guest list
              </Button>
            </div>
          )}
        </section>
      )}

      <CardEditor occasion={data.occasion} initialCard={data} cardId={row.id} initialShortCode={row.shortCode ?? undefined} advanced />
    </div>
  );
}
