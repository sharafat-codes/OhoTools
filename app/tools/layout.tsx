import Link from "next/link";

import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/lib/dal";
import { PlanProvider } from "@/components/plan-provider";
import { SiteHeader } from "@/modules/marketing/components/site-header";

export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader isAuthed={!!user} />
      <PlanProvider authed={!!user} plan={(user as { plan?: string } | null)?.plan ?? "FREE"}>
        <main className="flex-1">{children}</main>
      </PlanProvider>
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <Logo size="sm" />
          <div className="flex gap-4 text-xs">
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <Link href="/interview" className="hover:text-foreground">Interview</Link>
            <Link href="/resume-review" className="hover:text-foreground">Resume</Link>
            <Link href="/widgets" className="hover:text-foreground">Widgets</Link>
            <Link href="/request-tool" className="hover:text-foreground">Request a tool</Link>
            <Link href="/developers" className="hover:text-foreground">API</Link>
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/refunds" className="hover:text-foreground">Refunds</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
