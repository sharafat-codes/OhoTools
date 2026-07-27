import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { XmlFormatter } from "@/modules/tools/components/xml-formatter";

const tool = getTool("xml-formatter")!;

export const metadata = toolMetadata("xml-formatter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <XmlFormatter />
    </ToolShell>
  );
}
