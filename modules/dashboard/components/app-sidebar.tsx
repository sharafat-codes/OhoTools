import Link from "next/link";
import { SparklesIcon } from "lucide-react";

import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { SidebarNav } from "@/modules/dashboard/components/sidebar-nav";
import { cn } from "@/lib/utils";

export function AppSidebar({ plan = "FREE" }: { plan?: string }) {
  return (
    <aside className="hidden md:sticky md:top-0 md:flex md:h-svh md:w-60 md:shrink-0 md:flex-col md:border-r md:border-border/60">
      <div className="flex h-14 items-center px-4">
        <Logo href="/dashboard" size="sm" />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <SidebarNav />
      </div>

      <div className="p-3">
        <Link
          href="/dashboard/billing"
          className={cn(
            "block rounded-lg border p-3 transition-colors",
            plan === "FREE"
              ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
              : "border-border bg-muted/40 hover:bg-muted",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium">
              {plan === "FREE" && <SparklesIcon className="size-3.5 text-primary" />}
              Your plan
            </span>
            <Badge
              variant="secondary"
              className={cn(plan !== "FREE" && "border-primary/30 bg-primary/10 text-primary")}
            >
              {plan}
            </Badge>
          </div>
          <p className={cn("mt-1 text-xs", plan === "FREE" ? "text-primary" : "text-muted-foreground")}>
            {plan === "FREE"
              ? "Go Pro for unlimited AI & more →"
              : "Manage your subscription and billing."}
          </p>
        </Link>
      </div>
    </aside>
  );
}
