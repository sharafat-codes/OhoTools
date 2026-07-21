"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

import { updateUser } from "@/lib/auth-client";
import {
  updateProfileSchema,
  type UpdateProfileInput,
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

export function ProfileForm({
  defaultName,
  email,
}: {
  defaultName: string;
  email: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: defaultName },
  });

  async function onSubmit(values: UpdateProfileInput) {
    const { error } = await updateUser({ name: values.name });

    if (error) {
      toast.error(error.message ?? "Could not update your profile.");
      return;
    }

    toast.success("Profile updated.");
    reset({ name: values.name });
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal details.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="profile-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled readOnly />
            <p className="text-xs text-muted-foreground">
              Email changes will be available in a future update.
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          type="submit"
          form="profile-form"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting && <LoaderCircleIcon className="animate-spin" />}
          Save changes
        </Button>
      </CardFooter>
    </Card>
  );
}
