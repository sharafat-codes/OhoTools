import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageToText } from "@/modules/tools/components/image-to-text";

const tool = getTool("image-to-text")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/image-to-text" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageToText />
    </ToolShell>
  );
}
