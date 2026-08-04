import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { FancyTextGenerator } from "@/modules/tools/components/fancy-text-generator";

const tool = getTool("fancy-text-generator")!;

export const metadata = toolMetadata("fancy-text-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <FancyTextGenerator />
    </ToolShell>
  );
}
