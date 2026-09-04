import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("excel-formula-generator")!;

export const metadata = toolMetadata("excel-formula-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="excel-formula"
        actionLabel="Generate formula"
        inputPlaceholder="Describe what you want, e.g. “sum column B where column A is 'Paid'”…"
        outputLabel="Formula"
        controls={[
          {
            key: "app",
            label: "Spreadsheet",
            default: "Excel",
            options: [
              { label: "Excel", value: "Excel" },
              { label: "Google Sheets", value: "Google Sheets" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
