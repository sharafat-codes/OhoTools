import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { Slugify } from "@/modules/tools/components/slugify";

const tool = getTool("slugify")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/slugify" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <Slugify />
    </ToolShell>
  );
}
