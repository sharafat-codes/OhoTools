"use client";

import { QrCodeIcon, LayersIcon, ZapIcon } from "lucide-react";

import { QrGenerator } from "@/modules/qr/components/qr-generator";
import { QrBulk } from "@/modules/qr/components/qr-bulk";
import { DynamicCreate } from "@/modules/links/components/dynamic-create";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function QrWorkspace({ isPro }: { isPro: boolean }) {
  return (
    <Tabs defaultValue="single">
      <TabsList>
        <TabsTrigger value="single">
          <QrCodeIcon />
          Single
        </TabsTrigger>
        <TabsTrigger value="dynamic">
          <ZapIcon />
          Dynamic
        </TabsTrigger>
        <TabsTrigger value="bulk">
          <LayersIcon />
          Bulk
        </TabsTrigger>
      </TabsList>
      <TabsContent value="single">
        <QrGenerator isPro={isPro} />
      </TabsContent>
      <TabsContent value="dynamic">
        <DynamicCreate isPro={isPro} />
      </TabsContent>
      <TabsContent value="bulk">
        <QrBulk isPro={isPro} />
      </TabsContent>
    </Tabs>
  );
}
