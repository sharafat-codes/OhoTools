import Link from "next/link";

import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/lib/dal";
import { SiteHeader } from "@/modules/marketing/components/site-header";

export default async function FilesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader isAuthed={!!user} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <Logo size="sm" />
          <div className="flex gap-4 text-xs">
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/request-tool" className="hover:text-foreground">Request a tool</Link>
            <Link href="/developers" className="hover:text-foreground">API</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
