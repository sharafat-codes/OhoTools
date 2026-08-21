import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { HttpStatusCodes } from "@/modules/tools/components/http-status-codes";

const tool = getTool("http-status-codes")!;

export const metadata = toolMetadata("http-status-codes");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <HttpStatusCodes />
    </ToolShell>
  );
}
