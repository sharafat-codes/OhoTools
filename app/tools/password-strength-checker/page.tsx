import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PasswordStrengthChecker } from "@/modules/tools/components/password-strength-checker";

const tool = getTool("password-strength-checker")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/password-strength-checker" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PasswordStrengthChecker />
    </ToolShell>
  );
}
