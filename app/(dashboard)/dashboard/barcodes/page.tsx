import type { Metadata } from "next";

import { BarcodeGenerator } from "@/modules/barcode/components/barcode-generator";

export const metadata: Metadata = { title: "Barcode Generator" };

export default function BarcodesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Barcode Generator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate barcodes in every major format — then save them to your
          history.
        </p>
      </div>
      <BarcodeGenerator />
    </div>
  );
}
