import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken, verifySubscriberUnsubToken } from "@/lib/email-prefs";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let ok = false;
  const subscriberId = token ? verifySubscriberUnsubToken(token) : null;
  if (subscriberId) {
    try {
      await prisma.subscriber.update({ where: { id: subscriberId }, data: { consentMarketing: false } });
      ok = true;
    } catch {
      ok = false;
    }
  } else {
    const userId = token ? verifyUnsubscribeToken(token) : null;
    if (userId) {
      try {
        await prisma.user.update({ where: { id: userId }, data: { marketingEmails: false } });
        ok = true;
      } catch {
        ok = false;
      }
    }
  }

  return (
    <div className="grid min-h-svh place-items-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <Logo size="sm" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-8">
          {ok ? (
            <>
              <CheckCircle2Icon className="mx-auto size-10 text-emerald-600 dark:text-emerald-500" />
              <h1 className="mt-4 font-heading text-xl font-semibold tracking-tight">You&rsquo;re unsubscribed</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                You won&rsquo;t receive OhoTool product updates anymore. You&rsquo;ll still get essential account emails
                like password resets.
              </p>
            </>
          ) : (
            <>
              <XCircleIcon className="mx-auto size-10 text-muted-foreground" />
              <h1 className="mt-4 font-heading text-xl font-semibold tracking-tight">Link not valid</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This unsubscribe link is invalid or has expired. If you keep getting emails, reply to one and we&rsquo;ll
                sort it out.
              </p>
            </>
          )}
          <Link
            href="/"
            className="mt-6 inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Back to OhoTool
          </Link>
        </div>
      </div>
    </div>
  );
}
