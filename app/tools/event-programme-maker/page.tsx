import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ProgrammeMaker } from "@/modules/tools/components/programme-maker";

const tool = getTool("event-programme-maker")!;

export const metadata = toolMetadata("event-programme-maker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ProgrammeMaker />
    </ToolShell>
  );
}
