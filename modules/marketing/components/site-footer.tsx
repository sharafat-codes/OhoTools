import Link from "next/link";

import { Logo } from "@/components/logo";

// Single site-wide footer. Responsive: on mobile the logo/copyright and the
// link list stack and center; from `sm` up they sit on one row with the links
// wrapping instead of overflowing.
const FOOTER_LINKS: { href: string; label: string }[] = [
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/interview", label: "Interview" },
  { href: "/resume-review", label: "Resume" },
  { href: "/widgets", label: "Widgets" },
  { href: "/request-tool", label: "Request a tool" },
  { href: "/developers", label: "API" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/refunds", label: "Refunds" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo size="sm" />
          <p className="text-xs text-muted-foreground">© {year} OhoTool. All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs sm:max-w-md sm:justify-end">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
