import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { MicTest } from "@/modules/tools/components/mic-test";

const tool = getTool("mic-test")!;

export const metadata = toolMetadata("mic-test");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <MicTest />
    </ToolShell>
  );
}
