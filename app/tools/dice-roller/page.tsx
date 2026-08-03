import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DiceRoller } from "@/modules/tools/components/dice-roller";

const tool = getTool("dice-roller")!;

export const metadata = toolMetadata("dice-roller");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DiceRoller />
    </ToolShell>
  );
}
