import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("word-to-pdf")!;

export const metadata = toolMetadata("word-to-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="to-pdf"
        accept=".doc,.docx,.odt,.rtf"
        inLabel="Word document"
        outExt="pdf"
        actionLabel="Convert to PDF"
        hint="Word .doc or .docx — up to 15 MB."
      />
    </ToolShell>
  );
}
