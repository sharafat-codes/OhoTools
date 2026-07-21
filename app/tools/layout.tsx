import Link from "next/link";
import { SparklesIcon } from "lucide-react";

import { getCurrentUser } from "@/lib/dal";
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
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-heading font-semibold text-foreground">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <SparklesIcon className="size-3.5" />
            </span>
            OhoTool
          </Link>
          <span className="text-xs">Free tools · no sign-up required</span>
        </div>
      </footer>
    </div>
  );
}
