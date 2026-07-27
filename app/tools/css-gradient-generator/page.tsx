import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CssGradientGenerator } from "@/modules/tools/components/css-gradient-generator";

const tool = getTool("css-gradient-generator")!;

export const metadata = toolMetadata("css-gradient-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CssGradientGenerator />
    </ToolShell>
  );
}
