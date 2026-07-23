import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BulkQrGenerator } from "@/modules/tools/components/bulk-qr-generator";

const tool = getTool("bulk-qr-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/bulk-qr-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BulkQrGenerator />
    </ToolShell>
  );
}
