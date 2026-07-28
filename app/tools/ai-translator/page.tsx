import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("ai-translator")!;

export const metadata = toolMetadata("ai-translator");

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Dutch",
  "Russian", "Chinese (Simplified)", "Chinese (Traditional)", "Japanese", "Korean",
  "Arabic", "Hindi", "Bengali", "Urdu", "Turkish", "Polish", "Vietnamese",
  "Thai", "Indonesian", "Ukrainian",
];

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="translate"
        actionLabel="Translate"
        inputPlaceholder="Paste the text you want to translate…"
        outputLabel="Translation"
        controls={[
          {
            key: "language",
            label: "Translate to",
            default: "Spanish",
            options: LANGUAGES.map((l) => ({ label: l, value: l })),
          },
        ]}
      />
    </ToolShell>
  );
}
