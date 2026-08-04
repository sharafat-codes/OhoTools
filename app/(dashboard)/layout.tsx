import { requireUser, isAdmin } from "@/lib/dal";
import { AppSidebar } from "@/modules/dashboard/components/app-sidebar";
import { Topbar } from "@/modules/dashboard/components/topbar";

// Private user area — never index (also robots-disallowed).
export const metadata = { robots: { index: false, follow: false } };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Security boundary: proxy.ts does an optimistic redirect, but this is the
  // real check. Every dashboard route renders through here.
  const user = await requireUser();
  const plan = (user as { plan?: string }).plan ?? "FREE";
  const admin = isAdmin(user as { role?: string | null; email?: string | null });

  return (
    <div className="flex min-h-full flex-1">
      <AppSidebar plan={plan} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          user={{ name: user.name, email: user.email, image: user.image }}
          isAdmin={admin}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
