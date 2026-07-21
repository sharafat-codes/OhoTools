import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ImageToBase64 } from "@/modules/tools/components/image-to-base64";

const tool = getTool("image-to-base64")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/image-to-base64" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ImageToBase64 />
    </ToolShell>
  );
}
