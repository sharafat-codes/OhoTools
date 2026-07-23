import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("heic-to-png")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/heic-to-png" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="heic-to-png"
        accept=".heic,.heif"
        inLabel="HEIC photo"
        outExt="png"
        actionLabel="Convert to PNG"
        hint="An iPhone .heic or .heif photo — up to 15 MB."
      />
    </ToolShell>
  );
}
