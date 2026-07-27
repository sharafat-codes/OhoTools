import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { HashGenerator } from "@/modules/tools/components/hash-generator";

const tool = getTool("hash-generator")!;

export const metadata = toolMetadata("hash-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <HashGenerator />
    </ToolShell>
  );
}
