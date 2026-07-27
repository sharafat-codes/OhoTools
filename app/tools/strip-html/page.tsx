import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { StripHtml } from "@/modules/tools/components/strip-html";

const tool = getTool("strip-html")!;

export const metadata = toolMetadata("strip-html");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <StripHtml />
    </ToolShell>
  );
}
