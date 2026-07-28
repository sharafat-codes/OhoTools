import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MergeAudio } from "@/modules/tools/components/merge-audio";

const tool = getTool("merge-audio")!;

export const metadata = toolMetadata("merge-audio");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MergeAudio />
    </ToolShell>
  );
}
