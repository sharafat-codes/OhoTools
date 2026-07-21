import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { CronExplainer } from "@/modules/tools/components/cron-explainer";

const tool = getTool("cron-explainer")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/cron-explainer" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <CronExplainer />
    </ToolShell>
  );
}
