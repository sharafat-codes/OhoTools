import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { BcryptGenerator } from "@/modules/tools/components/bcrypt-generator";

const tool = getTool("bcrypt-generator")!;

export const metadata = toolMetadata("bcrypt-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <BcryptGenerator />
    </ToolShell>
  );
}
