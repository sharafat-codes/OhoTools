"use client";

import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { setMarketingEmails } from "@/modules/settings/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function EmailPreferencesForm({ defaultEnabled }: { defaultEnabled: boolean }) {
  const [enabled, setEnabled] = React.useState(defaultEnabled);
  const [saving, setSaving] = React.useState(false);

  async function toggle() {
    if (saving) return;
    const next = !enabled;
    setEnabled(next); // optimistic
    setSaving(true);
    try {
      await setMarketingEmails(next);
      toast.success(next ? "Subscribed to product updates." : "Unsubscribed from product updates.");
    } catch {
      setEnabled(!next); // revert
      toast.error("Couldn't save your preference. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email preferences</CardTitle>
        <CardDescription>
          Occasional product updates, new tools, and tips. We&rsquo;ll always send essential account emails like
          password resets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium">Product update emails</div>
            <div className="text-sm text-muted-foreground">New tools, features, and the occasional tip.</div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-label="Toggle product update emails"
            onClick={toggle}
            disabled={saving}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-60",
              enabled ? "bg-primary" : "bg-muted-foreground/30",
            )}
          >
            <span
              className={cn(
                "inline-block size-5 rounded-full bg-white shadow transition-transform",
                enabled ? "translate-x-[22px]" : "translate-x-0.5",
              )}
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
