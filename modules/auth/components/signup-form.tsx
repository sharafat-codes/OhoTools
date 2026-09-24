"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

import { signUp } from "@/lib/auth-client";
import { signUpSchema, type SignUpInput } from "@/modules/auth/validations";
import { SocialAuth } from "@/modules/auth/components/social-buttons";
import { safeRedirect } from "@/modules/auth/redirect";
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

export function SignupForm({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const router = useRouter();

  // Where to land after signing up. An upgrade prompt elsewhere on the site
  // can send a signed-out visitor here and get them back to what they were
  // doing. Read after mount rather than from server searchParams, so this
  // page stays statically rendered; it is only needed once the form is sent.
  const [redirectTo, setRedirectTo] = React.useState("/dashboard");
  React.useEffect(() => {
    setRedirectTo(safeRedirect(new URLSearchParams(window.location.search).get("redirect")));
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpInput) {
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message ?? "Could not create your account.");
      return;
    }

    toast.success("Account created. Welcome to OhoTool!");
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h1" className="text-lg">Create your account</CardTitle>
        <CardDescription>Start using OhoTool for free.</CardDescription>
      </CardHeader>
      <CardContent>
        <SocialAuth enabled={googleEnabled} redirectTo={redirectTo} />
        <form
          id="signup-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Jane Doe"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

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

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
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
        </form>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <Button
          type="submit"
          form="signup-form"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          Create account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={redirectTo === "/dashboard" ? "/login" : `/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-foreground hover:underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
