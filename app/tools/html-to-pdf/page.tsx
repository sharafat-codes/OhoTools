import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DocConvert } from "@/modules/tools/components/doc-convert";

const tool = getTool("html-to-pdf")!;

export const metadata = toolMetadata("html-to-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DocConvert
        op="html-to-pdf"
        accept=".html,.htm,text/html"
        inLabel="HTML file"
        outExt="pdf"
        actionLabel="Convert to PDF"
        hint="An .html file — up to 15 MB."
      />
    </ToolShell>
  );
}
