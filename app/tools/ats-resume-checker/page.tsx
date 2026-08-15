import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AtsCheckerApp } from "@/modules/resume/components/ats-checker-app";

const tool = getTool("ats-resume-checker")!;

export const metadata = toolMetadata("ats-resume-checker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AtsCheckerApp />
    </ToolShell>
  );
}
