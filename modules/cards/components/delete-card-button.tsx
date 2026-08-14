"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";

import { deleteCard } from "@/modules/cards/actions";

export function DeleteCardButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function onDelete() {
    if (busy) return;
    if (!window.confirm("Delete this card? This can't be undone.")) return;
    setBusy(true);
    await deleteCard(id);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={busy}
      aria-label="Delete card"
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-500 disabled:opacity-50"
    >
      <Trash2Icon className="size-3.5" /> {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
