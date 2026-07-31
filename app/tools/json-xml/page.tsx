import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsonXml } from "@/modules/tools/components/json-xml";

const tool = getTool("json-xml")!;

export const metadata = toolMetadata("json-xml");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsonXml />
    </ToolShell>
  );
}
