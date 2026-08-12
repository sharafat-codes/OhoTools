import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { KeyboardTester } from "@/modules/tools/components/keyboard-tester";

const tool = getTool("keyboard-tester")!;

export const metadata = toolMetadata("keyboard-tester");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <KeyboardTester />
    </ToolShell>
  );
}
