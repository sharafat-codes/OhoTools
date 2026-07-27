import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { TextToBinary } from "@/modules/tools/components/text-to-binary";

const tool = getTool("text-to-binary")!;

export const metadata = toolMetadata("text-to-binary");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <TextToBinary />
    </ToolShell>
  );
}
