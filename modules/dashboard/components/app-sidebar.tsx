import Link from "next/link";
import { SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SidebarNav } from "@/modules/dashboard/components/sidebar-nav";

export function AppSidebar({ plan = "FREE" }: { plan?: string }) {
  return (
    <aside className="hidden md:sticky md:top-0 md:flex md:h-svh md:w-60 md:shrink-0 md:flex-col md:border-r md:border-border/60">
      <div className="flex h-14 items-center px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-heading font-semibold"
        >
          <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
            <SparklesIcon className="size-3.5" />
          </span>
          ToolPilot
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <SidebarNav />
      </div>

      <div className="p-3">
        <Link
          href="/dashboard/billing"
          className="block rounded-lg border border-border bg-muted/40 p-3 transition-colors hover:bg-muted"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Your plan</span>
            <Badge variant="secondary">{plan}</Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {plan === "FREE"
              ? "Upgrade for unlimited saves and more."
              : "Manage your subscription and billing."}
          </p>
        </Link>
      </div>
    </aside>
  );
}
