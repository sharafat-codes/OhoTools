import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UrlToPdf } from "@/modules/tools/components/url-to-pdf";

const tool = getTool("url-to-pdf")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/url-to-pdf" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UrlToPdf />
    </ToolShell>
  );
}
