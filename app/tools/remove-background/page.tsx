import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RemoveBackground } from "@/modules/tools/components/remove-background";

const tool = getTool("remove-background")!;

export const metadata = toolMetadata("remove-background");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RemoveBackground />
    </ToolShell>
  );
}
