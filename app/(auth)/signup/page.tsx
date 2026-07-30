import type { Metadata } from "next";

import { SignupForm } from "@/modules/auth/components/signup-form";
import { isGoogleAuthEnabled } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return <SignupForm googleEnabled={isGoogleAuthEnabled} />;
}
