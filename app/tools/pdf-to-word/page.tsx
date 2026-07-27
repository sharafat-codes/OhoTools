import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("pdf-to-word")!;

export const metadata = toolMetadata("pdf-to-word");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="pdf-to-word"
        accept=".pdf"
        inLabel="PDF"
        outExt="docx"
        actionLabel="Convert to Word"
        hint="A PDF file — up to 15 MB."
      />
    </ToolShell>
  );
}
