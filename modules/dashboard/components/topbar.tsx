"use client";

import * as React from "react";
import { MenuIcon } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { ToolSearch } from "@/components/tool-search";
import { SidebarNav } from "@/modules/dashboard/components/sidebar-nav";
import { UserMenu, type MenuUser } from "@/modules/dashboard/components/user-menu";

export function Topbar({ user, isAdmin }: { user: MenuUser; isAdmin?: boolean }) {
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
            <Logo
              href="/dashboard"
              size="sm"
              onClick={() => setOpen(false)}
            />
          </SheetHeader>
          <div className="px-3">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <ToolSearch className="ml-1" />
      <div className="flex-1" />

      <ThemeToggle />
      <UserMenu user={user} isAdmin={isAdmin} />
    </header>
  );
}
