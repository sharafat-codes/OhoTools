import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { JwtDecoder } from "@/modules/tools/components/jwt-decoder";

const tool = getTool("jwt-decoder")!;

export const metadata = toolMetadata("jwt-decoder");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <JwtDecoder />
    </ToolShell>
  );
}
