import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { devTools } from "@/modules/tools/registry";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Free Developer Tools",
  description:
    "Free online developer tools — JSON formatter, Base64 encoder/decoder, UUID generator, and more. Fast, private, and browser-based.",
  alternates: { canonical: "/tools" },
};

export default function ToolsHub() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Free developer tools
        </h1>
        <p className="mt-4 text-muted-foreground">
          Fast, private, browser-based utilities. No sign-up, nothing uploaded.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {devTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
              <Card className="h-full transition-colors hover:border-foreground/20">
                <CardContent className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 font-heading font-medium">
                      {tool.name}
                      <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.tagline}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/30 px-6 py-10 text-center">
        <h2 className="font-heading text-xl font-semibold">Need QR codes &amp; barcodes too?</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Create branded QR codes, track scans, and save everything to the cloud
          with a free OhoTool account.
        </p>
        <Button render={<Link href="/signup" />}>
          Get started free
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
