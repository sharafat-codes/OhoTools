import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CssMinifier } from "@/modules/tools/components/css-minifier";

const tool = getTool("css-minifier")!;

export const metadata = toolMetadata("css-minifier");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CssMinifier />
    </ToolShell>
  );
}
