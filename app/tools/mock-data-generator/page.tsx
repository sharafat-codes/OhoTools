import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MockDataGenerator } from "@/modules/tools/components/mock-data-generator";

const tool = getTool("mock-data-generator")!;

export const metadata = toolMetadata("mock-data-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MockDataGenerator />
    </ToolShell>
  );
}
