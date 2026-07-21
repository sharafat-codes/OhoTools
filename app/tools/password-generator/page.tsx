import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { PasswordGenerator } from "@/modules/tools/components/password-generator";

const tool = getTool("password-generator")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/password-generator" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <PasswordGenerator />
    </ToolShell>
  );
}
