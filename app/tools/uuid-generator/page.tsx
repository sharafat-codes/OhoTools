import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UuidTool } from "@/modules/tools/components/uuid-tool";

const tool = getTool("uuid-generator")!;

export const metadata = toolMetadata("uuid-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UuidTool />
    </ToolShell>
  );
}
