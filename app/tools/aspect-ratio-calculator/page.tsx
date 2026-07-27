import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AspectRatioCalculator } from "@/modules/tools/components/aspect-ratio-calculator";

const tool = getTool("aspect-ratio-calculator")!;

export const metadata = toolMetadata("aspect-ratio-calculator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AspectRatioCalculator />
    </ToolShell>
  );
}
