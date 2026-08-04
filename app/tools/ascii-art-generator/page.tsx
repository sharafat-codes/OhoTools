import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AsciiArtGenerator } from "@/modules/tools/components/ascii-art-generator";

const tool = getTool("ascii-art-generator")!;

export const metadata = toolMetadata("ascii-art-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AsciiArtGenerator />
    </ToolShell>
  );
}
