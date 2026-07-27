import { categoryMetadata } from "@/modules/tools/registry";
import { CategoryHub } from "@/modules/tools/components/category-hub";

export const metadata = categoryMetadata("generators");

export default function Page() {
  return <CategoryHub slug="generators" />;
}
