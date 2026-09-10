import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { RobotsTxtGenerator } from "@/modules/tools/components/robots-txt-generator";

const tool = getTool("robots-txt-generator")!;

export const metadata = toolMetadata("robots-txt-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <RobotsTxtGenerator />
    </ToolShell>
  );
}
