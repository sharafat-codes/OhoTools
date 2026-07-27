import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { ColorShadesGenerator } from "@/modules/tools/components/color-shades-generator";

const tool = getTool("color-shades-generator")!;

export const metadata = toolMetadata("color-shades-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <ColorShadesGenerator />
    </ToolShell>
  );
}
