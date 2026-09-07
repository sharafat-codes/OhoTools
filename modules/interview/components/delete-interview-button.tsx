"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, LoaderCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DeleteInterviewButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function remove() {
    if (!window.confirm("Delete this saved interview? This can't be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/interview/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard/interviews");
        router.refresh();
      } else {
        setBusy(false);
      }
    } catch {
      setBusy(false);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={remove} disabled={busy} className="text-muted-foreground hover:text-destructive">
      {busy ? <LoaderCircleIcon className="size-4 animate-spin" /> : <Trash2Icon className="size-4" />}
      Delete
    </Button>
  );
}
