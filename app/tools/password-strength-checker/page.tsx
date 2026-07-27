import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PasswordStrengthChecker } from "@/modules/tools/components/password-strength-checker";

const tool = getTool("password-strength-checker")!;

export const metadata = toolMetadata("password-strength-checker");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PasswordStrengthChecker />
    </ToolShell>
  );
}
