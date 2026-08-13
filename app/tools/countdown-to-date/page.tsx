import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CountdownToDate } from "@/modules/tools/components/countdown-to-date";

const tool = getTool("countdown-to-date")!;

export const metadata = toolMetadata("countdown-to-date");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CountdownToDate />
    </ToolShell>
  );
}
