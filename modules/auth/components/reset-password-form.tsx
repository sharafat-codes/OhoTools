"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

import { resetPassword } from "@/lib/auth-client";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
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

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(values: ResetPasswordInput) {
    const { error } = await resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      toast.error(error.message ?? "Could not reset your password.");
      return;
    }

    toast.success("Password updated. Please log in.");
    router.push("/login");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h1" className="text-lg">Set a new password</CardTitle>
        <CardDescription>Choose a strong password you don&apos;t use elsewhere.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="reset-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="reset-form"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          Update password
        </Button>
      </CardFooter>
    </Card>
  );
}
