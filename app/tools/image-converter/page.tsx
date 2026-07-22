import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageConverter } from "@/modules/tools/components/image-converter";

const tool = getTool("image-converter")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/image-converter" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageConverter />
    </ToolShell>
  );
}
