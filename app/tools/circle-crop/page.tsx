import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CircleCrop } from "@/modules/tools/components/circle-crop";

const tool = getTool("circle-crop")!;

export const metadata = toolMetadata("circle-crop");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CircleCrop />
    </ToolShell>
  );
}
