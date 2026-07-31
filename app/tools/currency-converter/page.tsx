import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CurrencyConverter } from "@/modules/tools/components/currency-converter";

const tool = getTool("currency-converter")!;

export const metadata = toolMetadata("currency-converter");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CurrencyConverter />
    </ToolShell>
  );
}
