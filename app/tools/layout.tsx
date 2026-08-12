import { getCurrentUser } from "@/lib/dal";
import { PlanProvider } from "@/components/plan-provider";
import { SiteHeader } from "@/modules/marketing/components/site-header";
import { SiteFooter } from "@/modules/marketing/components/site-footer";

export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader isAuthed={!!user} />
      <PlanProvider authed={!!user} plan={(user as { plan?: string } | null)?.plan ?? "FREE"}>
        <main className="flex-1">{children}</main>
      </PlanProvider>
      <SiteFooter />
    </div>
  );
}
