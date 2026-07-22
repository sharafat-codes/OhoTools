import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WifiQr } from "@/modules/tools/components/wifi-qr";

const tool = getTool("wifi-qr")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/wifi-qr" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WifiQr />
    </ToolShell>
  );
}
