import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RandomPicker } from "@/modules/tools/components/random-picker";

const tool = getTool("random-picker")!;

export const metadata = toolMetadata("random-picker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RandomPicker />
    </ToolShell>
  );
}
