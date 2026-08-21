import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { GitignoreGenerator } from "@/modules/tools/components/gitignore-generator";

const tool = getTool("gitignore-generator")!;

export const metadata = toolMetadata("gitignore-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <GitignoreGenerator />
    </ToolShell>
  );
}
