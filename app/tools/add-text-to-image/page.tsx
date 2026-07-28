import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AddTextToImage } from "@/modules/tools/components/add-text-to-image";

const tool = getTool("add-text-to-image")!;

export const metadata = toolMetadata("add-text-to-image");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AddTextToImage />
    </ToolShell>
  );
}
