import { categoryMetadata } from "@/modules/tools/registry";
import { CategoryHub } from "@/modules/tools/components/category-hub";

export const metadata = categoryMetadata("converters");

export default function Page() {
  return <CategoryHub slug="converters" />;
}
