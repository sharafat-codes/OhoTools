import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { QrCodeTool } from "@/modules/tools/components/qr-code-tool";

const tool = getTool("qr-code")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/qr-code" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <QrCodeTool />
    </ToolShell>
  );
}
