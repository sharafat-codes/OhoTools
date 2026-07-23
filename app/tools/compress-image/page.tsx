import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CompressImage } from "@/modules/tools/components/compress-image";

const tool = getTool("compress-image")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/compress-image" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CompressImage />
    </ToolShell>
  );
}
