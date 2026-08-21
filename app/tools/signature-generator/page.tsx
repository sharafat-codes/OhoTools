import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SignatureGenerator } from "@/modules/tools/components/signature-generator";

const tool = getTool("signature-generator")!;

export const metadata = toolMetadata("signature-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SignatureGenerator />
    </ToolShell>
  );
}
