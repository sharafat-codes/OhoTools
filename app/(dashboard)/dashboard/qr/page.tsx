import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { QrWorkspace } from "@/modules/qr/components/qr-workspace";

export const metadata: Metadata = { title: "QR Code Generator" };

export default async function QrPage() {
  const user = await requireUser();
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          QR Code Generator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, customize, and download QR codes — then save them to your
          history.
        </p>
      </div>
      <QrWorkspace isPro={pro} />
    </div>
  );
}
