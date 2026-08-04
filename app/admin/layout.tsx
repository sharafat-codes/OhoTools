import Link from "next/link";
import { LayoutDashboardIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";

import { requireAdmin } from "@/lib/dal";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/modules/dashboard/components/user-menu";

const links = [
  { label: "Overview", href: "/admin", icon: LayoutDashboardIcon },
  { label: "Users", href: "/admin/users", icon: UsersIcon },
];

// Admin area — never index.
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden md:sticky md:top-0 md:flex md:h-svh md:w-56 md:shrink-0 md:flex-col md:border-r md:border-border/60">
        <div className="flex h-14 items-center gap-2 px-4">
          <Logo href="/admin" size="sm" wordmark={false} />
          <span className="font-heading font-semibold">OhoTool</span>
          <Badge variant="secondary">Admin</Badge>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <Icon className="size-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <ArrowLeftIcon className="size-4" />
            Back to app
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur sm:px-6">
          <span className="font-heading text-sm font-semibold">Admin</span>
          <div className="flex-1" />
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground md:hidden">
            App
          </Link>
          <ThemeToggle />
          <UserMenu user={{ name: user.name, email: user.email, image: user.image }} />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
