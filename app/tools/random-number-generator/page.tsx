import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RandomNumberGenerator } from "@/modules/tools/components/random-number-generator";

const tool = getTool("random-number-generator")!;

export const metadata = toolMetadata("random-number-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RandomNumberGenerator />
    </ToolShell>
  );
}
