import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { WebcamTest } from "@/modules/tools/components/webcam-test";

const tool = getTool("webcam-test")!;

export const metadata = toolMetadata("webcam-test");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <WebcamTest />
    </ToolShell>
  );
}
