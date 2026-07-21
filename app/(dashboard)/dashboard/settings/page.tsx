import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { ProfileForm } from "@/modules/settings/components/profile-form";
import { PasswordForm } from "@/modules/settings/components/password-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and security.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <ProfileForm defaultName={user.name} email={user.email} />
        <PasswordForm />
      </div>
    </div>
  );
}
