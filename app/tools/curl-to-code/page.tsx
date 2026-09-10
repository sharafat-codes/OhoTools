import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CurlToCode } from "@/modules/tools/components/curl-to-code";

const tool = getTool("curl-to-code")!;

export const metadata = toolMetadata("curl-to-code");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CurlToCode />
    </ToolShell>
  );
}
