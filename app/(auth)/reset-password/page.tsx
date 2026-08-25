import type { Metadata } from "next";
import Link from "next/link";

import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  if (error || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invalid or expired link</CardTitle>
          <CardDescription>
            This password reset link is no longer valid. Request a new one to
            continue
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="lg" render={<Link href="/forgot-password" />}>
            Request a new link
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return <ResetPasswordForm token={token} />;
}
