import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UserAgentParser } from "@/modules/tools/components/user-agent-parser";

const tool = getTool("user-agent-parser")!;

export const metadata = toolMetadata("user-agent-parser");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UserAgentParser />
    </ToolShell>
  );
}
