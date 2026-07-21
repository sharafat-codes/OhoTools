import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { Base64Tool } from "@/modules/tools/components/base64-tool";

const tool = getTool("base64")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/base64" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <Base64Tool />
    </ToolShell>
  );
}
