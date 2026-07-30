import type { Metadata } from "next";

import { LoginForm } from "@/modules/auth/components/login-form";
import { isGoogleAuthEnabled } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  return (
    <LoginForm redirectTo={redirect ?? "/dashboard"} googleEnabled={isGoogleAuthEnabled} />
  );
}
