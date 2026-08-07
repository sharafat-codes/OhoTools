import type { Metadata } from "next";

import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/modules/settings/components/profile-form";
import { PasswordForm } from "@/modules/settings/components/password-form";
import { EmailPreferencesForm } from "@/modules/settings/components/email-preferences-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  let marketingEmails = true;
  try {
    const prefs = await prisma.user.findUnique({
      where: { id: (user as { id: string }).id },
      select: { marketingEmails: true },
    });
    marketingEmails = prefs?.marketingEmails ?? true;
  } catch {
    /* fall back to opted-in */
  }

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
        <EmailPreferencesForm defaultEnabled={marketingEmails} />
        <PasswordForm />
      </div>
    </div>
  );
}
