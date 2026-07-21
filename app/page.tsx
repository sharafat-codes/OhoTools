import Link from "next/link";
import {
  ArrowRightIcon,
  QrCodeIcon,
  ScanBarcodeIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser } from "@/lib/dal";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-heading font-semibold">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <SparklesIcon className="size-3.5" />
            </span>
            ToolPilot
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button size="sm" render={<Link href="/dashboard" />}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" render={<Link href="/login" />}>
                  Log in
                </Button>
                <Button size="sm" render={<Link href="/signup" />}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 sm:px-6">
        <section className="flex flex-col items-center py-24 text-center sm:py-32">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <SparklesIcon className="size-3.5" />
            The all-in-one productivity toolkit
          </span>
          <h1 className="font-heading max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Every tool your business needs, in one place.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            Generate QR codes and barcodes, save your work to the cloud, and
            track everything from one modern dashboard. Built for freelancers,
            creators, and small teams.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" render={<Link href="/signup" />}>
              Start for free
              <ArrowRightIcon />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              Log in
            </Button>
          </div>
        </section>

        {/* Feature preview */}
        <section className="grid w-full gap-4 pb-24 sm:grid-cols-3">
          {[
            {
              icon: QrCodeIcon,
              title: "QR Code Generator",
              body: "Create, customize, and download QR codes. Dynamic codes and scan analytics coming soon.",
            },
            {
              icon: ScanBarcodeIcon,
              title: "Barcode Generator",
              body: "Generate barcodes in every major format and export them in bulk.",
            },
            {
              icon: SparklesIcon,
              title: "More tools soon",
              body: "PDF utilities, image tools, developer helpers, and AI-powered features are on the way.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-5 text-left"
            >
              <div className="mb-3 grid size-9 place-items-center rounded-lg bg-muted text-foreground">
                <f.icon className="size-4.5" />
              </div>
              <h3 className="font-heading font-medium">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 text-xs text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} ToolPilot</span>
          <span>Built with Next.js</span>
        </div>
      </footer>
    </div>
  );
}
