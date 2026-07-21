"use client";

import { ScanBarcodeIcon, LayersIcon } from "lucide-react";

import { BarcodeGenerator } from "@/modules/barcode/components/barcode-generator";
import { BarcodeBulk } from "@/modules/barcode/components/barcode-bulk";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BarcodeWorkspace({ isPro }: { isPro: boolean }) {
  return (
    <Tabs defaultValue="single">
      <TabsList>
        <TabsTrigger value="single">
          <ScanBarcodeIcon />
          Single
        </TabsTrigger>
        <TabsTrigger value="bulk">
          <LayersIcon />
          Bulk
        </TabsTrigger>
      </TabsList>
      <TabsContent value="single">
        <BarcodeGenerator isPro={isPro} />
      </TabsContent>
      <TabsContent value="bulk">
        <BarcodeBulk isPro={isPro} />
      </TabsContent>
    </Tabs>
  );
}
