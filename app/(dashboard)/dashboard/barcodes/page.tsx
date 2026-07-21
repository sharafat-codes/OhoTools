import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { isPro } from "@/lib/plans";
import { BarcodeWorkspace } from "@/modules/barcode/components/barcode-workspace";

export const metadata: Metadata = { title: "Barcode Generator" };

export default async function BarcodesPage() {
  const user = await requireUser();
  const pro = isPro((user as { plan?: string }).plan ?? "FREE");

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Barcode Generator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate barcodes in every major format, export as PNG/SVG/PDF, and
          save them to your history.
        </p>
      </div>
      <BarcodeWorkspace isPro={pro} />
    </div>
  );
}
