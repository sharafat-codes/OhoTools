import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("sql-generator")!;

export const metadata = toolMetadata("sql-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="sql-generator"
        actionLabel="Generate SQL"
        inputPlaceholder="Describe the query, e.g. 'top 5 customers by total order value in 2024'. Paste your table schema for better results…"
        outputLabel="SQL query"
        controls={[
          {
            key: "dialect",
            label: "Dialect",
            default: "PostgreSQL",
            options: [
              { label: "PostgreSQL", value: "PostgreSQL" },
              { label: "MySQL", value: "MySQL" },
              { label: "SQLite", value: "SQLite" },
              { label: "SQL Server", value: "SQL Server" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
