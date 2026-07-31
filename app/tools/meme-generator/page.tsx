import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MemeGenerator } from "@/modules/tools/components/meme-generator";

const tool = getTool("meme-generator")!;

export const metadata = toolMetadata("meme-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MemeGenerator />
    </ToolShell>
  );
}
