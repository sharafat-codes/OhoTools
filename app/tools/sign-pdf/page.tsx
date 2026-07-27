import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { SignPdf } from "@/modules/tools/components/sign-pdf";

const tool = getTool("sign-pdf")!;

export const metadata = toolMetadata("sign-pdf");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <SignPdf />
    </ToolShell>
  );
}
