import { categoryMetadata } from "@/modules/tools/registry";
import { CategoryHub } from "@/modules/tools/components/category-hub";

export const metadata = categoryMetadata("developer");

export default function Page() {
  return <CategoryHub slug="developer" />;
}
