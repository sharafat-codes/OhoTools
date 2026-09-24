import type { Metadata } from "next";

import { LoginForm } from "@/modules/auth/components/login-form";
import { isGoogleAuthEnabled } from "@/lib/auth";
import { safeRedirect } from "@/modules/auth/redirect";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return (
    <LoginForm redirectTo={safeRedirect(redirect)} googleEnabled={isGoogleAuthEnabled} />
  );
}
