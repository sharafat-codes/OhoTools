import Link from "next/link";
import { SparklesIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
            <SparklesIcon className="size-3.5" />
          </span>
          ToolPilot
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
