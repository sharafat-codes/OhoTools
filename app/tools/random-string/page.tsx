import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RandomString } from "@/modules/tools/components/random-string";

const tool = getTool("random-string")!;

export const metadata = toolMetadata("random-string");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RandomString />
    </ToolShell>
  );
}
