import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageResizer } from "@/modules/tools/components/image-resizer";

const tool = getTool("image-resizer")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/image-resizer" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageResizer />
    </ToolShell>
  );
}
