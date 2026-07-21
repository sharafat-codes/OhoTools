"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "@/modules/dashboard/components/sidebar-nav";
import { UserMenu, type MenuUser } from "@/modules/dashboard/components/user-menu";

export function Topbar({ user }: { user: MenuUser }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur sm:px-6">
      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              aria-label="Open navigation"
            />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader className="pb-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-heading font-semibold"
              onClick={() => setOpen(false)}
            >
              <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
                <SparklesIcon className="size-3.5" />
              </span>
              ToolPilot
            </Link>
          </SheetHeader>
          <div className="px-3">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      <ThemeToggle />
      <UserMenu user={user} />
    </header>
  );
}
