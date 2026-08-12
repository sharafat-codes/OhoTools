import { getCurrentUser } from "@/lib/dal";
import { SiteHeader } from "@/modules/marketing/components/site-header";
import { SiteFooter } from "@/modules/marketing/components/site-footer";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader isAuthed={!!user} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
