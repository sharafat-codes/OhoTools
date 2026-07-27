import { categoryMetadata } from "@/modules/tools/registry";
import { CategoryHub } from "@/modules/tools/components/category-hub";

export const metadata = categoryMetadata("image");

export default function Page() {
  return <CategoryHub slug="image" />;
}
