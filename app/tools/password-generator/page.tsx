import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PasswordGenerator } from "@/modules/tools/components/password-generator";

const tool = getTool("password-generator")!;

export const metadata = toolMetadata("password-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PasswordGenerator />
    </ToolShell>
  );
}
