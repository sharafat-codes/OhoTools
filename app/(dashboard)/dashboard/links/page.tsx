import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon, ZapIcon } from "lucide-react";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/plans";
import { getAppUrl } from "@/lib/app-url";
import { LinksList, type LinkRow } from "@/modules/links/components/links-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dynamic Links" };

export default async function LinksPage() {
  const user = await requireUser();
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");

  const links = await prisma.dynamicLink.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const base = getAppUrl();
  const rows: LinkRow[] = links.map((l) => ({
    id: l.id,
    name: l.name,
    shortCode: l.shortCode,
    targetUrl: l.targetUrl,
    active: l.active,
    scanCount: l.scanCount,
    url: `${base}/r/${l.shortCode}`,
    expiresAt: l.expiresAt?.toISOString() ?? null,
  }));

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Dynamic links
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Editable QR codes with scan analytics.
          </p>
        </div>
        <Button render={<Link href="/dashboard/qr" />}>
          <PlusIcon />
          New
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="grid size-10 place-items-center rounded-full bg-muted">
              <ZapIcon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading font-medium">No dynamic links yet</p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {pro
                  ? "Create a dynamic QR to change its destination anytime and track scans."
                  : "Dynamic QR codes are a Pro feature — print once, re-point anytime, and see analytics."}
              </p>
            </div>
            <Button render={<Link href={pro ? "/dashboard/qr" : "/dashboard/billing"} />}>
              {pro ? "Create dynamic QR" : "Upgrade to Pro"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <LinksList links={rows} />
      )}
    </div>
  );
}
