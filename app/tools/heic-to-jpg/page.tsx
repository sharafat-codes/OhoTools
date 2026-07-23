import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("heic-to-jpg")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/heic-to-jpg" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="heic-to-jpg"
        accept=".heic,.heif"
        inLabel="HEIC photo"
        outExt="jpg"
        actionLabel="Convert to JPG"
        hint="An iPhone .heic or .heif photo — up to 15 MB."
      />
    </ToolShell>
  );
}
