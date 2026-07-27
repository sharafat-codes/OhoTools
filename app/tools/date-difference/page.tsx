import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { DateDifference } from "@/modules/tools/components/date-difference";

const tool = getTool("date-difference")!;

export const metadata = toolMetadata("date-difference");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <DateDifference />
    </ToolShell>
  );
}
