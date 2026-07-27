import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RegexTester } from "@/modules/tools/components/regex-tester";

const tool = getTool("regex-tester")!;

export const metadata = toolMetadata("regex-tester");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RegexTester />
    </ToolShell>
  );
}
