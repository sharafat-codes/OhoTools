import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ColorContrastChecker } from "@/modules/tools/components/color-contrast-checker";

const tool = getTool("color-contrast-checker")!;

export const metadata = toolMetadata("color-contrast-checker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ColorContrastChecker />
    </ToolShell>
  );
}
