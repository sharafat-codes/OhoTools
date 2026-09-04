import { getTool, toolMetadata } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { AiTextTool } from "@/modules/tools/components/ai-text-tool";

const tool = getTool("story-generator")!;

export const metadata = toolMetadata("story-generator");

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <AiTextTool
        task="story"
        actionLabel="Write story"
        inputPlaceholder="Describe your premise, characters, or idea…"
        outputLabel="Story"
        controls={[
          {
            key: "genre",
            label: "Genre",
            default: "general",
            options: [
              { label: "General", value: "general" },
              { label: "Fantasy", value: "fantasy" },
              { label: "Sci-fi", value: "science fiction" },
              { label: "Mystery", value: "mystery" },
              { label: "Romance", value: "romance" },
              { label: "Adventure", value: "adventure" },
              { label: "Horror", value: "horror" },
              { label: "Children's", value: "children's" },
            ],
          },
          {
            key: "length",
            label: "Length",
            default: "short",
            options: [
              { label: "Flash (very short)", value: "very short flash-fiction" },
              { label: "Short", value: "short" },
              { label: "Medium", value: "medium" },
            ],
          },
        ]}
      />
    </ToolShell>
  );
}
