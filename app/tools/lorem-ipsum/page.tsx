import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { LoremIpsum } from "@/modules/tools/components/lorem-ipsum";

const tool = getTool("lorem-ipsum")!;

export const metadata = toolMetadata("lorem-ipsum");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <LoremIpsum />
    </ToolShell>
  );
}
