import { categoryMetadata } from "@/modules/tools/registry";
import { CategoryHub } from "@/modules/tools/components/category-hub";

export const metadata = categoryMetadata("image-editing");

export default function Page() {
  return <CategoryHub slug="image-editing" />;
}
