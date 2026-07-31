import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JsMinifier } from "@/modules/tools/components/js-minifier";

const tool = getTool("js-minifier")!;

export const metadata = toolMetadata("js-minifier");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JsMinifier />
    </ToolShell>
  );
}
