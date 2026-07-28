import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("pdf-to-pptx")!;

export const metadata = toolMetadata("pdf-to-pptx");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="pdf-to-pptx"
        accept=".pdf,application/pdf"
        inLabel="PDF"
        outExt="pptx"
        actionLabel="Convert to PowerPoint"
        hint="A PDF file — up to 15 MB."
      />
    </ToolShell>
  );
}
