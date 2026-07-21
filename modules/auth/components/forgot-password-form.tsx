"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoaderCircleIcon, MailCheckIcon } from "lucide-react";

import { requestPasswordReset } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/modules/auth/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ForgotPasswordForm() {
  const [sent, setSent] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordInput) {
    const { error } = await requestPasswordReset({
      email: values.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error(error.message ?? "Something went wrong. Try again.");
      return;
    }

    // Always show success to avoid leaking which emails are registered.
    setSent(true);
  }

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <div className="mb-1 grid size-9 place-items-center rounded-lg bg-muted text-foreground">
            <MailCheckIcon className="size-4.5" />
          </div>
          <CardTitle className="text-lg">Check your email</CardTitle>
          <CardDescription>
            If an account exists for that address, we&apos;ve sent a link to
            reset your password.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" size="lg" render={<Link href="/login" />}>
            Back to login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="forgot-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Button
          type="submit"
          form="forgot-form"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          Send reset link
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-foreground hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
