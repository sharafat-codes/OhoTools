import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CreditCardValidator } from "@/modules/tools/components/credit-card-validator";

const tool = getTool("credit-card-validator")!;

export const metadata = toolMetadata("credit-card-validator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CreditCardValidator />
    </ToolShell>
  );
}
