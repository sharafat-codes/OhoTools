import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BoxShadowGenerator } from "@/modules/tools/components/box-shadow-generator";

const tool = getTool("box-shadow-generator")!;

export const metadata = toolMetadata("box-shadow-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BoxShadowGenerator />
    </ToolShell>
  );
}
